import { useEffect } from 'react';

// Carga el widget de chat embebido (/widget/widget.js) tras montar, con su data-token.
export default function ChatWidget() {
  useEffect(() => {
    if (document.querySelector('script[data-token="anboto-token-2024"]')) return;
    const s = document.createElement('script');
    s.src = '/widget/widget.js';
    s.setAttribute('data-token', 'anboto-token-2024');
    s.async = true;
    document.body.appendChild(s);
  }, []);
  return null;
}
