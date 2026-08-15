import { LangProvider } from './i18n/LangContext.jsx';
import { useScrollFx } from './hooks/useScrollFx.js';
import Nav from './components/Nav.jsx';
import AltitudeThread from './components/AltitudeThread.jsx';
import Hero from './components/Hero.jsx';
import Horarios from './components/Horarios.jsx';
import Faq from './components/Faq.jsx';
import Signup from './components/Signup.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import {
  Marquee, PhotoBand, QueEs, Disciplinas, StatBand, Tarifas,
  Coaches, Opiniones, CtaContacto, MapEmbed, Instagram, Footer,
} from './components/Sections.jsx';

function Site() {
  useScrollFx();
  return (
    <>
      <AltitudeThread />
      <Nav />
      <Hero />
      <Marquee />
      <QueEs />
      <PhotoBand />
      <Disciplinas />
      <StatBand />
      <Horarios />
      <Tarifas />
      <Coaches />
      <Opiniones />
      <Faq />
      <Signup />
      <CtaContacto />
      <MapEmbed />
      <Instagram />
      <Footer />
      <ChatWidget />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <Site />
    </LangProvider>
  );
}
