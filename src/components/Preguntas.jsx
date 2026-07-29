import { empresa, preguntas } from "../data/site"
import EnlaceWhatsApp from "./EnlaceWhatsApp"
import { IconoWhatsApp } from "./Iconos"
import "./Preguntas.css"

export default function Preguntas() {
  return (
    <section className="seccion preguntas" id="preguntas">
      <div className="contenedor preguntas__grid">
        <header className="preguntas__encabezado">
          <p className="eyebrow">Preguntas</p>
          <h2 className="titulo-seccion">Dudas frecuentes</h2>
          <p className="entradilla">
            Si tu pregunta no está aquí, escríbenos por WhatsApp y te respondemos con
            claridad.
          </p>
          <EnlaceWhatsApp className="preguntas__contacto">
            <IconoWhatsApp size={22} />
            <span>
              <small>Resolvemos tu duda hoy</small>
              <strong>{empresa.telefono}</strong>
            </span>
          </EnlaceWhatsApp>

          <div className="rombos preguntas__rombos" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </header>

        <div className="preguntas__lista">
          {preguntas.map((p) => (
            <details className="pregunta" key={p.q}>
              <summary>
                {p.q}
                <span className="pregunta__mas" aria-hidden="true" />
              </summary>
              <p>{p.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
