import { useState, useEffect, useCallback, useMemo } from 'react';
import { LangProvider, useLang, T } from '../i18n/LangContext.jsx';
import { Pico } from '../components/icons.jsx';
import { WHATSAPP_URL, objetivoPorValor, claveClase } from '../data/site.js';

// Página de reserva de la clase gratuita. Se llega SIEMPRE con ?token=... desde el email
// de scheduling (src/lib/email.js), nunca desde la landing. Sustituye a la antigua
// public/reservar.html (conservada como reservar.legacy.html), que se quedó con la marca
// vieja. Consume los endpoints ya existentes: booking-status, classes y book.

// Fechas seleccionables: los próximos 7 días saltando domingos (el box cierra).
function proximosDias(n) {
  const dias = [];
  const hoy = new Date();
  const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  while (dias.length < n) {
    if (d.getDay() !== 0) dias.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return dias;
}

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Nombres en euskera a mano: no todos los navegadores traen datos de la locale `eu`
// (Chromium en Windows, sin ir más lejos, cae a castellano sin avisar).
const EU_D = ['ig.', 'al.', 'ar.', 'az.', 'og.', 'or.', 'lr.'];
const EU_M = ['urt.', 'ots.', 'mar.', 'api.', 'mai.', 'eka.', 'uzt.', 'abu.', 'ira.', 'urr.', 'aza.', 'abe.'];
const EU_DL = ['igandea', 'astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala', 'larunbata'];
const EU_ML = ['urtarrila', 'otsaila', 'martxoa', 'apirila', 'maiatza', 'ekaina', 'uztaila', 'abuztua', 'iraila', 'urria', 'azaroa', 'abendua'];
const esCorto = (d, opt) => new Intl.DateTimeFormat('es-ES', opt).format(d).replace('.', '');

function Aviso({ children }) {
  return (
    <div className="rsv-err">
      <p>{children}</p>
      <a href={WHATSAPP_URL} target="_blank" rel="noopener"><T as="span" k="rsv.wa" /></a>
    </div>
  );
}

function ReservarInner() {
  const { t, lang, setLang } = useLang();
  const eu = lang === 'eu';

  const [estado, setEstado] = useState('cargando'); // cargando|error|ya|elegir|hecha
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState(null);
  const [nivel, setNivel] = useState(null);
  const [objetivo, setObjetivo] = useState(null);
  const [dias, setDias] = useState([]);
  const [reserva, setReserva] = useState(null); // {date,time,className}

  const [fecha, setFecha] = useState(null);
  const [clases, setClases] = useState([]);
  const [cargandoClases, setCargandoClases] = useState(false);
  const [avisoClases, setAvisoClases] = useState('');
  const [sel, setSel] = useState(null); // clase elegida
  const [reservando, setReservando] = useState(false);

  const token = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('token')
    : null;

  const diaSem = useCallback((d) => (eu ? EU_D[d.getDay()] : esCorto(d, { weekday: 'short' })), [eu]);
  const mesCorto = useCallback((d) => (eu ? EU_M[d.getMonth()] : esCorto(d, { month: 'short' })), [eu]);

  const obj = objetivoPorValor(objetivo);

  // Se marca UN SOLO hueco: el mejor del día. Marcar todas las clases del objetivo no
  // sirve de nada porque la mayoría de huecos son WOD y acababan señalados 7 de 10.
  // Se recorre el objetivo en orden de preferencia y gana el primero reservable.
  const idxRecomendado = useMemo(() => {
    const orden = obj
      ? obj.clases.map(claveClase)
      : (nivel === 'Sin experiencia' ? [claveClase('Oinarriak')] : []);
    if (!orden.length || !clases.length) return -1;
    for (const clase of orden) {
      const i = clases.findIndex((c) => claveClase(c.name) === clase && c.canBook);
      if (i !== -1) return i;
    }
    // Ninguna reservable: se señala igualmente para orientar, aunque no se pueda pulsar.
    for (const clase of orden) {
      const i = clases.findIndex((c) => claveClase(c.name) === clase);
      if (i !== -1) return i;
    }
    return -1;
  }, [clases, obj, nivel]);

  useEffect(() => {
    if (!token) { setError(t('rsv.errLink')); setEstado('error'); return; }
    let vivo = true;
    (async () => {
      try {
        const res = await fetch(`/api/booking-status?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (!vivo) return;
        if (!data.valid) {
          setError(data.reason === 'expired' ? t('rsv.errExp') : t('rsv.errNo'));
          setEstado('error');
          return;
        }
        setNombre(data.nombre || null);
        setNivel(data.nivel || null);
        setObjetivo(data.objetivo || null);
        if (data.used && data.booking) {
          setReserva({ date: data.booking.class_date, time: data.booking.class_time, className: null });
          setEstado('ya');
          return;
        }
        setDias(proximosDias(7));
        setEstado('elegir');
      } catch {
        if (vivo) { setError(t('rsv.errConn')); setEstado('error'); }
      }
    })();
    return () => { vivo = false; };
    // t cambia con el idioma, pero no queremos re-lanzar la petición por eso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const elegirFecha = async (d) => {
    const f = iso(d);
    setFecha(f); setSel(null); setClases([]); setAvisoClases(''); setCargandoClases(true);
    try {
      const res = await fetch(`/api/classes?date=${f}`);
      const data = await res.json();
      if (data.error && data.retry) {
        setAvisoClases(data.message || t('rsv.errConn'));
        setClases([]);
      } else {
        const lista = data.classes || [];
        setClases(lista);
        // realData=false -> el backend anula la disponibilidad: se ve el horario, no se reserva.
        setAvisoClases(!data.realData && lista.length > 0 ? t('rsv.aviso') : '');
      }
    } catch {
      setAvisoClases(t('rsv.errConn'));
      setClases([]);
    } finally {
      setCargandoClases(false);
    }
  };

  const reservar = async () => {
    if (!fecha || !sel) return;
    setReservando(true);
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          classId: sel.id,
          date: fecha,
          className: sel.name,
          classTime: sel.time.substring(0, 5),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setReserva({ date: data.booking.date, time: data.booking.time, className: data.booking.className });
        setEstado('hecha');
      } else {
        setError(data.error || t('rsv.errGen'));
        setEstado('error');
      }
    } catch {
      setError(t('rsv.errConn'));
      setEstado('error');
    } finally {
      setReservando(false);
    }
  };

  const fechaLarga = (s) => {
    const [y, m, d] = s.split('-').map(Number);
    const fecha = new Date(y, m - 1, d);
    if (eu) return `${EU_DL[fecha.getDay()]}, ${d} ${EU_ML[m - 1]}`;
    return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(fecha);
  };

  return (
    <div className="rsv">
      <header className="rsv-top">
        <span className="logo">
          <Pico size={26} />
          <span className="lk">
            <span className="lk-main">ANBOTO</span>
            <span className="lk-sub">Strength &amp; Conditioning</span>
          </span>
        </span>
        <div className="lang">
          <button type="button" className={`lang-btn ${lang === 'es' ? 'active' : ''}`.trim()}
            aria-label="Castellano" aria-pressed={lang === 'es'} onClick={() => setLang('es')}>ES</button>
          <button type="button" className={`lang-btn ${lang === 'eu' ? 'active' : ''}`.trim()}
            aria-label="Euskara" aria-pressed={lang === 'eu'} onClick={() => setLang('eu')}>EU</button>
        </div>
      </header>

      <main className="rsv-card">
        {estado === 'cargando' && <p className="rsv-load"><T as="span" k="rsv.cargando" /></p>}

        {estado === 'error' && <Aviso>{error}</Aviso>}

        {(estado === 'ya' || estado === 'hecha') && reserva && (
          <div className="rsv-ok">
            <span className="rsv-check" aria-hidden="true">✓</span>
            <T as="h1" k={estado === 'ya' ? 'rsv.yaTitle' : 'rsv.okTitle'} />
            <div className="rsv-when">
              <span className="d">{fechaLarga(reserva.date)}</span>
              <span className="h">{(reserva.time || '').substring(0, 5)}{reserva.className ? ` · ${reserva.className}` : ''}</span>
            </div>
            <T as="p" k="rsv.okBody" />
          </div>
        )}

        {estado === 'elegir' && (
          <>
            {nombre && <p className="rsv-hi">{t('rsv.hi')}, {nombre}</p>}
            <T as="h1" k="rsv.title" />
            <T as="p" className="rsv-sub" k="rsv.sub" />

            {obj && (
              <p className="rsv-obj">
                <span className="o">{t(obj.k)}</span>
                <span className="r">{t('rsv.porObj')}: <b>{obj.clases.join(' · ')}</b></span>
              </p>
            )}

            <T as="span" className="rsv-lbl" k="rsv.fecha" />
            <div className="rsv-dias">
              {dias.map((d) => {
                const f = iso(d);
                return (
                  <button key={f} type="button" className={`rsv-dia ${fecha === f ? 'on' : ''}`.trim()}
                    aria-pressed={fecha === f} onClick={() => elegirFecha(d)}>
                    <span className="dw">{diaSem(d)}</span>
                    <span className="dn">{d.getDate()}</span>
                    <span className="dm">{mesCorto(d)}</span>
                  </button>
                );
              })}
            </div>

            {fecha && (
              <>
                <T as="span" className="rsv-lbl" k="rsv.hora" />
                {cargandoClases && <p className="rsv-load"><T as="span" k="rsv.cargando" /></p>}
                {!cargandoClases && avisoClases && <p className="rsv-nota">{avisoClases}</p>}
                {!cargandoClases && clases.length === 0 && !avisoClases && (
                  <p className="rsv-nota"><T as="span" k="rsv.nodisp" /></p>
                )}
                <div className="rsv-slots">
                  {clases.map((c, i) => {
                    const hora = c.time.substring(0, 5);
                    const recomendada = i === idxRecomendado;
                    const activa = sel && sel.id === c.id && sel.time === c.time;
                    return (
                      <button key={`${c.time}-${i}`} type="button"
                        className={`rsv-slot ${activa ? 'on' : ''} ${recomendada ? 'rec' : ''}`.trim()}
                        aria-pressed={!!activa} disabled={!c.canBook}
                        onClick={() => setSel(c)}>
                        <span className="l">
                          <span className="hh">{hora}{recomendada && <em>{t('rsv.rec')}</em>}</span>
                          <span className="cn">{c.name}{c.description ? ` · ${c.description}` : ''}</span>
                        </span>
                        <span className="r">
                          {c.full ? <span className="full">{t('rsv.completa')}</span>
                            : (c.spots != null
                              ? <span className={c.spots <= 2 ? 'pocas' : ''}>{c.spots} {t(c.spots === 1 ? 'rsv.plaza' : 'rsv.plazas')}</span>
                              : <span className="na">{t('rsv.sindisp')}</span>)}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button type="button" className="rsv-cta cta-shine" disabled={!sel || reservando} onClick={reservar}>
                  {reservando ? t('rsv.reservando') : t('rsv.reservar')}
                </button>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function Reservar() {
  // El <head> del prerender lo comparte con la landing (index.html es la plantilla común)
  // y el <Head> de vite-react-ssg no llega al HTML generado en esta versión, así que el
  // título y el noindex se ajustan en cliente. La señal autoritativa para los buscadores
  // es el Disallow de /reservar en public/robots.txt.
  useEffect(() => {
    document.title = 'Reserva tu clase gratuita · Anboto SC';
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';
  }, []);

  return (
    <LangProvider>
      <ReservarInner />
    </LangProvider>
  );
}
