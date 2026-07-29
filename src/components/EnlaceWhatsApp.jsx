import { mensajeDefault, whatsapp } from "../data/site"
import { registrarClic } from "../data/seguimiento"

/**
 * Enlace a WhatsApp. Todas las salidas del sitio pasan por aquí para que el
 * registro del clic no dependa de acordarse de añadirlo en cada botón nuevo,
 * y para no repetir `target`/`rel` en los diez sitios donde aparece.
 *
 * Acepta cualquier atributo de <a> (className, aria-label…) y un `mensaje`
 * propio si el botón necesita un texto distinto al de por defecto.
 */
export default function EnlaceWhatsApp({
  mensaje = mensajeDefault,
  onClick,
  children,
  ...resto
}) {
  const alHacerClic = (evento) => {
    registrarClic()
    onClick?.(evento)
  }

  return (
    <a
      href={whatsapp(mensaje)}
      target="_blank"
      rel="noreferrer"
      {...resto}
      onClick={alHacerClic}
    >
      {children}
    </a>
  )
}
