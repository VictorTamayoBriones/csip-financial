/* ==========================================================================
   Datos legales y de identidad de la empresa.

   Los campos en `null` son los que faltan por confirmar. Mientras alguno de
   los que necesita una página siga vacío, esa ruta se marca como borrador en
   src/data/rutas.js: no entra en el sitemap y se sirve con noindex, para que
   no se indexe un documento legal incompleto.
   ========================================================================== */

export const legal = {
  /** Denominación o razón social completa, tal como esté registrada. */
  razonSocial: null,

  /** RFC de la empresa. Opcional en el aviso, pero refuerza la identidad. */
  rfc: null,

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
  correoPrivacidad: null,

  /** Fecha de la última versión del aviso y de los términos (ISO). */
  actualizado: "2026-07-28",
}

/** Datos de "quiénes somos". Sin esto la página no aporta señales de confianza. */
export const identidad = {
  /** Año en que CSIP empezó a operar. */
  desde: null,

  /** Persona responsable, visible y con nombre. Para YMYL no basta la marca. */
  responsable: null, // { nombre, cargo }

  /** Perfiles oficiales, para `sameAs` en el JSON-LD. */
  redes: [], // p. ej. ["https://www.facebook.com/…"]
}

/** Devuelve los campos que faltan de una lista de claves de `legal`. */
export function faltantes(objeto, claves) {
  return claves.filter((c) => {
    const valor = objeto[c]
    return valor === null || (Array.isArray(valor) && valor.length === 0)
  })
}
