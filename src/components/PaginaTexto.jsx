import { Link } from "react-router"
import "./PaginaTexto.css"

/**
 * Envoltorio de las páginas de texto (nosotros, aviso de privacidad,
 * términos). Aporta las migas de pan, el encabezado y la medida de línea
 * corta que necesita un documento largo para leerse bien.
 *
 * Las migas se generan también en JSON-LD (BreadcrumbList) desde
 * scripts/prerender.mjs, a partir de la misma definición en src/data/rutas.js.
 */
export default function PaginaTexto({ titulo, entradilla, migas, actualizado, children }) {
  return (
    <article className="pagina">
      <div className="contenedor pagina__ancho">
        <nav className="migas" aria-label="Migas de pan">
          <Link to="/">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{migas}</span>
        </nav>

        <header className="pagina__encabezado">
          <h1>{titulo}</h1>
          {entradilla && <p className="entradilla">{entradilla}</p>}
          {actualizado && (
            <p className="pagina__fecha">
              Última actualización: <time dateTime={actualizado}>{formatear(actualizado)}</time>
            </p>
          )}
        </header>

        <div className="pagina__cuerpo">{children}</div>
      </div>
    </article>
  )
}

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]

/**
 * Formatea "2026-07-28" como "28 de julio de 2026".
 *
 * Se parte la cadena a mano en vez de usar `new Date(iso)` porque esa forma la
 * interpreta como UTC y, en husos al oeste de Greenwich —el de México, sin ir
 * más lejos— la fecha mostrada se queda un día corta.
 */
function formatear(iso) {
  const [anio, mes, dia] = iso.split("-")
  return `${Number(dia)} de ${MESES[Number(mes) - 1]} de ${anio}`
}
