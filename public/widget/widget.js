(function () {
  const script = document.currentScript;
  const token = script.getAttribute('data-token');
  if (!token) { console.error('Box Automatismo: falta data-token'); return; }

  const API_URL = script.dataset.apiUrl || '';

  let isOpen = false;
  let sessionId = sessionStorage.getItem('box_chat_session') || null;

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    /* Paleta de marca Anboto: pizarra #14110E, granito #777069, bruma #D1C8C1,
       caliza #F4EDE2, madera #A7693B (acento), cuero #703D26 */
    .box-chat-btn{position:fixed;bottom:24px;right:24px;width:60px;height:60px;border-radius:50%;background:#A7693B;border:none;cursor:pointer;box-shadow:0 6px 24px rgba(20,17,14,.35);display:flex;align-items:center;justify-content:center;z-index:999998;transition:transform .2s,box-shadow .2s,background .2s}
    /* El pico va relleno del color del boton (efecto recorte), asi que el fondo NO cambia en hover */
    .box-chat-btn:hover{transform:translateY(-2px) scale(1.06);box-shadow:0 10px 32px rgba(20,17,14,.45)}
    .box-chat-btn:focus-visible{outline:3px solid #F4EDE2;outline-offset:3px}
    .box-chat-btn svg{width:30px;height:30px}
    .box-chat-panel{position:fixed;bottom:96px;right:24px;width:350px;height:500px;border-radius:18px;background:#F4EDE2;box-shadow:0 16px 52px rgba(20,17,14,.28);z-index:999999;display:flex;flex-direction:column;overflow:hidden;animation:boxSlideUp .25s ease-out;font-family:'Archivo',system-ui,-apple-system,'Segoe UI',sans-serif}
    @keyframes boxSlideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .box-chat-header{background:#14110E;color:#F4EDE2;padding:15px 18px;display:flex;align-items:center;gap:10px;justify-content:space-between}
    .box-chat-header h4{margin:0;font-size:15px;font-weight:800;letter-spacing:-.01em;display:flex;align-items:center;gap:9px}
    .box-chat-header h4 svg{width:17px;height:17px;flex:none}
    .box-chat-close{background:none;border:none;color:#D1C8C1;cursor:pointer;font-size:22px;padding:0 4px;line-height:1;transition:color .2s}
    .box-chat-close:hover{color:#F4EDE2}
    .box-chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
    .box-chat-msg{max-width:80%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.5;word-wrap:break-word}
    .box-chat-msg.user{align-self:flex-end;background:#A7693B;color:#F4EDE2;border-bottom-right-radius:4px}
    .box-chat-msg.assistant{align-self:flex-start;background:#E7DECF;color:#14110E;border-bottom-left-radius:4px}
    .box-chat-typing{align-self:flex-start;background:#E7DECF;color:#777069;padding:10px 14px;border-radius:16px;border-bottom-left-radius:4px;font-size:14px;display:flex;gap:4px;align-items:center}
    .box-chat-typing span{width:6px;height:6px;background:#A7693B;border-radius:50%;animation:boxBounce 1.4s infinite both}
    .box-chat-typing span:nth-child(2){animation-delay:.2s}
    .box-chat-typing span:nth-child(3){animation-delay:.4s}
    @keyframes boxBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
    .box-chat-input-area{padding:12px 16px;border-top:1px solid #D1C8C1;display:flex;gap:8px;background:#F4EDE2}
    .box-chat-input{flex:1;border:1px solid #D1C8C1;background:#fff;color:#14110E;border-radius:24px;padding:10px 16px;font-size:14px;outline:none;font-family:inherit}
    .box-chat-input::placeholder{color:#777069}
    .box-chat-input:focus{border-color:#A7693B;box-shadow:0 0 0 3px rgba(167,105,59,.18)}
    .box-chat-send{background:#A7693B;color:#F4EDE2;border:none;border-radius:50%;width:38px;height:38px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
    .box-chat-send:hover{background:#703D26}
    .box-chat-send:disabled{background:#D1C8C1;cursor:not-allowed}
    .box-chat-legal{padding:0 16px 10px;background:#F4EDE2;font-size:11px;line-height:1.4;color:#777069;text-align:center}
    .box-chat-legal a{color:#A7693B;text-decoration:underline}
    @media(prefers-reduced-motion:reduce){
      .box-chat-btn,.box-chat-panel{transition:none;animation:none}
      .box-chat-btn:hover{transform:none}
      .box-chat-typing span{animation:none}
    }
    @media(max-width:480px){
      .box-chat-panel{width:100%;height:100%;bottom:0;right:0;border-radius:0}
      .box-chat-btn{bottom:16px;right:16px}
    }
  `;
  document.head.appendChild(style);

  // Toggle button
  const btn = document.createElement('button');
  btn.className = 'box-chat-btn';
  // Burbuja de chat con el pico de Anboto recortado en negativo (mismo recurso de marca que el logo)
  const PICO_BUBBLE = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#F4EDE2" d="M5 3h14a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-6.6l-4.7 3.6A.7.7 0 0 1 6.6 19v-3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z"/><path fill="#A7693B" d="M12 6.1l4.3 7.4H7.7z"/></svg>`;
  btn.innerHTML = PICO_BUBBLE;
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

    // Aviso de privacidad. El chat pide nombre y telefono para apuntar a una clase de
    // prueba, asi que es un punto de recogida de datos personales y necesita informar antes
    // de recogerlos (RGPD art. 13), igual que el formulario. Va fijo debajo del campo, no
    // como mensaje, porque addMessage usa textContent y no admite enlaces.
    const aviso = document.createElement('div');
    aviso.className = 'box-chat-legal';
    aviso.innerHTML = 'Lo que escribas se guarda para poder responderte. '
      + '<a href="/privacidad" target="_blank" rel="noopener">Politica de privacidad</a>';

    panel.appendChild(header);
    panel.appendChild(messages);
    panel.appendChild(inputArea);
    panel.appendChild(aviso);
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
    title.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#A7693B" d="M12 3.5l9 17H3z"/></svg><span>Anboto SC</span>`;
    addMessage('assistant', '¡Hola! Soy el asistente de Anboto SC. ¿En qué puedo ayudarte?');
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