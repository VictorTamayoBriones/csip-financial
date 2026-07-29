import { useEffect, useState } from "react"
import logo from "../assets/logo-csip.webp"
import { empresa, navegacion } from "../data/site"
import EnlaceWhatsApp from "./EnlaceWhatsApp"
import { IconoMenu, IconoWhatsApp } from "./Iconos"
import "./Header.css"

export default function Header() {
  const [fijo, setFijo] = useState(false)
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    const alScroll = () => setFijo(window.scrollY > 24)
    alScroll()
    window.addEventListener("scroll", alScroll, { passive: true })
    return () => window.removeEventListener("scroll", alScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [abierto])

  return (
    <header className={`header ${fijo ? "header--fijo" : ""}`}>
      <div className="header__cinta patron" aria-hidden="true" />

      <div className="contenedor header__barra">
        <a className="header__marca" href="#inicio" onClick={() => setAbierto(false)}>
          <img src={logo} alt="" width="44" height="44" />
          <span>
            <strong>CSIP</strong>
            <small>Servicios Financieros</small>
          </span>
        </a>

        <nav className={`header__nav ${abierto ? "header__nav--abierto" : ""}`}>
          {navegacion.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setAbierto(false)}>
              {item.texto}
            </a>
          ))}
          <EnlaceWhatsApp className="btn btn--verde header__cta-movil">
            <IconoWhatsApp />
            {empresa.telefono}
          </EnlaceWhatsApp>
        </nav>

        <EnlaceWhatsApp className="btn btn--verde header__cta">
          <IconoWhatsApp />
          Solicitar informes
        </EnlaceWhatsApp>

        <button
          className="header__hamburguesa"
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        >
          <IconoMenu abierto={abierto} />
        </button>
      </div>
    </header>
  )
}
