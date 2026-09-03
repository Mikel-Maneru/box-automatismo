import { useState } from 'react';
import { useLang, T } from '../i18n/LangContext.jsx';
import { Check } from './icons.jsx';
import { OBJETIVOS, OBJETIVO_VALUES, CANALES } from '../data/site.js';
import legal from '../../../shared/legal.json';

const LEGAL_VERSION = legal.version;

const PERKS = ['s.k1', 's.k2', 's.k3', 's.k4'];

// Formulario de inscripción. Contrato con el backend intacto:
// POST /api/signup { nombre, telefono, email, nivel, origen:'formulario', website(honeypot) }.
export default function Signup() {
  const { t } = useLang();
  // `objetivo` guarda el id (salud, rendimiento…) para poder recomendar clases; al enviar
  // se traduce a su valor en castellano, que es lo que valida el backend.
  // `consentimiento` arranca en false a proposito: el RGPD exige un acto afirmativo, asi que
  // la casilla NO puede venir marcada de fabrica.
  const [form, setForm] = useState({
    nombre: '', telefono: '', email: '', nivel: 'Sin experiencia',
    objetivo: '', comoConocio: '', website: '', consentimiento: false,
  });
  const recomendadas = OBJETIVOS.find((o) => o.id === form.objetivo)?.clases || [];
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null); // { type:'success'|'error', text }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const nombre = form.nombre.trim();
    if (!nombre) return;
    // El backend lo vuelve a comprobar: esto es solo para no dar un viaje en balde.
    if (!form.consentimiento) { setMsg({ type: 'error', text: t('s.consent.err') }); return; }
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          telefono: form.telefono.trim(),
          email: form.email.trim(),
          nivel: form.nivel,
          objetivo: form.objetivo ? OBJETIVO_VALUES[form.objetivo] : '',
          comoConocio: form.comoConocio,
          origen: 'formulario',
          website: form.website,
          // Prueba del consentimiento (RGPD art. 7.1): que lo dio y con QUE version del
          // texto. Si manana cambia la politica, esta alta sigue ligada a la que acepto.
          consentimiento: true,
          politicaVersion: LEGAL_VERSION,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: t('form.ok') });
        setForm({
          nombre: '', telefono: '', email: '', nivel: 'Sin experiencia',
          objetivo: '', comoConocio: '', website: '', consentimiento: false,
        });
      } else {
        setMsg({ type: 'error', text: data.error || t('form.err') });
      }
    } catch {
      setMsg({ type: 'error', text: t('form.err') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="pad dark on-dark arch" id="apuntarse">
      <div className="fx-altitude" aria-hidden="true" />
      <div className="wrap">
        <div className="signup-grid">
          <div>
            <T as="span" className="urgency-badge rev-up" k="s.badge" />
            <T as="span" className="sec-index rev-up" k="s.idx" />
            <T as="h2" className="title rev-up" style={{ color: 'var(--caliza)' }} k="s.title" />
            <T as="p" className="lead rev-up" k="s.lead" />
            <div className="perks">
              {PERKS.map((k) => (
                <div className="perk rev-up" key={k}>
                  <span className="pi"><Check /></span> <T as="span" k={k} />
                </div>
              ))}
            </div>
            <T as="p" className="urgency-note" k="s.note" />
          </div>
          <div className="signup-card rev-up">
            <T as="h3" k="s.cardh" />
            <T as="div" className="sc-sub" k="s.cardsub" />
            <form id="signupForm" onSubmit={onSubmit}>
              <div className="fg">
                <label htmlFor="signup-nombre">{t('s.lname')}</label>
                <input type="text" id="signup-nombre" placeholder={t('s.phname')}
                  value={form.nombre} onChange={set('nombre')} required />
              </div>
              <div className="fg">
                <label htmlFor="signup-telefono">{t('s.lphone')}</label>
                <input type="tel" id="signup-telefono" placeholder="612 345 678"
                  value={form.telefono} onChange={set('telefono')} />
              </div>
              <div className="fg">
                <label htmlFor="signup-email">{t('s.lemail')}</label>
                <input type="email" id="signup-email" placeholder="tu@email.com"
                  value={form.email} onChange={set('email')} />
              </div>
              <div className="fg">
                <label htmlFor="signup-nivel">{t('s.lexp')}</label>
                <select id="signup-nivel" value={form.nivel} onChange={set('nivel')}>
                  <option value="Sin experiencia">{t('s.o1')}</option>
                  <option value="Algo de experiencia">{t('s.o2')}</option>
                  <option value="Vengo de otro box">{t('s.o3')}</option>
                </select>
              </div>
              <div className="fg">
                <label htmlFor="signup-objetivo">{t('s.lobj')}</label>
                <select id="signup-objetivo" value={form.objetivo} onChange={set('objetivo')}>
                  <option value="">{t('s.objph')}</option>
                  {OBJETIVOS.map((o) => (
                    <option key={o.id} value={o.id}>{t(o.k)}</option>
                  ))}
                </select>
              </div>
              {recomendadas.length > 0 && (
                <div className="rec">
                  <span className="rec-h">{t('s.rec')}</span>
                  <ul className="tri-list">
                    {recomendadas.map((n) => <li key={n}>{n}</li>)}
                  </ul>
                </div>
              )}
              <div className="fg">
                <label htmlFor="signup-como">{t('s.lhow')}</label>
                <select id="signup-como" value={form.comoConocio} onChange={set('comoConocio')}>
                  <option value="">{t('s.howph')}</option>
                  {CANALES.map((c) => (
                    <option key={c.id} value={c.value}>{t(c.k)}</option>
                  ))}
                </select>
              </div>
              <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1}
                autoComplete="off" value={form.website} onChange={set('website')} />
              {/* Consentimiento. Sin marcar de fabrica y obligatorio: el RGPD pide un acto
                  afirmativo, y una casilla premarcada no lo es. */}
              <label className="form-consent">
                <input type="checkbox" required checked={form.consentimiento}
                  onChange={(e) => setForm((f) => ({ ...f, consentimiento: e.target.checked }))} />
                <span>
                  {t('s.consent')}{' '}
                  <a href="/privacidad" target="_blank" rel="noopener">{t('s.consent.link')}</a>.
                </span>
              </label>

              <button type="submit" className="form-btn cta-shine" id="signupBtn" disabled={submitting}>
                {submitting ? t('form.sending') : t('s.submit')}
              </button>
              {msg && (
                <div className={`form-msg ${msg.type}`} id="signupMsg" style={{ display: 'block' }}>
                  {msg.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
