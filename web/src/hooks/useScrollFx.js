import { useEffect } from 'react';

// Reveal-on-scroll (.rev-up -> .in) + number-ticker ([data-count]) portados del
// sitio original. Se ejecuta una vez tras montar; la estructura del DOM es estable.
export function useScrollFx() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

    // --- Reveal ---
    const revEls = document.querySelectorAll('.rev-up');
    if (!('IntersectionObserver' in window)) {
      revEls.forEach((el) => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revEls.forEach((el, i) => { el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms'; io.observe(el); });
    }

    // --- Number ticker ---
    const numEls = document.querySelectorAll('[data-count]');
    const tio = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target; tio.unobserve(el);
        const target = parseFloat(el.dataset.count); const suffix = el.dataset.suffix || '';
        if (reduce) { el.textContent = target + suffix; return; }
        let i = 0; const steps = 34;
        const tick = () => {
          i++; const v = Math.min(target, (target / steps) * i);
          el.textContent = Math.round(v) + suffix;
          if (i < steps) requestAnimationFrame(tick); else el.textContent = target + suffix;
        };
        tick();
      });
    }, { threshold: 0.5 }) : null;
    if (tio) numEls.forEach((el) => tio.observe(el));
    else numEls.forEach((el) => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
  }, []);
}
