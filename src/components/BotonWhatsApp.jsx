import { useEffect, useState } from "react"
import { mensajeDefault, whatsapp } from "../data/site"
import { IconoWhatsApp } from "./Iconos"
import "./BotonWhatsApp.css"

export default function BotonWhatsApp() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const alScroll = () => setVisible(window.scrollY > 600)
    alScroll()
    window.addEventListener("scroll", alScroll, { passive: true })
    return () => window.removeEventListener("scroll", alScroll)
  }, [])

  return (
    <a
      className={`flotante ${visible ? "flotante--visible" : ""}`}
      href={whatsapp(mensajeDefault)}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir por WhatsApp a CSIP"
      tabIndex={visible ? 0 : -1}
    >
      <IconoWhatsApp size={26} />
      <span>Escríbenos</span>
    </a>
  )
}
