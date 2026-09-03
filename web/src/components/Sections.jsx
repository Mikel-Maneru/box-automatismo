import { useState } from 'react';
import { useLang, T } from '../i18n/LangContext.jsx';
import { Pico, PkMark, WhatsApp, Pin, Phone, Mail, InstagramIcon } from './icons.jsx';
import {
  DISCIPLINAS, OBJETIVOS, COACHES, REVIEWS, IG_PHOTOS,
  WHATSAPP_URL, INSTAGRAM_URL,
} from '../data/site.js';

/* ---------- Marquee (claims/disciplinas) ---------- */
const MARQUEE = ['WOD', 'Iniciación', 'Indarra', 'Open Box', 'Strength', 'Haltero', 'Endurance', 'Hycross'];
export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {[...MARQUEE, ...MARQUEE].map((w, i) => <span className="item" key={i}>{w}</span>)}
      </div>
    </div>
  );
}

/* ---------- Banda de foto a gran tamaño ---------- */
export function PhotoBand() {
  return (
    <section className="photoband" aria-label="Comunidad Anboto SC">
      <img src="/fotos/comunidad.jpg" alt="La comunidad de Anboto SC al completo en el box" loading="lazy" />
      <div className="pb-scrim" aria-hidden="true" />
      <div className="pb-inner">
        <T as="span" className="eyebrow" k="pb.eyebrow" />
        <T as="p" className="pb-claim rev-up" k="pb.claim" />
      </div>
    </section>
  );
}

