import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { heroeSizes } from "./src/data/imagenes.js"
import { empresa, preguntas, requisitos, sitio } from "./src/data/site.js"

const url = sitio.url.replace(/\/$/, "")

/**
 * Todo lo que depende del dominio se genera aquí a partir de `sitio` en
 * src/data/site.js: canónica, Open Graph con URL, Twitter, JSON-LD, robots.txt
 * y sitemap.xml. Así basta cambiar el dominio en un solo lugar.
 */
function seo() {
  const datosEstructurados = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "@id": `${url}/#organizacion`,
      name: empresa.nombreLargo,
      alternateName: empresa.nombre,
      url,
      logo: `${url}/apple-touch-icon.png`,
      image: `${url}${sitio.imagen}`,
      description: sitio.descripcion,
      telephone: empresa.telefonoInternacional,
      email: empresa.correo,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Puebla",
        addressRegion: "Puebla",
        addressCountry: "MX",
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
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${url}/#sitio`,
      url,
      name: sitio.titulo,
      inLanguage: "es-MX",
      publisher: { "@id": `${url}/#organizacion` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}/#preguntas`,
      mainEntity: preguntas.map((p) => ({
        "@type": "Question",
        name: p.q,
        acceptedAnswer: { "@type": "Answer", text: p.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "@id": `${url}/#proceso`,
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
        url: `${url}/#proceso`,
      })),
    },
  ]

  // El build de servidor (dist-ssr) sólo existe para que scripts/prerender.mjs
  // pueda renderizar la página; no se publica. Emitir ahí robots.txt y
  // sitemap.xml sería trabajo tirado, así que generateBundle se salta esa pasada.
  let esSSR = false

  return {
    name: "csip-seo",

    configResolved(config) {
      esSSR = Boolean(config.build.ssr)
    },

    transformIndexHtml(html, ctx) {
      // La imagen del héroe es el elemento LCP, pero su URL sólo aparece dentro
      // del bundle, así que el navegador no puede descubrirla al analizar el
      // HTML. Buscamos su nombre con hash y la precargamos.
      const archivos = Object.keys(ctx.bundle || {})
      const heroe380 = archivos.find((f) => /\/familia-380-[^/]+\.webp$/.test(f))
      const heroe500 = archivos.find((f) => /\/familia-(?!380-)[^/]+\.webp$/.test(f))

      // La precarga tiene que declarar el mismo srcset y el mismo sizes que la
      // etiqueta <img>. Si no coinciden, el escáner de precarga puede elegir un
      // candidato distinto al que elige el renderizador y se descargan las dos.
      const precargas =
        heroe380 && heroe500
          ? [
              {
                tag: "link",
                attrs: {
                  rel: "preload",
                  as: "image",
                  type: "image/webp",
                  imagesrcset: `/${heroe380} 380w, /${heroe500} 500w`,
                  imagesizes: heroeSizes,
                  fetchpriority: "high",
                },
                injectTo: "head",
              },
            ]
          : []

      // Las tres tipografías se usan por encima del pliegue (Inter en el texto,
      // Playfair en el título y su itálica en el lema). Si sólo se declararan en
      // el CSS, el navegador las descubriría al terminar de leerlo; precargarlas
      // las pone a descargar en paralelo con la hoja de estilo.
      for (const fuente of archivos.filter((f) => /\.woff2$/.test(f))) {
        precargas.push({
          tag: "link",
          attrs: {
            rel: "preload",
            as: "font",
            type: "font/woff2",
            href: `/${fuente}`,
            crossorigin: "anonymous",
          },
          injectTo: "head",
        })
      }

      return [
        ...precargas,
        { tag: "link", attrs: { rel: "canonical", href: `${url}/` }, injectTo: "head" },
        { tag: "meta", attrs: { property: "og:url", content: `${url}/` }, injectTo: "head" },
        {
          tag: "meta",
          attrs: { property: "og:image", content: `${url}${sitio.imagen}` },
          injectTo: "head",
        },
        {
          tag: "meta",
          attrs: { property: "og:image:alt", content: sitio.imagenAlto },
          injectTo: "head",
        },
        { tag: "meta", attrs: { property: "og:image:width", content: "1200" }, injectTo: "head" },
        { tag: "meta", attrs: { property: "og:image:height", content: "630" }, injectTo: "head" },
        {
          tag: "meta",
          attrs: { name: "twitter:image", content: `${url}${sitio.imagen}` },
          injectTo: "head",
        },
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: JSON.stringify(datosEstructurados),
          injectTo: "head",
        },
      ]
    },

    generateBundle() {
      if (esSSR) return

      const hoy = new Date().toISOString().slice(0, 10)

      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`,
      })

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}/</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seo()],
})
