import { StrictMode } from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router"
import App from "./App.jsx"

// El prerender consume estos desde el bundle de servidor, para no tener que
// resolver los mismos módulos por dos caminos distintos.
export { rutas, esBorrador } from "./data/rutas.js"
export { cabecera } from "./seo.js"

/**
 * Punto de entrada del build de servidor. No corre en producción: lo ejecuta
 * scripts/prerender.mjs durante el build, una vez por cada ruta, para escribir
 * el HTML de cada página.
 *
 * Sin esto el servidor entregaría <div id="root"></div> vacío, y los
 * rastreadores que no ejecutan JavaScript (Bingbot, GPTBot, PerplexityBot,
 * ClaudeBot) no verían ningún contenido.
 */
export function render(camino) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={camino}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
