import { empresa } from "../data/site"
import EnlaceWhatsApp from "./EnlaceWhatsApp"
import { IconoWhatsApp } from "./Iconos"
import "./CtaFinal.css"

export default function CtaFinal() {
  return (
    <section className="cta">
      <div className="cta__patron patron" aria-hidden="true" />
      <div className="contenedor cta__contenido">
        <p className="eyebrow eyebrow--centrado">Da el primer paso</p>
        <h2>Tu casa puede mejorar este mes</h2>
        <p className="cta__texto">
          Una conversación de cinco minutos basta para saber si calificas y por cuánto.
          Escríbenos y lo revisamos hoy mismo.
        </p>

        <div className="cta__acciones">
          <EnlaceWhatsApp className="btn btn--verde">
            <IconoWhatsApp />
            WhatsApp {empresa.telefono}
          </EnlaceWhatsApp>
          <a className="btn btn--claro" href={`tel:${empresa.telefonoInternacional}`}>
            Llamar ahora
          </a>
        </div>

        <p className="cta__horario">{empresa.horario}</p>
      </div>
    </section>
  )
}
