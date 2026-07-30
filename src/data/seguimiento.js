/* ==========================================================================
   Registro de clics hacia WhatsApp.
   ========================================================================== */

/**
 * Despliegue del App Script que contabiliza los clics en Google Sheets.
 *
 * El parámetro del canal se llama `canal` y no `c` por una razón concreta:
 * Google responde 400 a cualquier petición a /exec que lleve un parámetro `c`
 * en minúscula, con cualquier valor, sin llegar a ejecutar el script.
 */
const BASE =
  "https://script.google.com/macros/s/AKfycbyC7A2aBLpCokH62ohdyR7iOKQNtJ7p42ULylxpIemlerzg_nHQFgzqPcsmvrR-4XZLtA/exec"

/**
 * Canales que entiende el App Script (constante DESTINOS). Añadir uno aquí
 * exige añadirlo también allí y darle su fórmula en la pestaña Resumen del
 * Sheet; si no, sus clics se registran como "Desconocido".
 */
export const CANALES = {
  /** Botones de WhatsApp del propio sitio. */
  web: "web",
  /** Página puente /whatsapp, para enlaces publicados fuera del sitio. */
  enlace: "enlace",
}

/** URL de registro de un canal. */
export const urlSeguimiento = (canal) => `${BASE}?canal=${encodeURIComponent(canal)}`

/**
 * Avisa al App Script de que alguien pulsó un botón de WhatsApp.
 *
 * Tres decisiones deliberadas:
 *
 * - `keepalive: true` hace que el navegador termine la petición aunque la
 *   pestaña se descargue o cambie el foco. Sin esto el registro se perdería en
 *   los casos en que la navegación gana la carrera.
 * - `mode: "no-cors"` porque el App Script no devuelve cabeceras CORS. No
 *   podemos leer la respuesta, pero sólo nos interesa el efecto secundario.
 * - No se espera al resultado ni se propagan los errores: el registro es
 *   accesorio y jamás debe impedir que el usuario llegue a WhatsApp. Si el
 *   endpoint está caído, bloqueado por un adblocker o el navegador no soporta
 *   `fetch`, el clic funciona igual.
 *
 * La petición no envía datos personales: sólo el hecho de que hubo un clic.
 */
export function registrarClic(canal = CANALES.web) {
  try {
    fetch(urlSeguimiento(canal), {
      method: "GET",
      mode: "no-cors",
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Silencio intencionado: ver arriba.
  }
}
