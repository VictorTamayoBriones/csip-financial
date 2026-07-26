import post from "../assets/post-mejoravit.jpg"
import { IconoCheck } from "./Iconos"
import "./Credito.css"

const usos = [
  "Impermeabilizar, pintar y reparar humedades",
  "Cambiar pisos, baños, cocina o instalaciones",
  "Ampliar un cuarto o construir en tu terreno",
  "Cambiar puertas, ventanas y acabados",
]

export default function Credito() {
  return (
    <section className="seccion credito" id="credito">
      <div className="contenedor credito__grid">
        <div className="credito__media">
          <img
            src={post}
            alt="Campaña de CSIP del Crédito Mejoravit: remodela tu hogar y mejora tu espacio familiar"
            width="760"
            height="760"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="credito__texto">
          <p className="eyebrow">Qué es</p>
          <h2 className="titulo-seccion">Un crédito que ya generaste</h2>
          <p className="subtitulo">Remodela tu hogar y mejora tu espacio familiar.</p>

          <p className="entradilla">
            El Mejoravit es el crédito que el Infonavit otorga a las personas trabajadoras
            afiliadas para reparar, remodelar o ampliar su vivienda. No hipoteca tu casa,
            no revisa buró y se paga con descuentos vía nómina.
          </p>
          <p className="entradilla">
            En CSIP nos dedicamos a lo que suele complicar el trámite: revisar tu
            precalificación, integrar bien tu expediente y darle seguimiento hasta que
            recibas tu dinero.
          </p>

          <ul className="credito__usos">
            {usos.map((uso) => (
              <li key={uso}>
                <IconoCheck size={20} />
                {uso}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
