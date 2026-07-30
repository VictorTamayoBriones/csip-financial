/* ==========================================================================
   Página puente /whatsapp.

   Enlace amigable para publicar fuera del sitio (posts de Facebook, biografías,
   QR de tarjetas). Registra el clic y manda a WhatsApp.

   No es una ruta de React a propósito: sería descargar todo el bundle para
   acabar redirigiendo. Es un HTML suelto que emite el plugin de vite.config.js.

   El canal se pasa por query: /whatsapp?canal=fb. Sin él se registra como
   `enlace`, nunca como Facebook: un valor por defecto que atribuye a un canal
   concreto acabaría inventando datos, que es justo el fallo que tenía el App
   Script antes de corregirlo.
   ========================================================================== */

import { empresa, mensajeDefault, sitio, whatsapp } from "./data/site.js"
import { CANALES, urlSeguimiento } from "./data/seguimiento.js"

const URL_BASE = sitio.url.replace(/\/$/, "")
const RUTA = "/whatsapp"
const DESTINO = whatsapp(mensajeDefault)

/**
 * Segundos que espera el `meta refresh`. Es la red de seguridad para quien
 * navegue sin JavaScript; con JavaScript el salto ocurre en milisegundos y
 * nadie llega a ver la cuenta atrás.
 */
const ESPERA_SIN_JS = 2

/**
 * El script va en un archivo aparte y no en línea porque la CSP declara
 * `script-src 'self'`: un <script> incrustado sería bloqueado. Al servirse del
 * mismo origen entra sin tocar la política.
 */
export function scriptPuente() {
  return `(function () {
  var canal = new URLSearchParams(location.search).get("canal") || "${CANALES.enlace}";
  var destino = ${JSON.stringify(DESTINO)};

  // Se registra antes de saltar. keepalive hace que el navegador termine la
  // petición aunque la página se descargue por la redirección.
  try {
    fetch(${JSON.stringify(urlSeguimiento("__CANAL__"))}.replace("__CANAL__", encodeURIComponent(canal)), {
      mode: "no-cors",
      keepalive: true,
    }).catch(function () {});
  } catch (e) {}

  // replace() y no href: así el botón "atrás" vuelve a Facebook y no a esta
  // página, que volvería a redirigir y dejaría a la persona atrapada.
  location.replace(destino);
})();
`
}

/**
 * Las etiquetas Open Graph importan más aquí que en el resto del sitio: es la
 * URL que se pega en Facebook, y son las que deciden qué tarjeta se muestra en
 * la publicación. El rastreador de Facebook no ejecuta JavaScript, así que lee
 * estas etiquetas y no dispara ningún registro falso.
 */
export function paginaPuente() {
  const titulo = `Escríbenos por WhatsApp | ${empresa.nombreLargo}`
  const descripcion =
    "Escríbenos por WhatsApp y te decimos hoy mismo si calificas para el Crédito Mejoravit en efectivo. Sin costo y sin compromiso."

  return `<!doctype html>
<html lang="es-MX">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${titulo}</title>

    <!-- Página de salto: no debe indexarse ni competir con la home. -->
    <meta name="robots" content="noindex, nofollow" />
    <link rel="canonical" href="${URL_BASE}/" />

    <!-- Red de seguridad para quien navegue sin JavaScript. -->
    <meta http-equiv="refresh" content="${ESPERA_SIN_JS};url=${DESTINO}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${empresa.nombreLargo}" />
    <meta property="og:locale" content="es_MX" />
    <meta property="og:url" content="${URL_BASE}${RUTA}" />
    <meta property="og:title" content="${titulo}" />
    <meta property="og:description" content="${descripcion}" />
    <meta property="og:image" content="${URL_BASE}${sitio.imagen}" />
    <meta property="og:image:alt" content="${sitio.imagenAlto}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${titulo}" />
    <meta name="twitter:description" content="${descripcion}" />
    <meta name="twitter:image" content="${URL_BASE}${sitio.imagen}" />

    <meta name="theme-color" content="#1F3391" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 1.5rem;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        text-align: center;
        color: #0b0b0f;
        background: #f7f7f1;
      }
      p { margin: 0 0 1rem; }
      .marca { font-weight: 600; color: #1f3391; }
      .aviso { color: #5a5f6b; font-size: 0.95rem; }
      a {
        display: inline-block;
        margin-top: 0.5rem;
        padding: 0.85rem 1.4rem;
        border-radius: 10px;
        background: #046b08;
        color: #fff;
        font-weight: 600;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <main>
      <p class="marca">${empresa.nombreLargo}</p>
      <p class="aviso">Abriendo WhatsApp&hellip;</p>
      <a href="${DESTINO}">Si no se abre solo, toca aquí</a>
    </main>
    <script src="${RUTA}/ir.js"></script>
  </body>
</html>
`
}
