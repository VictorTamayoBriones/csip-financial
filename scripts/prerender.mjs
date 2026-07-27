/**
 * Prerender del build.
 *
 * Vite produce dos artefactos: el de cliente en dist/ (lo que se publica) y el
 * de servidor en dist-ssr/ (intermedio, fuera del directorio que despliega
 * Vercel). Este script ejecuta el segundo para incrustar el HTML de la página
 * dentro del primero.
 *
 * Se ejecuta desde el script `build` de package.json, después de los dos
 * `vite build`.
 */

import { readFile, writeFile } from "node:fs/promises"
import { pathToFileURL } from "node:url"
import { resolve } from "node:path"

const raiz = resolve(import.meta.dirname, "..")
const indice = resolve(raiz, "dist/index.html")
const entrada = resolve(raiz, "dist-ssr/entry-server.js")

// El div vacío que deja index.html. Si Vite cambiara el formato del marcado la
// sustitución fallaría en silencio y volveríamos a publicar una página vacía
// sin enterarnos, así que comprobamos que existe antes de tocar nada.
const HUECO = '<div id="root"></div>'

const { render } = await import(pathToFileURL(entrada).href)

const plantilla = await readFile(indice, "utf8")

if (!plantilla.includes(HUECO)) {
  throw new Error(
    `No se encontró ${HUECO} en dist/index.html. El prerender no se aplicó: ` +
      `revisa si cambió el marcado de index.html.`,
  )
}

const html = render()

await writeFile(indice, plantilla.replace(HUECO, `<div id="root">${html}</div>`), "utf8")

console.log(`✓ Prerender aplicado a dist/index.html (${html.length} caracteres)`)
