import Header from "./components/Header"
import Hero from "./components/Hero"
import Confianza from "./components/Confianza"
import Credito from "./components/Credito"
import Beneficios from "./components/Beneficios"
import Proceso from "./components/Proceso"
import Solicitud from "./components/Solicitud"
import Preguntas from "./components/Preguntas"
import CtaFinal from "./components/CtaFinal"
import Footer from "./components/Footer"
import BotonWhatsApp from "./components/BotonWhatsApp"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

export default function App() {
  return (
    <>
      <a className="saltar" href="#credito">
        Saltar al contenido
      </a>
      <Header />
      <main>
        <Hero />
        <Confianza />
        <Credito />
        <Beneficios />
        <Proceso />
        <Solicitud />
        <Preguntas />
        <CtaFinal />
      </main>
      <Footer />
      <BotonWhatsApp />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