/* ---------- 01 · Sobre nosotros (listas editoriales) ---------- */
const PILARES = [
  { n: '01', eu: 'p1.eu', h: 'p1.h', p: 'p1.p' },
  { n: '02', eu: 'p2.eu', h: 'p2.h', p: 'p2.p' },
  { n: '03', eu: 'p3.eu', h: 'p3.h', p: 'p3.p' },
];
export function SobreNosotros() {
  return (
    <section className="pad" id="sobre-nosotros">
      <div className="wrap">
        <T as="span" className="sec-index rev-up" k="p.idx" />
        <T as="h2" className="title rev-up" k="p.title" />
        <T as="p" className="lead rev-up" k="p.lead" />
        <div className="elist">
          {PILARES.map((it) => (
            <div className="ei rev-up" key={it.n}>
              <div className="mk"><span className="tri"></span>{it.n}</div>
              <div className="bd">
                <T as="span" className="eu" k={it.eu} />
                <T as="h3" k={it.h} />
                <T as="p" k={it.p} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 02 · Qué es (oscuro) ---------- */
const FEATS = [
  { n: '01', h: 'f1.h', p: 'f1.p' },
  { n: '02', h: 'f2.h', p: 'f2.p' },
  { n: '03', h: 'f3.h', p: 'f3.p' },
];
export function QueEs() {
  return (
    <section className="pad dark on-dark arch" id="que-es">
      <div className="wrap">
        <T as="span" className="sec-index rev-up" k="q.idx" />
        <T as="h2" className="title rev-up" k="q.title" />
        <div className="bento">
          <div className="bento-tile b-lg rev-up">
            <T as="span" className="bt-eyebrow" k="q.wod" />
            <T as="h3" k="f1.h" />
            <T as="p" k="f1.p" />
          </div>
          <div className="bento-tile b-photo rev-up" aria-hidden="true"
            style={{ backgroundImage: "url('/fotos/bento-grupo.jpg')" }} />
          <div className="bento-tile rev-up">
            <T as="h3" k="f2.h" />
            <T as="p" k="f2.p" />
          </div>
          <div className="bento-tile rev-up">
            <T as="h3" k="f3.h" />
            <T as="p" k="f3.p" />
          </div>
          <div className="bento-tile b-stat rev-up">
            <div className="bt-num">4.9<span>★</span></div>
            <T as="span" className="bt-lbl" k="q.grev" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 03 · Una clase para cada objetivo ---------- */
export function Disciplinas() {
  const { t } = useLang();
  const [obj, setObj] = useState(null);
  // El reveal (.rev-up -> .in) lo aplica un observer que solo corre al montar y deja de
  // observar cada tarjeta al revelarla. Una tarjeta que entra en pantalla al filtrar ya
  // no recibiría .in y se quedaría invisible; en cuanto el usuario toca el selector,
  // damos por hecho que la sección está a la vista y las mostramos.
  const [tocado, setTocado] = useState(false);
  const activo = OBJETIVOS.find((o) => o.id === obj) || null;

  const elegir = (id) => { setObj(id); setTocado(true); };

  // Las 6 disciplinas se quedan SIEMPRE montadas y se ocultan con [hidden]: el reveal
  // (.rev-up -> .in) lo aplica un IntersectionObserver que solo corre al montar, así que
  // un nodo creado al filtrar nunca recibiría .in y quedaría invisible para siempre.
  const visible = (name) => !activo || activo.clases.includes(name);
  const entrada = activo ? activo.clases[0] : null; // puerta de entrada recomendada

  return (
    <section className="pad" id="disciplinas">
      <div className="wrap">
        <T as="span" className="sec-index rev-up" k="disc.idx" />
        <T as="h2" className="title rev-up" k="disc.title" />
        <T as="p" className="lead rev-up" k="disc.lead" />

        <div className="tt-days rev-up" role="group" aria-label={t('obj.pick')}>
          <button type="button" className={`tt-day ${!activo ? 'on' : ''}`.trim()}
            aria-pressed={!activo} onClick={() => elegir(null)}>{t('obj.all')}</button>
          {OBJETIVOS.map((o) => (
            <button key={o.id} type="button" className={`tt-day ${obj === o.id ? 'on' : ''}`.trim()}
              aria-pressed={obj === o.id} onClick={() => elegir(o.id)}>{t(o.k)}</button>
          ))}
        </div>
        {activo && <T as="p" className="tt-note" k={activo.dk} />}

        <div className="elist">
          {DISCIPLINAS.map((d) => (
            <div className={`ei cls rev-up ${tocado ? 'in' : ''}`.trim()} key={d.name} hidden={!visible(d.name)}>
              <div className="mk"><span className="tri"></span></div>
              <div className="bd">
                <div className="nm">
                  <h3>{d.name}</h3>
                  {d.name === entrada && <T as="span" className="eu" k="obj.start" />}
                </div>
                <T as="p" k={d.dk} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Stats band ---------- */
export function StatBand() {
  return (
    <section className="statband arch">
      <div className="wrap">
        {/* La cifra de socios se retiro el 2026-09-02: decia "46+ miembros activos" y 46 era
            el numero de RESEÑAS de Google, no de socios — el mismo dato que ya aparece aqui
            al lado como valoracion. Xabi no quiere publicar el numero real, y tres cifras
            ciertas convencen mas que cuatro con una inventada. */}
        <div className="stat rev-up"><div className="n"><span data-count="8" data-suffix="+">8+</span></div><T as="div" className="t" k="st.l1" /></div>
        <div className="stat rev-up"><div className="n"><span data-count="6">6</span></div><T as="div" className="t" k="st.l3" /></div>
        <div className="stat rev-up"><div className="n">4.9★</div><T as="div" className="t" k="st.l4" /></div>
      </div>
    </section>
  );
}

/* ---------- Prueba gratis (banda de CTA) ---------- */
export function PruebaGratis() {
  return (
    <section className="pad dark on-dark arch" id="prueba-gratis">
      <div className="wrap">
        <div className="trial trial-band rev-up">
          <div className="tb-txt">
            <T as="span" className="tl" k="pg.eyebrow" />
            <T as="strong" k="pg.title" />
            <T as="p" k="pg.lead" />
          </div>
          <T as="a" href="#apuntarse" k="pg.cta" />
        </div>
      </div>
    </section>
  );
}

/* ---------- 06 · Coaches ---------- */
export function Coaches() {
  return (
    <section className="pad" id="coaches">
      <div className="wrap">
        <T as="span" className="sec-index rev-up" k="c.idx" />
        <T as="h2" className="title rev-up" k="c.title" />
        <div className="coach-grid">
          {COACHES.map((c) => (
            <div className="coach rev-up" key={c.name}>
              <div className="coach-ph"><span className="ini">{c.ini}</span><span className="pkmark"><PkMark /></span></div>
              <h3>{c.name}</h3>
              <T as="div" className="role" k={c.rk} />
              <T as="p" k={c.pk} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 07 · Opiniones ---------- */
export function Opiniones() {
  return (
    <section className="pad" id="opiniones" style={{ background: 'var(--caliza2)' }}>
      <div className="wrap">
        <T as="span" className="sec-index rev-up" k="o.idx" />
        <T as="h2" className="title rev-up" k="o.title" />
        <T as="p" className="lead rev-up" k="o.lead" />
        <div className="rev-grid">
          {REVIEWS.map((r, i) => (
            <div className="rev rev-up" key={i}>
              <div className="stars">{'★★★★★'.split('').map((s, i) => <i key={i}>{s}</i>)}</div>
              <p>{r.text}</p>
              <div className="who">
                <div className="av">{r.av}</div>
                <div><div className="nm">{r.name}</div><div className="src">{r.src}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 09 · Tu primera semana ---------- */
const STEPS = [
  { n: '01', h: 'step.h1', p: 'step.p1' },
  { n: '02', h: 'step.h2', p: 'step.p2' },
  { n: '03', h: 'step.h3', p: 'step.p3' },
];
export function Empezar() {
  return (
    <section className="pad" id="empezar" style={{ background: 'var(--caliza2)' }}>
      <div className="wrap">
        <T as="span" className="sec-index rev-up" k="step.idx" />
        <T as="h2" className="title rev-up" k="step.title" />
        <T as="p" className="lead rev-up" k="step.lead" />
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step rev-up" key={s.n}>
              <div className="num">{s.n}</div>
              <T as="h3" k={s.h} />
              <T as="p" k={s.p} />
            </div>
          ))}
        </div>
        <div className="steps-cta rev-up">
          <a href="#apuntarse" className="btn btn-primary cta-shine"><T as="span" k="cta.book" /> <span className="arr">→</span></a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Cierre · Contacto (oscuro) ---------- */
export function CtaContacto() {
  return (
    <section className="pad dark on-dark" id="contacto" style={{ background: '#141312' }}>
      <div className="wrap">
        <div className="cta-block">
          <div className="gora">GORA <em>ANBOTO!</em></div>
          <T as="p" className="cta-sub" k="cta.sub" />
          <div className="cta-btns">
            <a href={WHATSAPP_URL} className="btn btn-primary cta-shine" target="_blank" rel="noopener">
              <WhatsApp size={18} /> <T as="span" k="cta.wa" />
            </a>
            <a href="mailto:anbotocf@gmail.com" className="btn btn-line">anbotocf@gmail.com</a>
          </div>
          <div className="cta-contact">
            <div className="cc"><Pin /> Polígono Ertzilla, P4 · 48215 Iurreta</div>
            <div className="cc"><Phone /> <a href="tel:+34688606754">688 60 67 54</a></div>
            <div className="cc"><Mail /> <a href="mailto:anbotocf@gmail.com">anbotocf@gmail.com</a></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Mapa ---------- */
export function MapEmbed() {
  return (
    <section className="pad" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        {/* Aqui habia un iframe de Google Maps. Se retiro el 2026-09-02: ponia cookies de
            Google en el navegador de cada visita ANTES de que nadie aceptara nada, y era uno
            de los dos motivos por los que la web habria necesitado banner. La tarjeta no
            carga nada de fuera; quien quiera el mapa lo abre el mismo con el boton.
            La ubicacion sigue en el JSON-LD (`geo` y `address` en web/index.html), asi que
            Google la conoce igual de bien que antes. */}
        <div className="map-box map-card">
          <Pin />
          <p className="map-addr">Polígono Ertzilla, P4<br />48215 Iurreta, Bizkaia</p>
          <T as="p" className="map-sub" k="map.sub" />
          <a className="btn btn-primary" href="https://maps.google.com/?q=Poligono+Ertzilla+P4+Iurreta+Bizkaia"
             target="_blank" rel="noopener">
            <T as="span" k="foot.dir" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- 11 · Instagram ---------- */
export function Instagram() {
  return (
    <section className="pad">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <T as="span" className="sec-index rev-up" k="ig.idx" />
        <T as="h2" className="title rev-up" style={{ marginBottom: 8 }} k="ig.title" />
        <div className="ig-grid">
          {IG_PHOTOS.map((foto) => (
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="ig" key={foto.src}>
              <img src={foto.src} alt={foto.alt} loading="lazy" />
            </a>
          ))}
        </div>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="ig-cta">
          <InstagramIcon size={18} /> <T as="span" k="ig.cta" />
        </a>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  return (
    <footer>
      <div className="footer-ridge" aria-hidden="true">
        <svg viewBox="0 0 1440 52" preserveAspectRatio="none">
          <path d="M0,52 L150,20 L300,40 L470,8 L650,36 L820,16 L1010,44 L1180,18 L1320,40 L1440,14 L1440,52 Z" fill="#1B1A18" />
        </svg>
      </div>
      <div className="wrap">
        <div className="foot-top">
          <a href="#top" className="logo">
            <Pico size={30} />
            <span className="lk"><span className="lk-main">ANBOTO</span><span className="lk-sub">Strength &amp; Conditioning</span></span>
          </a>
          <div className="foot-links">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener">Instagram</a>
            <a href="https://maps.google.com/?q=Poligono+Ertzilla+P4+Iurreta+Bizkaia" target="_blank" rel="noopener"><T as="span" k="foot.dir" /></a>
            <a href="mailto:anbotocf@gmail.com">Email</a>
            <a href="tel:+34688606754">688 60 67 54</a>
          </div>
        </div>
        {/* Enlaces legales. El aviso legal es obligatorio (art. 10 LSSI) y la politica de
            privacidad tiene que ser accesible desde donde se recogen los datos, asi que el
            pie es el sitio: aparece en todas las paginas. */}
        <div className="foot-legal">
          <a href="/aviso-legal">Aviso legal</a>
          <a href="/privacidad">Política de privacidad</a>
          <a href="/cookies">Política de cookies</a>
        </div>
        <div className="foot-bottom">
          <span>© 2025 Anboto Strength &amp; Conditioning · Polígono Ertzilla, P4, 48215 Iurreta, Bizkaia</span>
          <span className="gora">GORA ANBOTO!</span>
        </div>
      </div>
    </footer>
  );
}
