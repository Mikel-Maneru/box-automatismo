import { T } from '../i18n/LangContext.jsx';
import { Pico, PkMark, WhatsApp, Pin, Phone, Mail, InstagramIcon } from './icons.jsx';
import {
  DISCIPLINAS, COACHES, REVIEWS, PLANS, IG_PHOTOS,
  WHATSAPP_URL, INSTAGRAM_URL,
} from '../data/site.js';

/* ---------- Marquee (claims/disciplinas) ---------- */
const MARQUEE = ['WOD', 'Oinarriak', 'Indarra', 'Open Box', 'Total Strength', 'Haltero', 'Endurance', 'Hyrox'];
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
      <img src="/fotos/684166869_18141850504507230_4228607507298611888_n.jpeg" alt="Entrenando en Anboto SC" loading="lazy" />
      <div className="pb-scrim" aria-hidden="true" />
      <div className="pb-inner">
        <span className="eyebrow">Komunitatea</span>
        <p className="pb-claim rev-up">La cima se conquista <em>en grupo</em>.</p>
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
            <span className="bt-eyebrow">Eguneroko WODa</span>
            <T as="h3" k="f1.h" />
            <T as="p" k="f1.p" />
          </div>
          <div className="bento-tile b-photo rev-up" aria-hidden="true"
            style={{ backgroundImage: "url('/fotos/681663370_18141850495507230_842418771480859784_n.jpeg')" }} />
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
            <span className="bt-lbl">Google · 46 reseñas</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 03 · Disciplinas ---------- */
export function Disciplinas() {
  return (
    <section className="pad" id="disciplinas">
      <div className="wrap">
        <T as="span" className="sec-index rev-up" k="disc.idx" />
        <T as="h2" className="title rev-up" k="disc.title" />
        <div className="elist">
          {DISCIPLINAS.map((d) => (
            <div className="ei cls rev-up" key={d.name}>
              <div className="mk"><span className="tri"></span></div>
              <div className="bd">
                <div className="nm"><span className="eu">{d.eu}</span><h3>{d.name}</h3></div>
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
        <div className="stat rev-up"><div className="n"><span data-count="8" data-suffix="+">8+</span></div><T as="div" className="t" k="st.l1" /></div>
        <div className="stat rev-up"><div className="n"><span data-count="46" data-suffix="+">46+</span></div><T as="div" className="t" k="st.l2" /></div>
        <div className="stat rev-up"><div className="n"><span data-count="6">6</span></div><T as="div" className="t" k="st.l3" /></div>
        <div className="stat rev-up"><div className="n">4.9★</div><T as="div" className="t" k="st.l4" /></div>
      </div>
    </section>
  );
}

/* ---------- 05 · Tarifas (oscuro) ---------- */
export function Tarifas() {
  return (
    <section className="pad dark on-dark arch" id="tarifas">
      <div className="wrap">
        <T as="span" className="sec-index rev-up" k="t.idx" />
        <T as="h2" className="title rev-up" k="t.title" />
        <T as="p" className="lead rev-up" k="t.lead" />
        <div className="price-grid">
          {PLANS.map((pl) => (
            <div className={`plan rev-up ${pl.pop ? 'pop' : ''}`.trim()} key={pl.nameKey}>
              {pl.pop && <T as="span" className="badge" k="t.pop" />}
              <span className="pn"><T as="span" k={pl.nameKey} /></span>
              <div className="pp"><span className="v">{pl.price}</span><span className="c">€</span><T as="span" className="per" k="t.month" /></div>
              <ul className="tri-list">
                {pl.feats.map((f, i) => (f.k ? <T as="li" k={f.k} key={i} /> : <li key={i}>{f.txt}</li>))}
              </ul>
              <T as="a" href="#apuntarse" className="pbtn" k="t.start" />
            </div>
          ))}
        </div>
        <div className="extras">
          <div>
            <T as="p" className="mono rev-up" style={{ marginBottom: 14 }} k="t.bonos" />
            <div className="bonos">
              <div className="bono rev-up"><T as="div" className="s" k="t.b5" /><div className="p">60 €</div><T as="div" className="d" k="t.b5d" /></div>
              <div className="bono rev-up"><T as="div" className="s" k="t.b10" /><div className="p">100 €</div><T as="div" className="d" k="t.b10d" /></div>
            </div>
          </div>
          <div className="trial rev-up">
            <T as="span" className="tl" k="t.trtl" />
            <T as="strong" k="t.trh" />
            <T as="p" k="t.trp" />
            <T as="a" href="#apuntarse" k="t.trcta" />
          </div>
        </div>
        <T as="p" className="activities rev-up" k="t.act" />
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
            <div className="cc"><Phone /> <a href="tel:+34688661924">688 661 924</a></div>
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
        <div className="map-box">
          <iframe
            src="https://maps.google.com/maps?q=Anboto+Pol%C3%ADgono+Ertzilla+P4+Iurreta+Bizkaia&t=&z=15&ie=UTF8&iwloc=&output=embed"
            loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Anboto SC en Iurreta" aria-label="Mapa con ubicación de Anboto SC en Iurreta"></iframe>
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
          {IG_PHOTOS.map((src, i) => (
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="ig" key={i}>
              <img src={src} alt="Anboto SC" loading="lazy" />
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
            <a href="tel:+34688661924">688 661 924</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2025 Anboto Strength &amp; Conditioning · Polígono Ertzilla, P4, 48215 Iurreta, Bizkaia</span>
          <span className="gora">GORA ANBOTO! · ↑ 1.331 M</span>
        </div>
      </div>
    </footer>
  );
}
