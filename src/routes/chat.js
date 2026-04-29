const { Router } = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../lib/supabase');
const { buildSystemPrompt } = require('../lib/prompt');
const { createSignup } = require('../lib/email');

const router = Router();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://api.anthropic.com'
});
const MODEL = 'claude-sonnet-4-5-20250929';
const MAX_MESSAGES_PER_SESSION = 20;
const HISTORY_LIMIT = 10;

router.post('/chat', async (req, res) => {
  try {
    const { message, boxToken, sessionId } = req.body;

    if (!message || !boxToken) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: message, boxToken' });
    }

    // Load box by widget_token
    const { data: box, error: boxError } = await supabase
      .from('boxes')
      .select('*')
      .eq('widget_token', boxToken)
      .single();

    if (boxError || !box) {
      return res.status(404).json({ error: 'Box no encontrado' });
    }

    if (!box.widget_active) {
      return res.status(403).json({ error: 'Widget desactivado' });
    }

    // Create or retrieve conversation
    const currentSessionId = sessionId || uuidv4();
    let conversation;

    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .eq('box_id', box.id)
      .eq('session_id', currentSessionId)
      .single();

    if (existing) {
      conversation = existing;

      if (conversation.message_count >= MAX_MESSAGES_PER_SESSION) {
        return res.status(429).json({ error: 'Límite de mensajes alcanzado para esta sesión' });
      }
    } else {
      const { data: created, error: createError } = await supabase
        .from('conversations')
        .insert({ box_id: box.id, session_id: currentSessionId })
        .select()
        .single();

      if (createError) {
        return res.status(500).json({ error: 'Error al crear conversación' });
      }
      conversation = created;
    }

    // Save user message
    await supabase.from('messages').insert({
      conversation_id: conversation.id,
      role: 'user',
      content: message
    });

    // Load recent history
    const { data: history } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(HISTORY_LIMIT);

    const messages = (history || []).map(m => ({
      role: m.role,
      content: m.content
    }));

    // Call Claude
    const completion = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: buildSystemPrompt(box),
      messages
    });

    const reply = completion.content[0].text;

    // Check for SIGNUP_DATA in the reply
    let cleanReply = reply;
    const signupMatch = reply.match(/SIGNUP_DATA:(\{[^}]+\})/);
    if (signupMatch) {
      try {
        const signupData = JSON.parse(signupMatch[1]);
        await createSignup({ ...signupData, origen: 'chat' });
        console.log('Signup created from chat:', signupData.nombre);
      } catch (signupErr) {
        console.error('Error creating signup from chat:', signupErr.message || signupErr);
      }
      // Remove SIGNUP_DATA block from reply sent to user
      cleanReply = reply.replace(/\n?SIGNUP_DATA:\{[^}]+\}/, '').trim();
    }

    // Save assistant message (with original reply for logging, but we send cleanReply)
    await supabase.from('messages').insert({
      conversation_id: conversation.id,
      role: 'assistant',
      content: reply
    });

    // Update conversation counters
    await supabase
      .from('conversations')
      .update({
        message_count: conversation.message_count + 2,
        last_message_at: new Date().toISOString()
      })
      .eq('id', conversation.id);

    res.json({ reply: cleanReply, sessionId: currentSessionId });

  } catch (err) {
    console.error('Error en /api/chat:', err.message || err);
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor', details: err.message });
  }
});

module.exports = router;