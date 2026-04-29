(function () {
  const script = document.currentScript;
  const token = script.getAttribute('data-token');
  if (!token) { console.error('Box Automatismo: falta data-token'); return; }

  const API_URL = script.dataset.apiUrl || script.src.replace(/\/widget\/widget\.js$/, '');

  let isOpen = false;
  let sessionId = sessionStorage.getItem('box_chat_session') || null;

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    .box-chat-btn{position:fixed;bottom:24px;right:24px;width:60px;height:60px;border-radius:50%;background:#000;border:none;cursor:pointer;box-shadow:0 4px 24px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;z-index:999998;transition:transform .2s,box-shadow .2s}
    .box-chat-btn:hover{transform:scale(1.08);box-shadow:0 6px 32px rgba(0,0,0,.4)}
    .box-chat-btn svg{width:32px;height:32px}
    .box-chat-panel{position:fixed;bottom:96px;right:24px;width:350px;height:500px;border-radius:16px;background:#fff;box-shadow:0 12px 48px rgba(0,0,0,.15);z-index:999999;display:flex;flex-direction:column;overflow:hidden;animation:boxSlideUp .25s ease-out}
    @keyframes boxSlideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .box-chat-header{background:#000;color:#fff;padding:16px 20px;display:flex;align-items:center;justify-content:space-between}
    .box-chat-header h4{margin:0;font-size:15px;font-weight:600}
    .box-chat-close{background:none;border:none;color:#fff;cursor:pointer;font-size:20px;padding:0 4px;line-height:1}
    .box-chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
    .box-chat-msg{max-width:80%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.5;word-wrap:break-word}
    .box-chat-msg.user{align-self:flex-end;background:#000;color:#fff;border-bottom-right-radius:4px}
    .box-chat-msg.assistant{align-self:flex-start;background:#f3f3f3;color:#222;border-bottom-left-radius:4px}
    .box-chat-typing{align-self:flex-start;background:#f3f3f3;color:#888;padding:10px 14px;border-radius:16px;border-bottom-left-radius:4px;font-size:14px;display:flex;gap:4px;align-items:center}
    .box-chat-typing span{width:6px;height:6px;background:#999;border-radius:50%;animation:boxBounce 1.4s infinite both}
    .box-chat-typing span:nth-child(2){animation-delay:.2s}
    .box-chat-typing span:nth-child(3){animation-delay:.4s}
    @keyframes boxBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
    .box-chat-input-area{padding:12px 16px;border-top:1px solid #eee;display:flex;gap:8px}
    .box-chat-input{flex:1;border:1px solid #ddd;border-radius:24px;padding:10px 16px;font-size:14px;outline:none;font-family:inherit}
    .box-chat-input:focus{border-color:#000}
    .box-chat-send{background:#000;color:#fff;border:none;border-radius:50%;width:38px;height:38px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
    .box-chat-send:hover{background:#333}
    .box-chat-send:disabled{background:#ccc;cursor:not-allowed}
    @media(max-width:480px){
      .box-chat-panel{width:100%;height:100%;bottom:0;right:0;border-radius:0}
      .box-chat-btn{bottom:16px;right:16px}
    }
  `;
  document.head.appendChild(style);

  // Toggle button
  const btn = document.createElement('button');
  btn.className = 'box-chat-btn';
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
  btn.setAttribute('aria-label', 'Abrir chat');
  document.body.appendChild(btn);

  let panel = null;

  function createPanel() {
    panel = document.createElement('div');
    panel.className = 'box-chat-panel';

    const header = document.createElement('div');
    header.className = 'box-chat-header';
    header.innerHTML = `<h4 id="box-chat-title">Cargando...</h4><button class="box-chat-close" aria-label="Cerrar chat">&times;</button>`;

    const messages = document.createElement('div');
    messages.className = 'box-chat-messages';
    messages.id = 'box-chat-messages';

    const inputArea = document.createElement('div');
    inputArea.className = 'box-chat-input-area';

    const input = document.createElement('input');
    input.className = 'box-chat-input';
    input.type = 'text';
    input.placeholder = 'Escribe un mensaje...';
    input.id = 'box-chat-input';

    const sendBtn = document.createElement('button');
    sendBtn.className = 'box-chat-send';
    sendBtn.id = 'box-chat-send';
    sendBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

    inputArea.appendChild(input);
    inputArea.appendChild(sendBtn);
    panel.appendChild(header);
    panel.appendChild(messages);
    panel.appendChild(inputArea);
    document.body.appendChild(panel);

    // Close
    header.querySelector('.box-chat-close').addEventListener('click', close);

    // Send
    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });
  }

  function open() {
    if (!panel) createPanel();
    panel.style.display = 'flex';
    btn.style.display = 'none';
    isOpen = true;

    // Welcome message only once
    const msgs = document.getElementById('box-chat-messages');
    if (msgs && !msgs.children.length) {
      loadBoxInfo();
    }

    setTimeout(() => {
      const input = document.getElementById('box-chat-input');
      if (input) input.focus();
    }, 300);
  }

  function close() {
    if (panel) panel.style.display = 'none';
    btn.style.display = 'flex';
    isOpen = false;
  }

  async function loadBoxInfo() {
    const title = document.getElementById('box-chat-title');
    title.textContent = 'Anboto Crossfit';
    addMessage('assistant', '¡Hola! Soy el asistente de Anboto Crossfit. ¿En qué puedo ayudarte?');
  }

  function addMessage(role, text) {
    const msgs = document.getElementById('box-chat-messages');
    if (!msgs) return;
    const div = document.createElement('div');
    div.className = `box-chat-msg ${role}`;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function showTyping() {
    const msgs = document.getElementById('box-chat-messages');
    if (!msgs) return;
    const div = document.createElement('div');
    div.className = 'box-chat-typing';
    div.id = 'box-chat-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('box-chat-typing');
    if (el) el.remove();
  }

  async function send() {
    const input = document.getElementById('box-chat-input');
    const sendBtn = document.getElementById('box-chat-send');
    const text = (input.value || '').trim();
    if (!text) return;

    input.value = '';
    addMessage('user', text);
    sendBtn.disabled = true;
    showTyping();

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, boxToken: token, sessionId })
      });

      const data = await res.json();
      hideTyping();

      if (data.error) {
        addMessage('assistant', data.error);
      } else {
        if (data.sessionId) {
          sessionId = data.sessionId;
          sessionStorage.setItem('box_chat_session', sessionId);
        }
        addMessage('assistant', data.reply);
      }
    } catch {
      hideTyping();
      addMessage('assistant', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  btn.addEventListener('click', open);
})();