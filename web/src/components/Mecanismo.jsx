import { useState } from 'react';
import { T } from '../i18n/LangContext.jsx';

// El Mecanismo Único: método explicado en tabs animadas (los 3 pilares de marca).
const STEPS = [
  { eu: 'p1.eu', h: 'p1.h', p: 'p1.p' },
  { eu: 'p2.eu', h: 'p2.h', p: 'p2.p' },
  { eu: 'p3.eu', h: 'p3.h', p: 'p3.p' },
];

export default function Mecanismo() {
  const [tab, setTab] = useState(0);
  const s = STEPS[tab];
  return (
    <section className="pad" id="metodo">
      <div className="wrap">
        <span className="eyebrow mec-eyebrow">Gure metodoa · El método</span>
        <T as="h2" className="title rev-up" k="p.title" />
        <div className="mec">
          <div className="mec-tabs" role="tablist" aria-label="El método Anboto">
            {STEPS.map((st, i) => (
              <button key={i} type="button" role="tab" aria-selected={tab === i}
                className={`mec-tab ${tab === i ? 'on' : ''}`.trim()} onClick={() => setTab(i)}>
                <span className="mec-n">0{i + 1}</span>
                <T as="span" k={st.h} />
              </button>
            ))}
          </div>
          <div className="mec-panel" key={tab} role="tabpanel">
            <T as="span" className="mec-eu" k={s.eu} />
            <T as="h3" k={s.h} />
            <T as="p" k={s.p} />
          </div>
        </div>
      </div>
    </section>
  );
}
