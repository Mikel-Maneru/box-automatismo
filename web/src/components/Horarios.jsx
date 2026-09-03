import { useState, useEffect } from 'react';
import { useLang, T } from '../i18n/LangContext.jsx';
import { DAYS, SALAS, SCHED_POR_SALA, TODAY_KEYS, WODBUSTER_URL } from '../data/site.js';

// Horario interactivo: primero se elige SALA y luego el día.
//
// El box son dos espacios con programación distinta —Sala Anboto (cross training) y Sala
// Alluitz (salud y funcional)— y hasta ahora se mezclaban en una sola parrilla, que era
// justo lo que hacía difícil entender qué se puede hacer y dónde.
//
// LA PARRILLA ES ESTÁTICA A PROPÓSITO (2026-09-03). Antes se pedía a `/api/schedule`, que
// la leía del sistema de reservas. Esa llamada está QUITADA, no comentada por descuido:
// Xabi mandó el horario nuevo en dos carteles y WodBuster todavía tiene el viejo, así que
// reactivarla ahora sobrescribiría el horario bueno con el caducado.
//
// **Cuando se migre a AimHarder (octubre), aquí vuelve la carga automática**, pero contra
// `GET /calendar/:fecha`, que da nombre, hora y aforo de una sola llamada. El endpoint
// `/api/schedule` sigue existiendo y funcionando; simplemente no se consume desde aquí.
export default function Horarios() {
  const { t } = useLang();
  const [sala, setSala] = useState('anboto');
  const [day, setDay] = useState('mon');

  // Default estable 'mon' para casar el prerender; el día de hoy se elige tras montar
  // (evita desajuste de hidratación por zona horaria).
  useEffect(() => { setDay(TODAY_KEYS[new Date().getDay()]); }, []);

  const salaActual = SALAS.find((s) => s.id === sala) || SALAS[0];
  const filas = SCHED_POR_SALA[sala]?.[day] || [];

  return (
    <section className="pad" id="horarios">
      <div className="wrap">
        <T as="span" className="sec-index rev-up" k="h.idx" />
        <T as="h2" className="title rev-up" k="h.title" />
        <T as="p" className="lead rev-up" k="h.lead" />

        {/* Selector de sala. Va antes que los días porque la sala cambia toda la parrilla. */}
        <div className="tt-salas rev-up">
          {SALAS.map((s) => (
            <button key={s.id} className={`tt-sala ${sala === s.id ? 'on' : ''}`.trim()}
              onClick={() => setSala(s.id)} aria-pressed={sala === s.id}>
              <span className="tt-sala-n">{t(s.k)}</span>
              <span className="tt-sala-d">{t(s.dk)}</span>
            </button>
          ))}
        </div>

        <div className="tt-days rev-up" id="ttDays">
          {DAYS.map(([key, labelKey]) => (
            <button key={key} className={`tt-day ${day === key ? 'on' : ''}`.trim()}
              data-d={key} onClick={() => setDay(key)}>{t(labelKey)}</button>
          ))}
        </div>

        <div className="tt-panel rev-up" id="ttPanel">
          {filas.length ? filas.map(([time, cls], i) => (
            <div className="tt-row" key={`${sala}-${day}-${i}`}>
              <span className="tm">{time}</span><span className="cl">{cls}</span>
            </div>
          )) : (
            // Pasa de verdad: el sábado la Sala Alluitz no tiene clases guiadas, pero abre.
            <T as="p" className="tt-vacio" k="h.sinclases" />
          )}
        </div>

        {/* Cada sala tiene su propio régimen de acceso libre, y son muy distintos. */}
        <p className="tt-note rev-up">
          <T as="span" k={salaActual.nk} />{' '}
          <a href={WODBUSTER_URL} target="_blank" rel="noopener"><T as="span" k="h.book" /></a>
        </p>
      </div>
    </section>
  );
}
