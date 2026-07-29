/* ==========================================================================
   Rutas del sitio.

   Fuente única de verdad, igual que `sitio.url` lo es del dominio. De aquí
   salen: el enrutado de React, el prerender de cada página (scripts/
   prerender.mjs), el sitemap y las etiquetas <title>, description y canonical
   de cada URL.

   Añadir una ruta aquí y su componente en `paginas` basta para que aparezca en
   los tres sitios. Si se añade en un solo lado, el sitemap o el prerender se
   quedan desincronizados sin avisar.
   ========================================================================== */

import { faltantes, identidad, legal } from "./legal"

/**
 * @typedef {object} Ruta
 * @property {string} ruta        Camino absoluto, empezando por "/".
 * @property {string} titulo      Etiqueta <title> y og:title.
 * @property {string} descripcion Meta description y og:description.
 * @property {number} prioridad   Prioridad en el sitemap (0 a 1).
 * @property {string} [migas]     Texto de la miga de pan. Ausente en la home.
 * @property {string[]} [pendientes] Campos sin confirmar que la dejan en borrador.
 */

/** @type {Ruta[]} */
export const rutas = [
  {
    ruta: "/",
    titulo: "Crédito Mejoravit en efectivo | CSIP Servicios Financieros",
    descripcion:
      "Obtén tu Crédito Mejoravit del Infonavit en efectivo. Asesoría completa, sin hipotecar tu casa, sin buró de crédito y con descuento vía nómina.",
    prioridad: 1.0,
  },
  {
    ruta: "/nosotros",
    titulo: "Quiénes somos | CSIP Servicios Financieros",
    descripcion:
      "Conoce a CSIP Servicios Financieros: quiénes somos, cómo trabajamos y por qué acompañamos trámites del Crédito Mejoravit del Infonavit.",
    prioridad: 0.6,
    migas: "Quiénes somos",
    pendientes: faltantes(identidad, ["desde", "responsable"]),
  },
  {
    ruta: "/aviso-de-privacidad",
    titulo: "Aviso de privacidad | CSIP Servicios Financieros",
    descripcion:
      "Aviso de privacidad de CSIP Servicios Financieros: qué datos personales recabamos, para qué los usamos y cómo ejercer tus derechos ARCO.",
    prioridad: 0.3,
    migas: "Aviso de privacidad",
    pendientes: faltantes(legal, ["razonSocial", "domicilio", "correoPrivacidad"]),
  },
  {
    ruta: "/terminos",
    titulo: "Términos y condiciones | CSIP Servicios Financieros",
    descripcion:
      "Términos y condiciones del servicio de asesoría e integración de expediente de CSIP Servicios Financieros para el Crédito Mejoravit.",
    prioridad: 0.3,
    migas: "Términos y condiciones",
    pendientes: faltantes(legal, ["razonSocial", "domicilio"]),
  },
]

/** Devuelve la definición de una ruta, o la de la home si no existe. */
export function buscarRuta(camino) {
  return rutas.find((r) => r.ruta === camino) || rutas[0]
}

/**
 * Una ruta con datos sin confirmar es un borrador: se construye y se puede
 * revisar en el navegador, pero se sirve con `noindex` y no entra en el
 * sitemap. Publicar un aviso de privacidad con huecos es peor que no tenerlo,
 * y una página de "quiénes somos" sin nombres no aporta la señal de confianza
 * que justifica escribirla.
 */
export const esBorrador = (ruta) => Boolean(ruta.pendientes?.length)

/** Rutas listas para indexarse. Es lo que entra en el sitemap. */
export const rutasPublicas = () => rutas.filter((r) => !esBorrador(r))
