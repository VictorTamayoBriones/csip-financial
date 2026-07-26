import { beneficios } from "../data/site"
import {
  IconoCasa,
  IconoCheck,
  IconoEfectivo,
  IconoEscudo,
  IconoNomina,
  IconoReloj,
} from "./Iconos"
import "./Beneficios.css"

const iconos = {
  efectivo: IconoEfectivo,
  casa: IconoCasa,
  nomina: IconoNomina,
  reloj: IconoReloj,
  escudo: IconoEscudo,
  check: IconoCheck,
}

export default function Beneficios() {
  return (
    <section className="seccion beneficios" id="beneficios">
      <div className="contenedor">
        <header className="beneficios__encabezado">
          <p className="eyebrow">Beneficios</p>
          <h2 className="titulo-seccion">Por qué conviene tramitarlo con nosotros</h2>
          <p className="entradilla">
            Un crédito bien tramitado es dinero que llega a tiempo. Esto es lo que
            obtienes al hacerlo de la mano de CSIP.
          </p>
        </header>

        <div className="beneficios__grid">
          {beneficios.map((b) => {
            const Icono = iconos[b.icono]
            return (
              <article className="beneficio" key={b.titulo}>
                <span className="beneficio__icono">
                  <Icono />
                </span>
                <h3>{b.titulo}</h3>
                <p>{b.texto}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
