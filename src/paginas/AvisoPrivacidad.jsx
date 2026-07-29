import PaginaTexto from "../components/PaginaTexto"
import { empresa } from "../data/site"
import { legal } from "../data/legal"

/** Muestra el dato o, si aún no se ha confirmado, un hueco visible. */
function Dato({ valor, nombre }) {
  if (valor) return valor
  return <mark className="pendiente">[por confirmar: {nombre}]</mark>
}

export default function AvisoPrivacidad() {
  const correo = legal.correoPrivacidad || empresa.correo

  return (
    <PaginaTexto
      titulo="Aviso de privacidad"
      migas="Aviso de privacidad"
      actualizado={legal.actualizado}
      entradilla="Cómo tratamos tus datos personales cuando nos contactas para tramitar tu Crédito Mejoravit."
    >
      <h2>1. Quién es responsable de tus datos</h2>
      <p>
        <Dato valor={legal.razonSocial} nombre="razón social" />, que opera comercialmente
        como <strong>{empresa.nombreLargo}</strong> (en adelante, «CSIP»), es responsable
        del tratamiento de tus datos personales.
      </p>

      <div className="pagina__datos">
        <dl>
          <dt>Domicilio</dt>
          <dd>
            <Dato valor={legal.domicilio} nombre="domicilio" />
          </dd>
          <dt>Correo</dt>
          <dd>
            <a href={`mailto:${correo}`}>{correo}</a>
          </dd>
          <dt>Teléfono</dt>
          <dd>{empresa.telefono}</dd>
        </dl>
      </div>

      <h2>2. Qué datos recabamos</h2>
      <p>
        Recabamos únicamente los datos que tú nos proporcionas, en dos momentos
        distintos del proceso.
      </p>

      <h3>Al contactarnos</h3>
      <p>
        El formulario de este sitio te pide tu <strong>nombre</strong>, el{" "}
        <strong>estado</strong> donde te encuentras y si{" "}
        <strong>mantienes una relación laboral vigente</strong>. Estos datos no se
        almacenan en este sitio web ni se envían a ningún servidor nuestro: al pulsar el
        botón se abre WhatsApp con un mensaje ya redactado, y eres tú quien decide
        enviarlo. A partir de ahí conocemos también tu número de teléfono, porque es el
        que usas para escribirnos.
      </p>

      <h3>Al integrar tu expediente</h3>
      <p>
        Si decides continuar con el trámite, necesitamos los documentos que exige el
        Infonavit: identificación oficial, CURP, Número de Seguridad Social, comprobante
        de domicilio y estado de cuenta bancario con CLABE. Estos incluyen{" "}
        <strong>datos personales financieros</strong>, cuyo tratamiento requiere tu
        consentimiento expreso; te lo solicitaremos por escrito antes de recibirlos.
      </p>

      <h3>Datos de navegación</h3>
      <p>
        Este sitio mide su rendimiento y sus visitas de forma agregada, y contabiliza
        cuántas personas pulsan los botones de WhatsApp. Ese conteo registra la fecha y el
        canal de procedencia, y <strong>no incluye ningún dato que te identifique</strong>.
        No usamos cookies de publicidad ni de seguimiento entre sitios.
      </p>

      <h2>3. Para qué los usamos</h2>
      <p>Finalidades necesarias para darte el servicio que nos pides:</p>
      <ul>
        <li>Comunicarnos contigo y responder a tu solicitud de información.</li>
        <li>Estimar si cumples los requisitos del Crédito Mejoravit y por qué monto.</li>
        <li>Integrar y revisar tu expediente, y acompañar su presentación.</li>
        <li>Cumplir las obligaciones legales y fiscales derivadas del servicio.</li>
      </ul>

      <p>
        Finalidades adicionales, que <strong>no</strong> son necesarias y a las que puedes
        negarte sin que ello afecte al servicio:
      </p>
      <ul>
        <li>Informarte de otros productos o servicios de CSIP.</li>
        <li>Contactarte más adelante si tu situación cambia y vuelves a calificar.</li>
      </ul>
      <p>
        Para negarte a estas últimas basta con que nos lo digas por WhatsApp o escribas a{" "}
        <a href={`mailto:${correo}`}>{correo}</a>.
      </p>

      <h2>4. Con quién los compartimos</h2>
      <p>
        Tus datos y documentos se presentan ante el <strong>Infonavit</strong> y, en su
        caso, ante la entidad financiera que participe en tu trámite, porque sin ello el
        crédito no puede gestionarse. Esta transferencia es necesaria para cumplir la
        relación jurídica contigo y no requiere tu consentimiento adicional, conforme al
        artículo 37 de la LFPDPPP.
      </p>
      <p>
        No vendemos, alquilamos ni cedemos tus datos personales a terceros con fines
        comerciales.
      </p>

      <h2>5. Tus derechos ARCO</h2>
      <p>
        Puedes solicitar en cualquier momento el <strong>acceso</strong> a tus datos, su{" "}
        <strong>rectificación</strong> si son inexactos, su <strong>cancelación</strong> si
        consideras que no los necesitamos, u <strong>oponerte</strong> a que los usemos
        para una finalidad concreta. También puedes revocar el consentimiento que nos
        hayas dado.
      </p>
      <p>
        Escríbenos a <a href={`mailto:${correo}`}>{correo}</a> indicando tu nombre, un
        medio para responderte, qué derecho quieres ejercer y una copia de tu
        identificación. Te responderemos en un plazo máximo de 20 días hábiles.
      </p>

      <h2>6. Conservación y seguridad</h2>
      <p>
        Conservamos tus datos mientras dure el trámite y, después, durante el plazo que
        exijan las obligaciones legales aplicables. Aplicamos medidas razonables para
        protegerlos, pero ninguna transmisión por internet o mensajería es completamente
        infalible: te pedimos que no envíes documentos por canales distintos a los que te
        indique tu asesor.
      </p>

      <h2>7. Cambios a este aviso</h2>
      <p>
        Publicaremos cualquier modificación en esta misma página, actualizando la fecha
        que aparece al inicio. Te recomendamos revisarla periódicamente.
      </p>

      <div className="pagina__nota">
        <p>
          <strong>CSIP no es el Infonavit</strong> ni forma parte de él. Los trámites ante
          el Infonavit son gratuitos y puedes realizarlos por tu cuenta. Nuestros
          honorarios corresponden exclusivamente al servicio de asesoría, integración de
          expediente y acompañamiento.
        </p>
      </div>
    </PaginaTexto>
  )
}
