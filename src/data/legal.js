/* ==========================================================================
   Datos legales y de identidad de la empresa.

   Los campos en `null` son los que faltan por confirmar. Mientras alguno de
   los que necesita una página siga vacío, esa ruta se marca como borrador en
   src/data/rutas.js: no entra en el sitemap y se sirve con noindex, para que
   no se indexe un documento legal incompleto.
   ========================================================================== */

export const legal = {
  /** Denominación o razón social completa, tal como esté registrada. */
  razonSocial: "Consultoría de Servicios Integrales Puebla.",

  /** RFC de la empresa. Opcional en el aviso, pero refuerza la identidad. */
  rfc: "BRCJ030414TA6",

  /**
   * Domicilio fiscal o de atención: calle, número, colonia, código postal,
   * ciudad y estado. La LFPDPPP exige el domicilio del responsable.
   */
  domicilio: null,

  /**
   * Correo al que se dirigen las solicitudes de derechos ARCO. Debe ser una
   * dirección que se lea de verdad: la ley obliga a responder en plazo.
   * Ver también T0.4 del plan: conviene un correo del dominio propio.
   */
  correoPrivacidad: "laloed21@outlook.es",

  /** Fecha de la última versión del aviso y de los términos (ISO). */
  actualizado: "2026-07-28",
}

/** Datos de "quiénes somos". Sin esto la página no aporta señales de confianza. */
export const identidad = {
  /** Año en que CSIP empezó a operar. */
  desde: 2021,

  /**
   * Persona responsable, visible y con nombre. Para YMYL no basta la marca.
   * Nombre y cargo van en campos separados y no en una sola cadena: así no
   * puede quedarse a medias sin que la comprobación de completitud lo note.
   */
  responsable: "Jose Eduardo Briones Corona",
  cargo: "Gerente Comercial",

  /** Perfiles oficiales, para `sameAs` en el JSON-LD. */
  redes: [], // p. ej. ["https://www.facebook.com/…"]
}

/**
 * Devuelve los campos que faltan de una lista de claves.
 *
 * Cuenta como ausente el valor nulo, el indefinido —una clave que se borró o
 * que nunca se escribió—, la cadena vacía o en blanco, y el array vacío. La
 * primera versión sólo miraba `null` y dejó pasar una clave inexistente,
 * publicando una página con los huecos a la vista.
 *
 * Aun así, la comprobación de verdad es la de scripts/prerender.mjs, que
 * inspecciona el HTML generado: esta se fía de que la página lea los campos con
 * la forma que aquí se supone, y esa suposición ya falló una vez.
 */
export function faltantes(objeto, claves) {
  return claves.filter((c) => {
    const valor = objeto[c]
    if (valor === null || valor === undefined) return true
    if (typeof valor === "string") return valor.trim() === ""
    if (Array.isArray(valor)) return valor.length === 0
    return false
  })
}
