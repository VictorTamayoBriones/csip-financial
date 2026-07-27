import { StrictMode } from "react"
import { renderToString } from "react-dom/server"
import App from "./App.jsx"

/**
 * Punto de entrada del build de servidor. No corre en producción: lo ejecuta
 * scripts/prerender.mjs durante el build para incrustar el HTML de la página
 * dentro de dist/index.html.
 *
 * Sin esto el servidor entrega <div id="root"></div> vacío, y los rastreadores
 * que no ejecutan JavaScript (Bingbot, GPTBot, PerplexityBot, ClaudeBot) no ven
 * ningún contenido.
 */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
