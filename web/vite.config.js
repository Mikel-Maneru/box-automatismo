import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Landing de Anboto SC. Vite + React con prerender estático (vite-react-ssg).
// El build escribe en ../public (emptyOutDir:false) para NO borrar fotos/, widget/,
// reservar.html ni index.legacy.html. Express (src/index.js) sirve ese public/.
const PROXY_TARGET = 'http://localhost:3003';
const proxy = Object.fromEntries(
  // '/reservar' ya NO se proxya: es una ruta React del propio Vite (pages/Reservar.jsx).
  ['/api', '/fotos', '/widget', '/health'].map((p) => [
    p,
    { target: PROXY_TARGET, changeOrigin: true },
  ])
);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../public',
    emptyOutDir: false,
    assetsDir: 'assets',
  },
  // fs.allow: shared/clases.json vive fuera de web/, y Vite lo bloquea por defecto.
  server: { port: 5173, proxy, fs: { allow: ['..'] } },
});
