/**
 * Redirector de WhatsApp con registro de clics en Google Sheets.
 * CSIP Servicios Financieros.
 *
 * IMPORTANTE — el parámetro se llama `canal`, no `c`:
 *   La capa de servicio de Google rechaza con HTTP 400 cualquier petición a
 *   /exec que lleve un parámetro `c` en minúscula, sea cual sea su valor, y lo
 *   hace antes de ejecutar este script. Comprobado: ?c=fb, ?c=gg, ?c=tj y
 *   ?c=web dan 400, mientras que ?canal=…, ?src=… y ?C=… (mayúscula) dan 200.
 *   Por eso todos los enlaces publicados deben usar ?canal=xx.
 *
 * Cada canal tiene su propio código. Hay dos tipos:
 *
 *   - Canales de redirección (?canal=fb, ?canal=gg, ?canal=tj): el enlace apunta
 *     aquí, el script registra el clic y reenvía el navegador a wa.me. Se usan
 *     en Facebook, en Google y en las tarjetas impresas, donde no hay forma de
 *     ejecutar código propio antes de salir.
 *
 *   - Canales de sólo registro (?canal=web): el sitio ya enlaza directo a wa.me
 *     —es instantáneo y arma mensajes a medida con los datos del formulario—,
 *     así que sólo llama aquí en segundo plano para contabilizar el clic. No
 *     debe devolver una página de redirección: nadie la vería y encarecería la
 *     petición sin motivo.
 *
 * CONFIGURAR ANTES DE USAR:
 *   1. TELEFONO: número de WhatsApp con código de país, sin +, sin espacios.
 *   2. La propiedad de script SHEET_ID, en Configuración del proyecto →
 *      Propiedades del script → Agregar propiedad. Su valor es el ID del Sheet
 *      (lo que va entre /d/ y /edit en la URL). No se escribe en el código
 *      porque este archivo vive en un repositorio público: el ID no es una
 *      credencial, pero si la hoja pasara a "cualquiera con el enlace" sería
 *      la puerta a todo el histórico de clics.
 *
 * Los nombres de canal deben coincidir EXACTO con los que cuentan las
 * fórmulas de la pestaña Resumen: "Facebook", "Google", "Tarjeta", "Sitio web".
 * Al añadir el canal "Sitio web" hay que añadirle también su fórmula en Resumen,
 * o sus clics se registrarán en Clics pero no aparecerán en el conteo.
 */

const TELEFONO = '522214413591';
const PESTANA_CLICS = 'Clics';

const DESTINOS = {
  fb: {
    canal: 'Facebook',
    mensaje: 'Hola, vi tu página de Facebook y me interesa información sobre un trámite',
  },
  gg: {
    canal: 'Google',
    mensaje: 'Hola, te encontré en Google y me interesa información sobre un trámite',
  },
  tj: {
    canal: 'Tarjeta',
    mensaje: 'Hola, me compartieron tu contacto y me interesa información sobre un trámite',
  },
  enlace: {
    canal: 'Enlace directo',
    // Lo usa la página puente https://csip-financial.com/whatsapp cuando se
    // publica sin indicar canal. Esa página construye su propio enlace a
    // wa.me, así que este mensaje sólo se usaría abriendo la URL a mano.
    mensaje:
      'Hola CSIP, me interesa el Crédito Mejoravit en efectivo. ¿Me pueden dar informes?',
    soloRegistro: true,
  },
  web: {
    canal: 'Sitio web',
    // El sitio no usa este mensaje: lo arma él mismo antes de abrir wa.me.
    // Se deja por si alguien abre esta URL a mano.
    mensaje: 'Hola CSIP, me interesa el Crédito Mejoravit en efectivo. ¿Me pueden dar informes?',
    soloRegistro: true,
  },
};

function doGet(e) {
  // Se acepta `c` como respaldo por si Google levanta la restricción o llega
  // algún enlace antiguo, pero hoy esas peticiones no alcanzan este código.
  const parametros = (e && e.parameter) || {};
  const codigo = parametros.canal || parametros.c || '';
  const destino = DESTINOS[codigo];

  // Un código ausente o desconocido se registra como tal, no como Facebook.
  // Antes caía a `fb` por defecto y eso llenó la hoja de clics etiquetados
  // como Facebook que en realidad venían de enlaces mal formados: un dato
  // equivocado engaña más que un dato que se declara desconocido.
  registrarClic_(destino ? destino.canal : 'Desconocido (' + (codigo || 'sin código') + ')');

  // Aun sin código válido hay que llevar a la persona a WhatsApp: perder un
  // clic es aceptable, perder un cliente no. Se usa el mensaje genérico.
  if (!destino) {
    return redirigir_(DESTINOS.fb.mensaje);
  }

  // El sitio web llama en segundo plano y descarta la respuesta, así que
  // devolvemos el texto más corto posible en vez de construir una página.
  if (destino.soloRegistro) {
    return ContentService.createTextOutput('ok');
  }

  return redirigir_(destino.mensaje);
}

/**
 * Página puente que reenvía a wa.me con el mensaje ya escrito.
 * Incluye un enlace visible por si el reenvío automático no llega a ocurrir.
 */
function redirigir_(mensaje) {
  const url = 'https://wa.me/' + TELEFONO + '?text=' + encodeURIComponent(mensaje);

  const html =
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Abriendo WhatsApp…</title></head>' +
    '<body style="font-family:sans-serif;text-align:center;padding-top:60px;color:#333">' +
    '<p>Abriendo WhatsApp…</p>' +
    '<p><a href="' + url + '" style="color:#25D366;font-weight:bold">' +
    'Si no abre autom&aacute;ticamente, toca aqu&iacute;</a></p>' +
    '<script>window.location.replace(' + JSON.stringify(url) + ');</script>' +
    '</body></html>';

  return HtmlService.createHtmlOutput(html)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Escribe [fecha-hora, canal] en la pestaña Clics.
 * Usa LockService para evitar filas encimadas si llegan clics simultáneos.
 * Si el registro falla, el usuario se redirige de todas formas:
 * perder un clic es aceptable; perder un cliente, no.
 */
function registrarClic_(canal) {
  try {
    const idHoja = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    if (!idHoja) {
      throw new Error(
        'Falta la propiedad de script SHEET_ID (Configuración del proyecto → ' +
          'Propiedades del script).',
      );
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      SpreadsheetApp.openById(idHoja)
        .getSheetByName(PESTANA_CLICS)
        .appendRow([new Date(), canal]);
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error('No se pudo registrar el clic: ' + err);
  }
}

/**
 * Prueba manual desde el editor: ejecuta esta función con el botón "Ejecutar"
 * para verificar permisos y que la fila se escriba en la pestaña Clics.
 * Borra después la fila de prueba del Sheet.
 */
function pruebaRegistro() {
  registrarClic_('Sitio web');
}
