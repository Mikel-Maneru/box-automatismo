import { useEffect } from 'react';
import { LangProvider } from '../i18n/LangContext.jsx';
import { Footer } from '../components/Sections.jsx';
import { Pico } from '../components/icons.jsx';
import legal from '../../../shared/legal.json';

// Paginas legales: /privacidad, /cookies y /aviso-legal.
//
// En castellano a proposito (decision del 2026-09-02): los textos legales conviene que los
// revise alguien antes de traducirlos, y traducir antes de esa revision es trabajo doble.
// El euskera se añade despues sobre el texto ya revisado.
//
// Se prerenderizan con el resto del sitio, asi que son HTML servido: se pueden leer sin
// JavaScript y las indexa Google, que es justo lo que se espera de una pagina legal.

const { titular, version, actualizado, conservacion_meses: MESES } = legal;

// Hueco visible para lo que todavia no ha dado el cliente. Se pinta en rojo a proposito:
// si alguien publica la pagina sin rellenarlo, salta a la vista en lugar de colarse.
function Falta({ children }) {
  return <mark className="legal-falta">PENDIENTE: {children}</mark>;
}

const RazonSocial = () => titular.razon_social || <Falta>razón social o nombre y apellidos del titular</Falta>;
const Nif = () => titular.nif || <Falta>NIF / CIF</Falta>;

function LegalLayout({ titulo, children }) {
  useEffect(() => {
    document.title = `${titulo} · Anboto SC`;
  }, [titulo]);

  return (
    <LangProvider>
      <div className="legal-wrap">
        <a className="legal-back" href="/">
          <Pico /> <span>Anboto SC</span>
        </a>
        <h1>{titulo}</h1>
        <p className="legal-meta">
          Versión {version} · Actualizado el {actualizado}
        </p>
        {children}
      </div>
      <Footer />
    </LangProvider>
  );
}

/* ============================== PRIVACIDAD ============================== */

