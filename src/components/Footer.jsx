import logo from "../assets/logo-csip.jpg"
import { empresa, mensajeDefault, navegacion, whatsapp } from "../data/site"
import { IconoCorreo, IconoTelefono, IconoWhatsApp } from "./Iconos"
import "./Footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="contenedor footer__grid">
        <div className="footer__marca">
          <a className="footer__logo" href="#inicio">
            <img src={logo} alt="" width="48" height="48" />
            <span>
              <strong>CSIP</strong>
              <small>Servicios Financieros</small>
            </span>
          </a>
          <p>
            Asesoría y gestión de crédito para personas trabajadoras. Acompañamos tu
            trámite del Crédito Mejoravit de principio a fin.
          </p>
          <div className="rombos" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <nav className="footer__nav">
          <h3>Navegación</h3>
          {navegacion.map((item) => (
            <a key={item.href} href={item.href}>
              {item.texto}
            </a>
          ))}
        </nav>

        <div className="footer__contacto">
          <h3>Contacto</h3>
          <a href={whatsapp(mensajeDefault)} target="_blank" rel="noreferrer">
            <IconoWhatsApp size={18} />
            WhatsApp {empresa.telefono}
          </a>
          <a href={`tel:${empresa.telefonoInternacional}`}>
            <IconoTelefono size={18} />
            {empresa.telefono}
          </a>
          <a href={`mailto:${empresa.correo}`}>
            <IconoCorreo size={18} />
            {empresa.correo}
          </a>
          <p>{empresa.ciudad}</p>
          <p>{empresa.horario}</p>
        </div>
      </div>

      <div className="contenedor footer__legal">
        <p>
          <strong>Aviso importante.</strong> CSIP es una empresa privada e independiente
          de servicios financieros; no es el Infonavit ni forma parte de él, y no cuenta
          con representación oficial de dicho instituto. Los trámites ante el Infonavit
          son gratuitos y puedes realizarlos por tu cuenta. Nuestros honorarios
          corresponden exclusivamente a servicios de asesoría, integración de expediente y
          acompañamiento. Los montos, requisitos y condiciones dependen de las reglas
          vigentes del Infonavit y de la evaluación de cada solicitante.
        </p>
        <p className="footer__copy">
          © {new Date().getFullYear()} {empresa.nombreLargo}. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  )
}
