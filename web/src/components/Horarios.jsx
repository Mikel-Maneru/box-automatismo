import { useState, useEffect } from 'react';
import { useLang, T } from '../i18n/LangContext.jsx';
import { DAYS, SCHED, TODAY_KEYS, WODBUSTER_URL } from '../data/site.js';

// Horario interactivo. Default estable 'mon' para casar el prerender; en cliente
// selecciona el día de hoy tras montar (evita desajuste de hidratación por zona horaria).
export default function Horarios() {
  const { t } = useLang();
  const [day, setDay] = useState('mon');

  useEffect(() => { setDay(TODAY_KEYS[new Date().getDay()]); }, []);

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
          {(SCHED[day] || []).map(([time, cls], i) => (
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
