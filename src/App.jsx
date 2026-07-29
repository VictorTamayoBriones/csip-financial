import { Route, Routes } from "react-router"
import Header from "./components/Header"
import Footer from "./components/Footer"
import BotonWhatsApp from "./components/BotonWhatsApp"
import DesplazarArriba from "./components/DesplazarArriba"
import Inicio from "./paginas/Inicio"
import Nosotros from "./paginas/Nosotros"
import AvisoPrivacidad from "./paginas/AvisoPrivacidad"
import Terminos from "./paginas/Terminos"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

export default function App() {
  return (
    <>
      <DesplazarArriba />
      <a className="saltar" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/aviso-de-privacidad" element={<AvisoPrivacidad />} />
          <Route path="/terminos" element={<Terminos />} />
        </Routes>
      </main>
      <Footer />
      <BotonWhatsApp />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
