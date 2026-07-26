import post400 from "../assets/post-mejoravit-400.webp"
import post500 from "../assets/post-mejoravit-500.webp"
import post760 from "../assets/post-mejoravit-760.webp"
import post960 from "../assets/post-mejoravit-960.webp"
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
          {/* Medido en el navegador: la imagen ocupa 342 px a 390 de ancho de
              ventana, 460 px entre 768 y 900, y ~477 px por encima. El srcset
              deja que el navegador elija según eso y según la densidad de la
              pantalla, en vez de bajar siempre la versión grande. */}
          <img
            src={post760}
            srcSet={`${post400} 400w, ${post500} 500w, ${post760} 760w, ${post960} 960w`}
            sizes="(max-width: 480px) 92vw, (max-width: 900px) 460px, 480px"
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
