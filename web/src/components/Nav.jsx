import { useState, useEffect } from 'react';
import { useLang, T } from '../i18n/LangContext.jsx';
import { Pico } from './icons.jsx';
import { WHATSAPP_URL } from '../data/site.js';

const NAV_LINKS = [
  ['#que-es', 'nav.train'],
  ['#disciplinas', 'nav.classes'],
  ['#horarios', 'nav.sched'],
  ['#coaches', 'nav.coaches'],
  ['#faq', 'nav.faq'],
];

const MOBILE_LINKS = [
  ['#que-es', 'nav.train'],
  ['#disciplinas', 'nav.classes'],
  ['#horarios', 'nav.sched'],
  ['#coaches', 'nav.coaches'],
  ['#opiniones', 'nav.reviews'],
  ['#faq', 'nav.faq'],
];

export default function Nav() {
  const { lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const closeMobile = () => setOpen(false);

  return (
    <>
      <nav id="nav" className={`${scrolled ? 'scrolled' : ''} ${open ? 'menu-open' : ''}`.trim()}>
        <div className="nav-pill">
          <a href="#top" className="logo">
            <Pico size={26} />
            <span className="lk">
              <span className="lk-main">ANBOTO</span>
              <span className="lk-sub lk-x">Strength &amp; Conditioning</span>
            </span>
          </a>
          <div className="nav-right">
            <div className="nav-links">
              {NAV_LINKS.map(([href, k]) => (
                <T key={k} as="a" href={href} className="nl" k={k} />
              ))}
              <T as="a" href="#apuntarse" className="nav-cta" k="nav.cta" />
            </div>
            <div className="lang">
              <button type="button" className={`lang-btn ${lang === 'es' ? 'active' : ''}`.trim()}
                data-lang="es" aria-label="Castellano" aria-pressed={lang === 'es'}
                onClick={() => setLang('es')}>ES</button>
              <button type="button" className={`lang-btn ${lang === 'eu' ? 'active' : ''}`.trim()}
                data-lang="eu" aria-label="Euskara" aria-pressed={lang === 'eu'}
                onClick={() => setLang('eu')}>EU</button>
            </div>
            <button className={`hamburger ${open ? 'open' : ''}`.trim()} id="hamburger"
              aria-label="Menú" aria-expanded={open} aria-controls="mobileMenu"
              onClick={() => setOpen((v) => !v)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${open ? 'open' : ''}`.trim()} id="mobileMenu" role="dialog" aria-modal="true" aria-label="Menú">
        <div className="mm-bg" aria-hidden="true"><Pico size={460} /></div>
        <T as="span" className="mm-eyebrow" k="menu.word" />
        <div className="mm-nav">
          {MOBILE_LINKS.map(([href, k], i) => (
            <a key={k} href={href} className="mm-link" style={{ '--i': i }} onClick={closeMobile}>
              <span className="mm-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="mm-node" aria-hidden="true"></span>
              <T as="span" className="mm-txt" k={k} />
            </a>
          ))}
        </div>
        <div className="mm-foot">
          <a href="#apuntarse" className="mm-cta cta-shine" onClick={closeMobile}>
            <T as="span" k="cta.book" /> <span className="arr">→</span>
          </a>
          <div className="mm-contact">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener">WhatsApp</a>
            <span>·</span>
            <a href="tel:+34688661924">688 661 924</a>
            <span>·</span>
            <span>Iurreta</span>
          </div>
        </div>
      </div>
    </>
  );
}
