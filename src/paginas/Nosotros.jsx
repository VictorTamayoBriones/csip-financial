import { Link } from "react-router"
import PaginaTexto from "../components/PaginaTexto"
import EnlaceWhatsApp from "../components/EnlaceWhatsApp"
import { IconoWhatsApp } from "../components/Iconos"
import { empresa } from "../data/site"
import { identidad } from "../data/legal"

function Dato({ valor, nombre }) {
  if (valor) return valor
  return <mark className="pendiente">[por confirmar: {nombre}]</mark>
}

export default function Nosotros() {
  return (
    <PaginaTexto
      titulo="Quiénes somos"
      migas="Quiénes somos"
      entradilla="Somos un despacho de asesoría en Puebla que acompaña a personas trabajadoras a tramitar su Crédito Mejoravit del Infonavit."
    >
      <h2>Qué hacemos</h2>
      <p>
        El Crédito Mejoravit es un derecho que ya generaste cotizando al Infonavit. El
        trámite es gratuito y puedes hacerlo por tu cuenta. En la práctica, mucha gente lo
        pierde por un documento mal integrado, por no saber cuántos puntos tiene o por
        abandonarlo a mitad de camino.
      </p>
      <p>
        Ahí es donde entramos: revisamos si calificas, te decimos exactamente qué
        necesitas, comprobamos que el expediente esté correcto antes de presentarlo y te
        acompañamos hasta la resolución. Nuestro trabajo es que el trámite no se caiga por
        una cuestión de forma.
      </p>

      <h2>Quién está detrás</h2>
      <p>
        Operamos desde <strong>{empresa.ciudad}</strong> desde{" "}
        <Dato valor={identidad.desde} nombre="año de inicio de operaciones" />, atendiendo
        a personas derechohabientes de Puebla y estados vecinos.
      </p>
      <p>
        Responsable del servicio:{" "}
        <Dato valor={identidad.responsable?.nombre} nombre="nombre del responsable" />,{" "}
        <Dato valor={identidad.responsable?.cargo} nombre="cargo" />.
      </p>

      <h2>Cómo trabajamos</h2>
      <ul>
        <li>
          <strong>Te decimos que no cuando es que no.</strong> Si no calificas, te lo
          decimos en la primera conversación y no te cobramos por descubrirlo.
        </li>
        <li>
          <strong>Sabes lo que pagas antes de empezar.</strong> Los honorarios se
          informan por adelantado, y la revisión inicial no cuesta nada.
        </li>
        <li>
          <strong>Una sola persona te atiende.</strong> No vas a tener que explicar tu
          caso desde cero cada vez que escribas.
        </li>
        <li>
          <strong>Nunca te pedimos tu contraseña</strong> de Mi Cuenta Infonavit. Si
          alguien lo hace en nuestro nombre, no somos nosotros.
        </li>
      </ul>

      <div className="pagina__nota">
        <p>
          <strong>No somos el Infonavit.</strong> CSIP es una empresa privada e
          independiente, sin representación oficial del instituto. Los trámites ante el
          Infonavit son gratuitos y puedes realizarlos por tu cuenta; nuestros honorarios
          corresponden únicamente a la asesoría y el acompañamiento. Puedes consultar el
          detalle en nuestros <Link to="/terminos">términos y condiciones</Link>.
        </p>
      </div>

      <h2>Hablemos</h2>
      <p>
        La forma más rápida de saber si calificas es escribirnos. Una conversación de
        cinco minutos basta para darte una respuesta concreta.
      </p>
      <p>
        <EnlaceWhatsApp className="btn btn--verde">
          <IconoWhatsApp />
          WhatsApp {empresa.telefono}
        </EnlaceWhatsApp>
      </p>
      <p className="pagina__fecha">{empresa.horario}.</p>
    </PaginaTexto>
  )
}
