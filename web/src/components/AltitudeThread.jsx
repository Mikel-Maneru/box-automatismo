import { useRef, useEffect } from 'react';

// Hilo de altitud (ascenso al monte). Raíl fijo lateral (>1300px). El relleno y el
// punto suben con el progreso de scroll; el punto muestra la cota en metros.
export default function AltitudeThread() {
  const fillRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const fill = fillRef.current, dot = dotRef.current;
    if (!fill || !dot) return;
    const upd = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      fill.style.height = (p * 100) + '%';
      dot.style.top = (p * 100) + '%';
      dot.textContent = '↑ ' + Math.round(p * 1331) + ' M';
    };
    upd();
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    return () => { window.removeEventListener('scroll', upd); window.removeEventListener('resize', upd); };
  }, []);

  return (
    <div className="altitude" aria-hidden="true">
      <span className="lab">BASE</span>
      <div className="track">
        <div className="fill" id="altFill" ref={fillRef}></div>
        <div className="dot" id="altDot" ref={dotRef}>↑ 0 M</div>
      </div>
      <span className="lab">CIMA<br />1.331 M</span>
    </div>
  );
}
