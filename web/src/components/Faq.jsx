import { useState } from 'react';
import { T } from '../i18n/LangContext.jsx';

const ITEMS = [
  ['fq.q1', 'fq.a1'], ['fq.q2', 'fq.a2'], ['fq.q3', 'fq.a3'],
  ['fq.q4', 'fq.a4'], ['fq.q5', 'fq.a5'], ['fq.q6', 'fq.a6'],
];

// FAQ acordeón. Solo una abierta a la vez (comportamiento del sitio original).
export default function Faq() {
  const [open, setOpen] = useState(-1);
  const toggle = (i) => setOpen((cur) => (cur === i ? -1 : i));

  return (
    <section className="pad" id="faq">
      <div className="wrap">
        <T as="span" className="sec-index rev-up" k="fq.idx" />
        <T as="h2" className="title rev-up" k="fq.title" />
        <T as="p" className="lead rev-up" k="fq.lead" />
        <div className="faq-wrap">
          {ITEMS.map(([qk, ak], i) => (
            <div className={`faq ${open === i ? 'open' : ''}`.trim()} key={qk}>
              <div className="faq-q" role="button" tabIndex={0} aria-expanded={open === i}
                onClick={() => toggle(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i); } }}>
                <T as="span" k={qk} />
                <span className="pm"></span>
              </div>
              <div className="faq-a"><T as="p" k={ak} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
