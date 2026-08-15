import { useState, useEffect, useRef } from 'react';
import { T } from '../i18n/LangContext.jsx';
import { useMagnet } from '../hooks/useMagnet.js';
import { HERO_SLIDES } from '../data/site.js';

// Palabra kinética: rota las disciplinas como acento vivo del hero.
const KWORDS = ['CrossFit', 'Halterofilia', 'Hyrox', 'Endurance', 'Oinarriak', 'Komunitatea'];
function KineticWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % KWORDS.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="hk-rot">
      <span className="hk-word" key={i}>{KWORDS[i]}</span>
    </span>
  );
}

// Hero asimétrico "altímetro": titular editorial + panel glass de instrumento
// (altitud, coordenadas, valoración) sobre foto en duotono oscuro.
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

      <div className="h-grid">
        <div className="h-lead">
          <span className="eyebrow">↑ 1.331 M · Iurreta, Bizkaia</span>
          <h1><T as="span" k="hero.l1" /> <T as="span" className="br" k="hero.l2" /></h1>
          <div className="h-kinetic">
            <span className="hk-label">Entrena</span> <KineticWord />
          </div>
          <T as="p" className="hero-desc" k="hero.desc" />
          <div className="hero-btns">
            <a ref={ctaRef} href="#apuntarse" className="btn btn-primary cta-shine">
              <T as="span" k="cta.book" /> <span className="arr">→</span>
            </a>
            <T as="a" href="#que-es" className="btn btn-line" k="cta.whatis" />
          </div>
        </div>

        <aside className="altimeter">
          <div className="alt-head"><span>Altimetroa</span><span className="alt-live">Hoy</span></div>
          <div className="alt-big">↑ 1.331<span>M</span></div>
          <div className="alt-rows">
            <div className="alt-row"><span>Koordenatuak</span><b>43.1681°N · 2.6335°W</b></div>
            <div className="alt-row"><span>Google</span><b>4.9 ★ · 46</b></div>
            <div className="alt-row"><span>Diziplinak</span><b>7 · todos los niveles</b></div>
          </div>
          <a href="#apuntarse" className="alt-cta cta-shine">1ª clase gratis <span className="arr">→</span></a>
        </aside>
      </div>
    </header>
  );
}
