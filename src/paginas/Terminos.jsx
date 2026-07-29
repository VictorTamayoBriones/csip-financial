import { Link } from "react-router"
import PaginaTexto from "../components/PaginaTexto"
import { empresa } from "../data/site"
import { legal } from "../data/legal"

function Dato({ valor, nombre }) {
  if (valor) return valor
  return <mark className="pendiente">[por confirmar: {nombre}]</mark>
}

export default function Terminos() {
  const correo = legal.correoPrivacidad || empresa.correo

  return (
    <PaginaTexto
      titulo="Términos y condiciones"
      migas="Términos y condiciones"
      actualizado={legal.actualizado}
      entradilla="Qué incluye nuestro servicio, qué no incluye y bajo qué condiciones lo prestamos."
    >
      <div className="pagina__nota">
        <p>
          <strong>Lo más importante, por delante.</strong> CSIP es una empresa privada e
          independiente. <strong>No es el Infonavit</strong> ni tiene representación
          oficial suya. El trámite del Crédito Mejoravit ante el Infonavit{" "}
          <strong>es gratuito y puedes hacerlo tú mismo</strong>. Lo que cobramos es
          nuestro trabajo de asesoría y acompañamiento, no el crédito.
        </p>
      </div>

      <h2>1. Quién presta el servicio</h2>
      <p>
        El servicio lo presta{" "}
        <Dato valor={legal.razonSocial} nombre="razón social" />, que opera comercialmente
        como <strong>{empresa.nombreLargo}</strong>, con domicilio en{" "}
        <Dato valor={legal.domicilio} nombre="domicilio" />.
      </p>

      <h2>2. Qué incluye el servicio</h2>
      <ul>
        <li>Revisión sin costo de si cumples los requisitos del Crédito Mejoravit.</li>
        <li>Estimación del monto al que podrías acceder según tus puntos y tu salario.</li>
        <li>Indicación detallada de la documentación necesaria y revisión de la misma.</li>
        <li>Integración del expediente y verificación previa a su presentación.</li>
        <li>Acompañamiento y seguimiento hasta la resolución del trámite.</li>
      </ul>

      <h2>3. Qué no incluye</h2>
      <ul>
        <li>
          <strong>No otorgamos el crédito.</strong> Quien lo autoriza y lo entrega es el
          Infonavit, conforme a sus propias reglas.
        </li>
        <li>
          <strong>No garantizamos la aprobación</strong> ni un monto determinado. Dependen
          de tus puntos, tu salario, tu saldo en la Subcuenta de Vivienda y de la
          normativa vigente, ninguno de los cuales controlamos.
        </li>
        <li>No intervenimos en los plazos de resolución del Infonavit.</li>
        <li>No gestionamos el uso que des al dinero una vez recibido.</li>
      </ul>

      <h2>4. Honorarios</h2>
      <p>
        La revisión inicial de si calificas es gratuita y sin compromiso. Si decides
        continuar, te informaremos del importe de nuestros honorarios y de su forma de
        pago <strong>antes de iniciar cualquier gestión</strong>. No cobramos nada sin que
        lo hayas aceptado previamente.
      </p>
      <p>
        Nuestros honorarios retribuyen el servicio de asesoría descrito en el punto 2 y
        son independientes del resultado del trámite ante el Infonavit, salvo que se pacte
        expresamente otra cosa por escrito.
      </p>

      <h2>5. Tus responsabilidades</h2>
      <ul>
        <li>
          Proporcionar información y documentación veraz, completa y vigente. Un dato
          incorrecto puede provocar el rechazo del trámite.
        </li>
        <li>Comunicarnos cualquier cambio en tu situación laboral durante el proceso.</li>
        <li>
          Conservar tus propias credenciales de Mi Cuenta Infonavit. Nunca te pediremos tu
          contraseña, y no debes compartirla con nadie.
        </li>
      </ul>

      <h2>6. Información de este sitio</h2>
      <p>
        Los contenidos de este sitio son informativos y pueden quedar desactualizados si
        el Infonavit modifica sus reglas, montos o requisitos. No constituyen asesoría
        financiera personalizada ni una oferta vinculante. La información aplicable a tu
        caso es la que te confirme tu asesor tras revisar tu situación concreta.
      </p>

      <h2>7. Protección de datos</h2>
      <p>
        El tratamiento de tus datos personales se rige por nuestro{" "}
        <Link to="/aviso-de-privacidad">aviso de privacidad</Link>.
      </p>

      <h2>8. Contacto y modificaciones</h2>
      <p>
        Para cualquier duda sobre estos términos puedes escribirnos a{" "}
        <a href={`mailto:${correo}`}>{correo}</a> o por WhatsApp al {empresa.telefono}.
      </p>
      <p>
        Podemos actualizar estos términos; la versión vigente será siempre la publicada en
        esta página, con su fecha de actualización.
      </p>
    </PaginaTexto>
  )
}
