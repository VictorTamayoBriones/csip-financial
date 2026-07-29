import { useEffect } from "react"
import { useLocation } from "react-router"

/**
 * Lleva el scroll al inicio al cambiar de ruta.
 *
 * React Router no lo hace por su cuenta: al navegar de la home a /nosotros se
 * conserva la posición vertical, así que quien pulse el enlace desde media
 * página aterriza a media página.
 *
 * Si la URL trae un fragmento (#preguntas) no se toca nada: ahí el navegador
 * ya se encarga de ir al ancla, y moverlo al inicio lo estropearía.
 */
export default function DesplazarArriba() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
