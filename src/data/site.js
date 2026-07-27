/* ==========================================================================
   Configuración del sitio.
   Todo lo editable (teléfono, textos, preguntas frecuentes) vive aquí para no
   tener que tocar los componentes.
   ========================================================================== */

/**
 * Datos del sitio para SEO. `url` es la única fuente de verdad del dominio:
 * de aquí salen la etiqueta canónica, las Open Graph, el JSON-LD, el sitemap y
 * el robots.txt (ver el plugin en vite.config.js).
 */
export const sitio = {
  url: "https://www.csip-financial.com",
  titulo: "CSIP · Crédito Mejoravit en efectivo",
  descripcion:
    "En CSIP te asesoramos para obtener tu Crédito Mejoravit de Infonavit y disponer de él en efectivo. Sin hipotecar tu casa y con descuento vía nómina.",
  imagen: "/og-image.jpg",
  imagenAlto: "Crédito Mejoravit en efectivo con CSIP Servicios Financieros",
}

export const empresa = {
  nombre: "CSIP",
  nombreLargo: "CSIP Servicios Financieros",
  telefono: "221 441 3591",
  telefonoInternacional: "+522214413591",
  correo: "laloed21@outlook.es",
  ciudad: "Puebla, México",
  horario: "Lunes a viernes de 9:00 a 19:00 · Sábados de 9:00 a 14:00",
};

/**
 * Monto máximo autorizado que se muestra en la página.
 * Se deja en null a propósito: en cuanto confirmes la cifra vigente con la que
 * trabajan, escríbela aquí (ej. "$118,000") y aparecerá en el héroe y en el FAQ.
 */
export const montoMaximo = null;

export const whatsapp = (mensaje) =>
  `https://wa.me/${empresa.telefonoInternacional.replace("+", "")}?text=${encodeURIComponent(mensaje)}`;

export const mensajeDefault =
  "Hola CSIP, me interesa el Crédito Mejoravit en efectivo. ¿Me pueden dar informes?";

export const navegacion = [
  { href: "#credito", texto: "El crédito" },
  { href: "#beneficios", texto: "Beneficios" },
  { href: "#proceso", texto: "Proceso" },
  { href: "#requisitos", texto: "Requisitos" },
  { href: "#preguntas", texto: "Preguntas" },
];

export const beneficios = [
  {
    icono: "efectivo",
    titulo: "Recíbelo en efectivo",
    texto:
      "Te acompañamos en todo el trámite para que dispongas de tu crédito en efectivo y lo destines a la mejora de tu vivienda.",
  },
  {
    icono: "casa",
    titulo: "Sin hipotecar tu casa",
    texto:
      "El Mejoravit no toma tu vivienda como garantía. Es un crédito de mejora, no una hipoteca sobre tu patrimonio.",
  },
  {
    icono: "nomina",
    titulo: "Descuento vía nómina",
    texto:
      "Los pagos se descuentan directamente de tu salario, en montos fijos y sin que tengas que hacer filas ni transferencias.",
  },
  {
    icono: "reloj",
    titulo: "Respuesta rápida",
    texto:
      "Revisamos tu precalificación el mismo día que nos escribes y te decimos con claridad si calificas y por cuánto.",
  },
  {
    icono: "escudo",
    titulo: "Asesoría de principio a fin",
    texto:
      "Un asesor asignado te explica cada paso, revisa tus documentos y evita que pierdas el trámite por un error de forma.",
  },
  {
    icono: "check",
    titulo: "Sin buró de crédito",
    texto:
      "Es un derecho que ya generaste como trabajador afiliado: no se evalúa tu historial en buró para otorgarlo.",
  },
];

export const pasos = [
  {
    titulo: "Escríbenos por WhatsApp",
    texto:
      "Nos cuentas tu situación laboral y validamos sin costo si eres candidato al crédito.",
  },
  {
    titulo: "Revisamos tu precalificación",
    texto:
      "Consultamos contigo tus puntos y tu saldo en Mi Cuenta Infonavit para estimar tu monto.",
  },
  {
    titulo: "Integramos tu expediente",
    texto:
      "Te decimos exactamente qué documentos necesitas y revisamos que todo esté correcto antes de ingresarlo.",
  },
  {
    titulo: "Recibes tu crédito",
    texto:
      "Damos seguimiento hasta la autorización y te acompañamos para que dispongas de tu dinero.",
  },
];

export const requisitos = [
  "Relación laboral vigente y cotizando ante el IMSS.",
  "Ser derechohabiente Infonavit con los puntos requeridos.",
  "Identificación oficial vigente (INE o pasaporte).",
  "CURP y Número de Seguridad Social (NSS).",
  "Comprobante de domicilio reciente de la vivienda a mejorar.",
  "Estado de cuenta bancario a tu nombre con CLABE.",
];

export const preguntas = [
  {
    q: "¿Qué es el Crédito Mejoravit?",
    a: "Es el crédito que otorga el Infonavit a las personas trabajadoras afiliadas para reparar, remodelar o ampliar su vivienda. No hipoteca tu casa y se paga con descuentos vía nómina.",
  },
  {
    q: "¿Cuánto me pueden prestar?",
    a: "El monto depende de tus puntos Infonavit, tu salario y tu saldo en la Subcuenta de Vivienda. En cuanto nos compartas tus datos te damos una estimación puntual y sin compromiso.",
  },
  {
    q: "¿Revisan mi buró de crédito?",
    a: "No. El Mejoravit es una prestación que generas como persona trabajadora afiliada, por lo que no se evalúa tu historial crediticio para otorgarlo.",
  },
  {
    q: "¿Cuánto tarda el trámite?",
    a: "Depende de qué tan completo esté tu expediente. Con la documentación en orden el proceso suele resolverse en cuestión de días; nosotros te avisamos de cada avance.",
  },
  {
    q: "¿CSIP es Infonavit?",
    a: "No. CSIP es una empresa privada e independiente de servicios financieros. El trámite ante el Infonavit es gratuito y puedes realizarlo por tu cuenta; nuestros honorarios corresponden únicamente al servicio de asesoría, integración de expediente y acompañamiento.",
  },
  {
    q: "¿Qué pasa si dejo mi empleo?",
    a: "El saldo del crédito se sigue cubriendo conforme a las reglas del Infonavit. Antes de iniciar te explicamos con detalle las condiciones de pago para que decidas con información completa.",
  },
];
