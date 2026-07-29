import { useState } from "react"
import { requisitos, whatsapp } from "../data/site"
import { registrarClic } from "../data/seguimiento"
import { IconoCheck, IconoWhatsApp } from "./Iconos"
import "./Solicitud.css"

const estados = [
  "Puebla",
  "Tlaxcala",
  "Veracruz",
  "Ciudad de México",
  "Estado de México",
  "Hidalgo",
  "Morelos",
  "Otro estado",
]

const inicial = { nombre: "", telefono: "", estado: "", empleo: "si" }

export default function Solicitud() {
  const [datos, setDatos] = useState(inicial)
  const [errores, setErrores] = useState({})

  const cambiar = (campo) => (e) => {
    setDatos((prev) => ({ ...prev, [campo]: e.target.value }))
    setErrores((prev) => ({ ...prev, [campo]: null }))
  }

  const validar = () => {
    const nuevos = {}
    if (datos.nombre.trim().length < 3) nuevos.nombre = "Escribe tu nombre completo."
    if (!datos.estado) nuevos.estado = "Selecciona tu estado."
    setErrores(nuevos)
    return Object.keys(nuevos).length === 0
  }

  const enviar = (e) => {
    e.preventDefault()
    if (!validar()) return

    const mensaje = [
      "Hola CSIP, quiero saber si califico para el Crédito Mejoravit en efectivo.",
      `Nombre: ${datos.nombre.trim()}`,
      `Estado: ${datos.estado}`,
      `Relación laboral vigente: ${datos.empleo === "si" ? "Sí" : "No"}`,
    ].join("\n")

    // Este envío no usa EnlaceWhatsApp porque no es un enlace: el mensaje se
    // arma con los datos del formulario, así que hay que registrar el clic a
    // mano antes de abrir la conversación.
    registrarClic()
    window.open(whatsapp(mensaje), "_blank", "noopener")
  }

  return (
    <section className="seccion solicitud" id="requisitos">
      <div className="contenedor solicitud__grid">
        <div>
          <p className="eyebrow">Requisitos</p>
          <h2 className="titulo-seccion">Lo que necesitas para empezar</h2>
          <p className="entradilla">
            Si cumples con estos puntos, es muy probable que califiques. Si tienes dudas
            sobre alguno, escríbenos: lo revisamos contigo sin costo.
          </p>

          <ul className="solicitud__requisitos">
            {requisitos.map((r) => (
              <li key={r}>
                <IconoCheck size={20} />
                {r}
              </li>
            ))}
          </ul>

          <p className="solicitud__nota">
            Los requisitos y montos finales están sujetos a las reglas vigentes del
            Infonavit y a la validación de tu expediente.
          </p>
        </div>

        <form className="formulario" id="solicitud" onSubmit={enviar} noValidate>
          <h3>Revisa si calificas</h3>
          <p className="formulario__intro">
            Déjanos tus datos y continuamos la conversación por WhatsApp. Sin costo y sin
            compromiso.
          </p>

          <label className="campo">
            <span>Nombre completo</span>
            <input
              type="text"
              value={datos.nombre}
              onChange={cambiar("nombre")}
              placeholder="María Hernández López"
              autoComplete="name"
              aria-invalid={Boolean(errores.nombre)}
            />
            {errores.nombre && <em>{errores.nombre}</em>}
          </label>

          <label className="campo">
            <span>Estado</span>
            <select
              value={datos.estado}
              onChange={cambiar("estado")}
              aria-invalid={Boolean(errores.estado)}
            >
              <option value="">Selecciona una opción</option>
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            {errores.estado && <em>{errores.estado}</em>}
          </label>

          <fieldset className="campo campo--radios">
            <legend>¿Trabajas actualmente y cotizas al IMSS?</legend>
            <div>
              <label>
                <input
                  type="radio"
                  name="empleo"
                  value="si"
                  checked={datos.empleo === "si"}
                  onChange={cambiar("empleo")}
                />
                Sí
              </label>
              <label>
                <input
                  type="radio"
                  name="empleo"
                  value="no"
                  checked={datos.empleo === "no"}
                  onChange={cambiar("empleo")}
                />
                No
              </label>
            </div>
          </fieldset>

          <button className="btn btn--verde formulario__enviar" type="submit">
            <IconoWhatsApp />
            Enviar por WhatsApp
          </button>

          <p className="formulario__aviso">
            Al enviar aceptas que un asesor de CSIP te contacte. Tus datos se usan
            únicamente para atender tu solicitud.
          </p>
        </form>
      </div>
    </section>
  )
}