export function Privacidad() {
  return (
    <LegalLayout titulo="Política de privacidad">
      <p>
        Esta política explica qué datos personales recogemos en esta web, para qué los usamos y
        qué puedes hacer con ellos. Está escrita para que se entienda: si algo no queda claro,
        escríbenos y te lo explicamos.
      </p>

      <h2>Quién es el responsable</h2>
      <ul>
        <li><strong>Titular:</strong> <RazonSocial /></li>
        <li><strong>NIF:</strong> <Nif /></li>
        <li><strong>Dirección:</strong> {titular.domicilio}</li>
        <li><strong>Email:</strong> <a href={`mailto:${titular.email}`}>{titular.email}</a></li>
        <li><strong>Teléfono:</strong> {titular.telefono}</li>
      </ul>

      <h2>Qué datos recogemos y de dónde</h2>
      <p>Solo recogemos datos que nos das tú, en dos sitios:</p>
      <ul>
        <li>
          <strong>El formulario de clase de prueba:</strong> nombre, teléfono, email, tu nivel,
          tu objetivo y cómo nos conociste. El nombre es obligatorio; el resto nos ayuda a
          recomendarte una clase que encaje.
        </li>
        <li>
          <strong>El chat de la web:</strong> lo que escribas en la conversación. Si pides
          información para apuntarte, el asistente te pedirá nombre y una forma de contacto.
          No escribas en el chat datos que no quieras que guardemos.
        </li>
      </ul>
      <p>
        No usamos analítica, ni publicidad, ni perfilado, ni tomamos decisiones automatizadas
        sobre ti.
      </p>

      <h2>Para qué los usamos y con qué base legal</h2>
      <ul>
        <li>
          <strong>Ponernos en contacto contigo y organizar tu clase de prueba.</strong> Base
          legal: tu <strong>consentimiento</strong>, que das al marcar la casilla del
          formulario (art. 6.1.a del RGPD), y la aplicación de medidas precontractuales a
          petición tuya (art. 6.1.b).
        </li>
        <li>
          <strong>Responder a lo que preguntes por el chat.</strong> Base legal: tu
          consentimiento al iniciar la conversación.
        </li>
      </ul>
      <p>No usamos tus datos para nada más, ni te mandamos publicidad.</p>

      <h2>Cuánto tiempo los guardamos</h2>
      <p>
        Si acabas apuntándote, mientras dure la relación y después durante los plazos que exija
        la ley. Si no te apuntas, <strong>{MESES} meses desde el último contacto</strong>, y
        luego se borran. Puedes pedirnos que los borremos antes cuando quieras.
      </p>

      <h2>Quién más los ve</h2>
      <p>
        No vendemos ni cedemos tus datos a nadie. Sí los tratan, por nuestra cuenta y siguiendo
        nuestras instrucciones, los proveedores que hacen funcionar la web:
      </p>
      <ul>
        <li><strong>Supabase</strong> — la base de datos donde se guardan las solicitudes.</li>
        <li><strong>Resend</strong> — el envío de los correos.</li>
        <li><strong>Vercel</strong> — el alojamiento de la web.</li>
        <li><strong>Anthropic</strong> — el modelo de lenguaje que responde en el chat.</li>
        <li>
          <strong>El sistema de reservas del gimnasio</strong> — para apuntarte a la clase de
          prueba hace falta darle tu nombre y tu contacto.
        </li>
      </ul>
      <p>
        Algunos están fuera del Espacio Económico Europeo. En esos casos la transferencia se
        ampara en las cláusulas contractuales tipo aprobadas por la Comisión Europea o en un
        marco de adecuación equivalente.
      </p>

      <h2>Qué puedes hacer</h2>
      <p>
        Tienes derecho a <strong>acceder</strong> a tus datos, <strong>rectificarlos</strong>,
        <strong> suprimirlos</strong>, <strong>limitar</strong> u <strong>oponerte</strong> a su
        tratamiento, y a la <strong>portabilidad</strong>. También puedes{' '}
        <strong>retirar tu consentimiento</strong> en cualquier momento, sin que eso afecte a lo
        hecho antes.
      </p>
      <p>
        Para ejercerlos, escríbenos a{' '}
        <a href={`mailto:${titular.email}`}>{titular.email}</a> diciéndonos qué quieres. Te
        responderemos lo antes posible y siempre dentro de un mes.
      </p>
      <p>
        Si crees que no lo hemos hecho bien, puedes reclamar ante la{' '}
        <a href="https://www.aepd.es" target="_blank" rel="noopener">
          Agencia Española de Protección de Datos
        </a>. Agradeceríamos que nos lo dijeras antes, para intentar arreglarlo.
      </p>

      <h2>Menores</h2>
      <p>
        Esta web no está dirigida a menores de 14 años. Si eres menor de esa edad, pide a tu
        padre, madre o tutor que contacte con nosotros.
      </p>

      <h2>Cambios</h2>
      <p>
        Si cambiamos algo importante, actualizaremos esta página y su número de versión. Arriba
        puedes ver cuál está vigente y desde cuándo.
      </p>
    </LegalLayout>
  );
}

/* ================================ COOKIES ================================ */

