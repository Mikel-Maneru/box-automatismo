import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { I18N } from './dict.js';

const LangContext = createContext(null);

// Provider de idioma EU·ES. Default 'es' para casar el prerender/hidratación;
// en cliente restaura la preferencia guardada (localStorage) tras montar.
export function LangProvider({ children }) {
  const [lang, setLangState] = useState('es');

  const setLang = useCallback((l) => {
    const v = l === 'eu' ? 'eu' : 'es';
    setLangState(v);
    try { localStorage.setItem('anboto_lang', v); } catch {}
  }, []);

  useEffect(() => {
    try { if (localStorage.getItem('anboto_lang') === 'eu') setLangState('eu'); } catch {}
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key) => {
    const pair = I18N[key];
    if (!pair) return '';
    return pair[lang === 'eu' ? 1 : 0] ?? '';
  }, [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang debe usarse dentro de LangProvider');
  return ctx;
}

// Renderiza una clave i18n en el elemento `as`. Si el valor trae HTML (<br>,<b>,<em>)
// lo inyecta como innerHTML — replica exactamente el comportamiento del sitio original.
const HTML_RE = /[<&]/;
export function T({ k, as: As = 'span', html, children, ...rest }) {
  const { t } = useLang();
  const v = t(k);
  const isHtml = html ?? HTML_RE.test(v);
  if (isHtml) return <As {...rest} dangerouslySetInnerHTML={{ __html: v }} />;
  return <As {...rest}>{v || children}</As>;
}
