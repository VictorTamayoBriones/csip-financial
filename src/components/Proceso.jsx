import { pasos } from "../data/site"
import EnlaceWhatsApp from "./EnlaceWhatsApp"
import { IconoWhatsApp } from "./Iconos"
import "./Proceso.css"

export default function Proceso() {
  return (
    <section className="seccion proceso" id="proceso">
      <div className="proceso__patron patron" aria-hidden="true" />

      <div className="contenedor">
        <header className="proceso__encabezado">
          <p className="eyebrow">Proceso</p>
          <h2 className="titulo-seccion">Cuatro pasos, sin vueltas de más</h2>
        </header>

        <ol className="proceso__lista">
          {pasos.map((paso, i) => (
            <li className="paso" key={paso.titulo}>
              <span className="paso__numero">{String(i + 1).padStart(2, "0")}</span>
              <h3>{paso.titulo}</h3>
              <p>{paso.texto}</p>
            </li>
          ))}
        </ol>

        <EnlaceWhatsApp className="btn btn--claro proceso__cta">
          <IconoWhatsApp />
          Empezar por WhatsApp
        </EnlaceWhatsApp>
      </div>
    </section>
  )
}