export function Cookies() {
  return (
    <LegalLayout titulo="Política de cookies">
      <p className="legal-destacado">
        Esta web <strong>no usa cookies</strong>. Tampoco tiene analítica, ni publicidad, ni
        botones de redes sociales que te sigan. Por eso no verás ningún aviso pidiéndote que
        aceptes nada: no hay nada que aceptar.
      </p>

      <h2>Entonces, ¿qué guarda en mi navegador?</h2>
      <p>
        Dos cosas, y las dos son técnicas: sirven para que la web funcione, no para saber quién
        eres ni qué haces.
      </p>
      <table className="legal-tabla">
        <thead>
          <tr><th>Qué</th><th>Para qué</th><th>Cuánto dura</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>anboto_lang</code></td>
            <td>Recordar si prefieres la web en castellano o en euskera.</td>
            <td>Hasta que borres los datos del navegador.</td>
          </tr>
          <tr>
            <td><code>box_chat_session</code></td>
            <td>Mantener el hilo de la conversación del chat mientras lo usas.</td>
            <td>Se borra al cerrar la pestaña.</td>
          </tr>
        </tbody>
      </table>
      <p>
        Ninguna de las dos se envía a terceros ni permite identificarte. Están exentas del deber
        de consentimiento del artículo 22.2 de la LSSI porque son estrictamente necesarias para
        prestar el servicio que has pedido.
      </p>

      <h2>Y las tipografías y el mapa, ¿no son de Google?</h2>
      <p>
        Lo eran. En septiembre de 2026 dejamos de cargarlas desde servidores de Google: las
        tipografías se sirven desde esta misma web, y el mapa incrustado se sustituyó por un
        botón que abre Google Maps <strong>solo si lo pulsas tú</strong>. Al cargar esta página
        no se hace ninguna petición a terceros.
      </p>
      <p>
        Si pulsas ese botón, o cualquier enlace a Instagram o WhatsApp, sales de nuestra web y
        pasas a las condiciones de ese servicio, sobre el que no tenemos control.
      </p>

      <h2>Cómo borrarlas</h2>
      <p>
        Puedes borrar el almacenamiento de esta web desde los ajustes de tu navegador, en la
        sección de datos de sitios. La web seguirá funcionando: solo olvidará tu idioma.
      </p>
    </LegalLayout>
  );
}

/* ============================== AVISO LEGAL ============================== */

export function AvisoLegal() {
  return (
    <LegalLayout titulo="Aviso legal">
      <h2>Datos del titular</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002 de servicios de la sociedad de la
        información y de comercio electrónico:
      </p>
      <ul>
        <li><strong>Titular:</strong> <RazonSocial /></li>
        <li><strong>NIF:</strong> <Nif /></li>
        <li><strong>Domicilio:</strong> {titular.domicilio}</li>
        <li><strong>Email:</strong> <a href={`mailto:${titular.email}`}>{titular.email}</a></li>
        <li><strong>Teléfono:</strong> {titular.telefono}</li>
        <li><strong>Sitio web:</strong> anbotosc.com</li>
      </ul>

      <h2>Para qué es esta web</h2>
      <p>
        Presentar el gimnasio, sus clases y sus horarios, y permitir que quien quiera pedir una
        clase de prueba gratuita pueda hacerlo. No se vende nada a través de esta web ni se
        realizan pagos en ella.
      </p>

      <h2>Condiciones de uso</h2>
      <p>
        Al usar esta web te comprometes a hacerlo conforme a la ley y a no utilizarla para
        actividades ilícitas ni que perjudiquen a terceros. Los datos que nos facilites deben
        ser tuyos y ser ciertos.
      </p>
      <p>
        Los horarios y las clases que se muestran son informativos y pueden cambiar. La
        disponibilidad real de plazas la marca el sistema de reservas del gimnasio.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>
        Los textos, el logotipo, las fotografías y el diseño de esta web pertenecen a su titular
        y no pueden reproducirse sin permiso. Las tipografías Archivo y Space Mono se usan bajo
        licencia SIL Open Font License 1.1.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        Ponemos cuidado en que la información esté actualizada, pero no podemos garantizar que
        esté libre de errores. Tampoco respondemos del contenido de las páginas externas a las
        que enlazamos.
      </p>

      <h2>Protección de datos</h2>
      <p>
        El tratamiento de datos personales se explica en la{' '}
        <a href="/privacidad">política de privacidad</a>, y lo que guardamos en tu navegador, en
        la <a href="/cookies">política de cookies</a>.
      </p>

      <h2>Ley aplicable</h2>
      <p>
        Esta web se rige por la ley española. Para cualquier controversia serán competentes los
        juzgados y tribunales que correspondan conforme a la normativa aplicable.
      </p>
    </LegalLayout>
  );
}
