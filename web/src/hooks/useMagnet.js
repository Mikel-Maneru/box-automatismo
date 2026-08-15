import { useEffect } from 'react';

// Magnet (react-bits): el elemento se desplaza sutilmente hacia el cursor.
// Solo en dispositivos con puntero fino (desktop); se desactiva en táctil.
export function useMagnet(ref, strength = 0.28) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
    };
    const reset = () => { el.style.transform = ''; };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', reset);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', reset);
      reset();
    };
  }, [ref, strength]);
}
