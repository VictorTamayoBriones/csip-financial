import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { heroeSizes } from "./src/data/imagenes.js"
import { sitio } from "./src/data/site.js"
import { rutasPublicas } from "./src/data/rutas.js"
import { urlDe } from "./src/seo.js"

const url = sitio.url.replace(/\/$/, "")

/**
 * Genera lo que depende del bundle o del dominio: las precargas con hash, la
 * imagen social, robots.txt y sitemap.xml.
 *
 * El <head> propio de cada ruta —título, descripción, canónica, JSON-LD— lo
 * genera src/seo.js y lo inyecta scripts/prerender.mjs, porque necesita una
 * pasada por página y aquí sólo hay una.
 */
function seo() {
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

      // La imagen social es la misma en todas las páginas, así que se queda
      // aquí. El resto de etiquetas —título, descripción, canónica, og:url y
      // JSON-LD— son propias de cada ruta y las inyecta scripts/prerender.mjs.
      return [
        ...precargas,
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

      // Sólo las rutas listas para indexarse. Las que están en borrador —con
      // datos legales sin confirmar— se sirven con noindex y no se anuncian.
      const urls = rutasPublicas()
        .map(
          (r) => `  <url>
    <loc>${urlDe(r.ruta)}</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${r.prioridad.toFixed(1)}</priority>
  </url>`,
        )
        .join("\n")

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
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
