import { useState, useEffect } from 'react';
import { useLang, T } from '../i18n/LangContext.jsx';
import { DAYS, SCHED, TODAY_KEYS, WODBUSTER_URL } from '../data/site.js';

// Horario interactivo.
//
// La parrilla SE PIDE al backend (/api/schedule), que la lee del sistema de reservas del
// box: así un cambio de clase se refleja en la web sin tocar código. Pero SCHED (estático)
// no desaparece, es la red de seguridad, y cumple tres papeles:
//   1. Es lo que se prerenderiza, así que Google y el primer pintado ven el horario
//      completo sin esperar a ninguna petición.
//   2. Si el proveedor falla, tarda o devuelve algo vacío, la web sigue mostrando un
//      horario razonable en vez de un hueco en blanco.
//   3. Queda como referencia para saber cuándo el estático se ha quedado viejo.
//
// Solo se sustituye si la respuesta trae días con franjas: media respuesta sería peor
// que el respaldo.
export default function Horarios() {
  const { t } = useLang();
  const [day, setDay] = useState('mon');
  const [sched, setSched] = useState(SCHED);

  // Default estable 'mon' para casar el prerender; el día de hoy se elige tras montar
  // (evita desajuste de hidratación por zona horaria).
  useEffect(() => { setDay(TODAY_KEYS[new Date().getDay()]); }, []);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const res = await fetch('/api/schedule');
        if (!res.ok) return;                    // 503 -> nos quedamos con SCHED
        const data = await res.json();
        const s = data && data.schedule;
        if (!vivo || !s) return;
        const dias = Object.keys(s).filter((d) => Array.isArray(s[d]) && s[d].length);
        if (!dias.length) return;               // respuesta vacía -> respaldo
        setSched(s);
      } catch {
        // Sin red o backend caído: SCHED ya está puesto, no hay nada que hacer.
      }
    })();
    return () => { vivo = false; };
  }, []);

  const filas = sched[day] || SCHED[day] || [];

  return (
    <section className="pad" id="horarios">
      <div className="wrap">
        <T as="span" className="sec-index rev-up" k="h.idx" />
        <T as="h2" className="title rev-up" k="h.title" />
        <T as="p" className="lead rev-up" k="h.lead" />
        <div className="tt-days rev-up" id="ttDays">
          {DAYS.map(([key, labelKey]) => (
            <button key={key} className={`tt-day ${day === key ? 'on' : ''}`.trim()}
              data-d={key} onClick={() => setDay(key)}>{t(labelKey)}</button>
          ))}
        </div>
        <div className="tt-panel rev-up" id="ttPanel">
          {filas.map(([time, cls], i) => (
            <div className="tt-row" key={`${day}-${i}`}>
              <span className="tm">{time}</span><span className="cl">{cls}</span>
            </div>
          ))}
        </div>
        <p className="tt-note rev-up">
          <T as="span" k="h.note2" />{' '}
          <a href={WODBUSTER_URL} target="_blank" rel="noopener"><T as="span" k="h.book" /></a>
        </p>
      </div>
    </section>
  );
}
