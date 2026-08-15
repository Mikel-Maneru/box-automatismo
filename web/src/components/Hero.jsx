import { useState, useEffect, useRef } from 'react';
import { T } from '../i18n/LangContext.jsx';
import { useMagnet } from '../hooks/useMagnet.js';
import { HERO_SLIDES, INSTAGRAM_URL } from '../data/site.js';

// Hero inmersivo a sangre. Slideshow "boomerang" (ping-pong) que recrea el loop de
// fotos del sitio original. Respeta prefers-reduced-motion (queda en la 1ª foto).
export default function Hero() {
  const [active, setActive] = useState(0);
  const ctaRef = useRef(null);
  useMagnet(ctaRef);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    let idx = 0, dir = 1;
    const id = setInterval(() => {
      idx += dir;
      if (idx >= HERO_SLIDES.length - 1) { idx = HERO_SLIDES.length - 1; dir = -1; }
      else if (idx <= 0) { idx = 0; dir = 1; }
      setActive(idx);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="hero" id="top">
      <div className="h-bg" aria-hidden="true">
        {HERO_SLIDES.map((src, i) => (
          <div key={src} className={`slide ${i === active ? 'show' : ''}`.trim()}
            style={{ backgroundImage: `url('${src}')` }} />
        ))}
      </div>
      <div className="h-scrim" aria-hidden="true"></div>
      <div className="h-inner">
        <span className="eyebrow">↑ 1.331 M · Iurreta, Bizkaia</span>
        <h1>
          <T as="span" k="hero.l1" /> <T as="span" className="br" k="hero.l2" />
        </h1>
        <T as="p" className="hero-desc" k="hero.desc" />
        <div className="hero-btns">
          <a ref={ctaRef} href="#apuntarse" className="btn btn-primary cta-shine">
            <T as="span" k="cta.book" /> <span className="arr">→</span>
          </a>
          <T as="a" href="#que-es" className="btn btn-line" k="cta.whatis" />
        </div>
      </div>
      <a className="hero-ig" href={INSTAGRAM_URL} target="_blank" rel="noopener">
        <span className="pl"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg></span>
        <T as="span" k="hero.ig" />
      </a>
    </header>
  );
}
