import { ViteReactSSG } from 'vite-react-ssg';
import './styles/global.css';
import App from './App.jsx';
import Reservar from './pages/Reservar.jsx';

// Prerender estático. El <head> con SEO + JSON-LD es estático y vive en index.html;
// /reservar lo sobrescribe con su propio <title> y un noindex (es una página privada
// a la que solo se llega con el token del email).
export const createRoot = ViteReactSSG({
  routes: [
    { path: '/', element: <App /> },
    { path: '/reservar', element: <Reservar /> },
  ],
});
