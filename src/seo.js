/* ==========================================================================
   Generación del <head> de cada página.

   Vive aquí, y no repartido entre index.html y vite.config.js, porque con
   varias rutas cada una necesita su propio título, descripción, canónica y
   datos estructurados. scripts/prerender.mjs llama a `cabecera()` una vez por
   ruta y la inyecta en el HTML.

   Las precargas de tipografías y de la imagen del héroe siguen en el plugin de
   vite.config.js: dependen de los nombres con hash del bundle, que sólo se
   conocen allí.
   ========================================================================== */

import { empresa, preguntas, requisitos, sitio } from "./data/site.js"
import { esBorrador } from "./data/rutas.js"
import { identidad, legal } from "./data/legal.js"

const URL_BASE = sitio.url.replace(/\/$/, "")

/** Escapa lo que va dentro de un atributo HTML. */
const attr = (valor) =>
  String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

/** Escapa lo que va como texto entre etiquetas. */
const texto = (valor) =>
  String(valor).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

/** URL absoluta de una ruta. La home lleva barra final; el resto, no. */
export const urlDe = (camino) => (camino === "/" ? `${URL_BASE}/` : `${URL_BASE}${camino}`)

/* --------------------------------------------------------------------------
   Datos estructurados
   -------------------------------------------------------------------------- */

/**
 * Quita las claves cuyo valor no se ha confirmado todavía. Declarar un campo
 * vacío en JSON-LD es peor que omitirlo: Google lo lee como un dato de la
 * entidad y lo da por bueno.
 */
const sinVacios = (objeto) =>
  Object.fromEntries(
    Object.entries(objeto).filter(
      ([, v]) => v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0),
    ),
  )

const organizacion = sinVacios({
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "@id": `${URL_BASE}/#organizacion`,
  name: empresa.nombreLargo,
  alternateName: empresa.nombre,
  legalName: legal.razonSocial,
  url: `${URL_BASE}/`,
  logo: {
    "@type": "ImageObject",
    url: `${URL_BASE}/apple-touch-icon.png`,
    width: 180,
    height: 180,
  },
  image: `${URL_BASE}${sitio.imagen}`,
  description: sitio.descripcion,
  telephone: empresa.telefonoInternacional,
  email: legal.correoPrivacidad || empresa.correo,
  priceRange: "$$",
  foundingDate: identidad.desde,
  // `sameAs` es lo que permite a Google consolidar en una sola entidad las
  // menciones dispersas de "CSIP". Se rellena en src/data/legal.js.
  sameAs: identidad.redes,
  address: sinVacios({
    "@type": "PostalAddress",
    streetAddress: legal.domicilio,
    addressLocality: "Puebla",
    addressRegion: "Puebla",
    addressCountry: "MX",
  }),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: empresa.telefonoInternacional,
    email: legal.correoPrivacidad || empresa.correo,
    availableLanguage: "Spanish",
    areaServed: "MX",
  },
  areaServed: { "@type": "Country", name: "México" },
  openingHours: ["Mo-Fr 09:00-19:00", "Sa 09:00-14:00"],
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "LoanOrCredit",
      name: "Crédito Mejoravit en efectivo",
      description:
        "Asesoría y gestión del Crédito Mejoravit del Infonavit para reparar, remodelar o ampliar tu vivienda, con disposición en efectivo.",
      loanType: "Crédito para mejora de vivienda",
      currency: "MXN",
    },
  },
})

const sitioWeb = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${URL_BASE}/#sitio`,
  url: `${URL_BASE}/`,
  name: sitio.titulo,
  inLanguage: "es-MX",
  publisher: { "@id": `${URL_BASE}/#organizacion` },
}

/**
 * FAQPage y HowTo describen contenido que sólo existe en la home, así que sólo
 * se inyectan ahí. Repetirlos en todas las páginas sería declarar contenido que
 * no está en la página, algo que Google trata como marcado engañoso.
 *
 * Nota de expectativas: Google retiró los resultados enriquecidos de HowTo en
 * 2023 y restringió los de FAQPage a sitios de gobierno y salud. Se mantienen
 * porque los motores de IA sí los aprovechan, no porque vayan a verse en la
 * página de resultados.
 */
const paginaInicio = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${URL_BASE}/#preguntas`,
    mainEntity: preguntas.map((p) => ({
      "@type": "Question",
      name: p.q,
      acceptedAnswer: { "@type": "Answer", text: p.a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${URL_BASE}/#proceso`,
    name: "Cómo obtener tu Crédito Mejoravit con CSIP",
    description: "Proceso de cuatro pasos para tramitar el Crédito Mejoravit.",
    supply: requisitos.map((r) => ({ "@type": "HowToSupply", name: r })),
    step: [
      "Escríbenos por WhatsApp",
      "Revisamos tu precalificación",
      "Integramos tu expediente",
      "Recibes tu crédito",
    ].map((nombre, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: nombre,
      url: `${URL_BASE}/#proceso`,
    })),
  },
]

/** Migas de pan en JSON-LD, a partir de la misma definición que las visibles. */
const migas = (ruta) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: `${URL_BASE}/` },
    { "@type": "ListItem", position: 2, name: ruta.migas, item: urlDe(ruta.ruta) },
  ],
})

function estructurados(ruta) {
  const datos = [organizacion, sitioWeb]
  if (ruta.ruta === "/") datos.push(...paginaInicio)
  if (ruta.migas) datos.push(migas(ruta))
  return datos
}

/* --------------------------------------------------------------------------
   Cabecera completa
   -------------------------------------------------------------------------- */

/**
 * Devuelve el bloque de <head> propio de una ruta, listo para inyectar.
 *
 * Una ruta en borrador (con datos sin confirmar) se sirve con `noindex`: es
 * visitable y revisable, pero no llega al índice de Google. Ver esBorrador()
 * en src/data/rutas.js.
 */
export function cabecera(ruta) {
  const url = urlDe(ruta.ruta)
  const borrador = esBorrador(ruta)

  const robots = borrador
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1"

  const etiquetas = [
    `<title>${texto(ruta.titulo)}</title>`,
    `<meta name="description" content="${attr(ruta.descripcion)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${attr(url)}" />`,
    `<meta property="og:url" content="${attr(url)}" />`,
    `<meta property="og:title" content="${attr(ruta.titulo)}" />`,
    `<meta property="og:description" content="${attr(ruta.descripcion)}" />`,
    `<meta name="twitter:title" content="${attr(ruta.titulo)}" />`,
    `<meta name="twitter:description" content="${attr(ruta.descripcion)}" />`,
    `<script type="application/ld+json">${JSON.stringify(estructurados(ruta)).replace(
      /</g,
      "\\u003c",
    )}</script>`,
  ]

  return etiquetas.join("\n    ")
}
