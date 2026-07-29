/**
 * Prerender del build.
 *
 * Vite produce dos artefactos: el de cliente en dist/ (lo que se publica) y el
 * de servidor en dist-ssr/ (intermedio, fuera del directorio que despliega
 * Vercel). Este script ejecuta el segundo para escribir un HTML completo por
 * cada ruta declarada en src/data/rutas.js.
 *
 * La home queda en dist/index.html y el resto en dist/<ruta>/index.html, que
 * es lo que Vercel sirve en /<ruta> gracias a `cleanUrls` en vercel.json.
 *
 * Se ejecuta desde el script `build` de package.json, después de los dos
 * `vite build`.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises"
import { pathToFileURL } from "node:url"
import { dirname, resolve } from "node:path"

const raiz = resolve(import.meta.dirname, "..")
const plantillaRuta = resolve(raiz, "dist/index.html")
const entrada = resolve(raiz, "dist-ssr/entry-server.js")

// El div vacío que deja index.html. Si Vite cambiara el formato del marcado la
// sustitución fallaría en silencio y volveríamos a publicar páginas vacías sin
// enterarnos, así que comprobamos que existe antes de tocar nada.
const HUECO = '<div id="root"></div>'
const FIN_HEAD = "</head>"

const { render, cabecera, rutas, esBorrador } = await import(pathToFileURL(entrada).href)

const plantilla = await readFile(plantillaRuta, "utf8")

for (const marca of [HUECO, FIN_HEAD]) {
  if (!plantilla.includes(marca)) {
    throw new Error(
      `No se encontró ${marca} en dist/index.html. El prerender no se aplicó: ` +
        `revisa si cambió el marcado de index.html.`,
    )
  }
}

const borradores = []

for (const ruta of rutas) {
  const html = render(ruta.ruta)

  const pagina = plantilla
    .replace(FIN_HEAD, `  ${cabecera(ruta)}\n  ${FIN_HEAD}`)
    .replace(HUECO, `<div id="root">${html}</div>`)

  // La home es dist/index.html; /nosotros es dist/nosotros/index.html.
  const destino =
    ruta.ruta === "/"
      ? plantillaRuta
      : resolve(raiz, "dist", ruta.ruta.replace(/^\//, ""), "index.html")

  await mkdir(dirname(destino), { recursive: true })
  await writeFile(destino, pagina, "utf8")

  if (esBorrador(ruta)) borradores.push(ruta)

  const estado = esBorrador(ruta) ? "borrador (noindex)" : "pública"
  console.log(`  ✓ ${ruta.ruta.padEnd(22)} ${String(html.length).padStart(6)} car.  ${estado}`)
}

console.log(`✓ Prerender de ${rutas.length} rutas`)

if (borradores.length) {
  console.log("")
  console.log("⚠ Rutas en borrador: se sirven con noindex y no entran en el sitemap.")
  for (const ruta of borradores) {
    console.log(`  ${ruta.ruta} — falta: ${ruta.pendientes.join(", ")}`)
  }
  console.log("  Complétalos en src/data/legal.js para publicarlas.")
}
