import { ViteReactSSG } from 'vite-react-ssg';
import './styles/global.css';
import App from './App.jsx';

// Prerender estático de la única ruta '/'. El <head> (SEO + JSON-LD) es estático
// y vive en index.html; aquí solo se prerenderiza el cuerpo dentro de #root.
export const createRoot = ViteReactSSG({
  routes: [{ path: '/', element: <App /> }],
});
