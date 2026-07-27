import familia380 from "../assets/familia-380.webp"
import familia500 from "../assets/familia.webp"
import { heroeSizes } from "../data/imagenes"
import { empresa, mensajeDefault, montoMaximo, whatsapp } from "../data/site"
import { IconoFlecha, IconoWhatsApp } from "./Iconos"
import "./Hero.css"

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__fondo patron" aria-hidden="true" />

      <div className="contenedor hero__grid">
        <div className="hero__texto">
          {/* El H1 abarca la frase completa —"Crédito Mejoravit en efectivo, sin
              hipotecar tu casa"— aunque visualmente se lea en tres niveles. */}
          <h1 className="hero__titulo">
            <span className="eyebrow">Crédito</span>
            <span className="hero__titulo-palabra">Mejoravit</span>
            <span className="hero__lema">en efectivo, sin hipotecar tu casa.</span>
          </h1>

          <p className="hero__descripcion">
            En CSIP te asesoramos de principio a fin para obtener tu Crédito Mejoravit
            del Infonavit y disponer de él en efectivo, para que hagas las mejoras que tu
            hogar necesita.
            {montoMaximo ? ` Montos de hasta ${montoMaximo} según tus puntos.` : ""}
          </p>

          <div className="hero__acciones">
            <a
              className="btn btn--verde"
              href={whatsapp(mensajeDefault)}
              target="_blank"
              rel="noreferrer"
            >
              <IconoWhatsApp />
              Quiero informes
            </a>
            <a className="btn btn--fantasma" href="#solicitud">
              Revisar si califico
              <IconoFlecha />
            </a>
          </div>

          <a
            className="hero__whatsapp"
            href={whatsapp(mensajeDefault)}
            target="_blank"
            rel="noreferrer"
          >
            <span className="hero__whatsapp-icono">
              <IconoWhatsApp size={22} />
            </span>
            <span>
              <small>Escríbenos por WhatsApp</small>
              <strong>{empresa.telefono}</strong>
            </span>
          </a>

          <div className="rombos hero__rombos" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="hero__imagen">
          {/* En móvil la foto ocupa 342 px y en escritorio hasta 515 px, así que
              en pantallas pequeñas basta la versión de 380. */}
          <img
            src={familia500}
            srcSet={`${familia380} 380w, ${familia500} 500w`}
            sizes={heroeSizes}
            alt="Familia mexicana remodelando y pintando la pared de su casa con el Crédito Mejoravit"
            width="500"
            height="730"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  )
}
