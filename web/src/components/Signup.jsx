import { useState } from 'react';
import { useLang, T } from '../i18n/LangContext.jsx';
import { Check } from './icons.jsx';

const PERKS = ['s.k1', 's.k2', 's.k3', 's.k4'];

// Formulario de inscripción. Contrato con el backend intacto:
// POST /api/signup { nombre, telefono, email, nivel, origen:'formulario', website(honeypot) }.
export default function Signup() {
  const { t } = useLang();
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', nivel: 'Sin experiencia', website: '' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null); // { type:'success'|'error', text }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const nombre = form.nombre.trim();
    if (!nombre) return;
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
          origen: 'formulario',
          website: form.website,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: t('form.ok') });
        setForm({ nombre: '', telefono: '', email: '', nivel: 'Sin experiencia', website: '' });
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
              <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1}
                autoComplete="off" value={form.website} onChange={set('website')} />
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
