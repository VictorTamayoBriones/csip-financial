import "./Confianza.css"

const puntos = [
  { dato: "Sin garantía", texto: "No hipotecas ni pones en riesgo tu vivienda" },
  { dato: "Sin buró", texto: "No se revisa tu historial crediticio" },
  { dato: "Vía nómina", texto: "Pagos fijos descontados de tu salario" },
  { dato: "Asesor asignado", texto: "Una persona te acompaña todo el trámite" },
]

export default function Confianza() {
  return (
    <section className="confianza">
      <div className="contenedor confianza__grid">
        {puntos.map((p) => (
          <div className="confianza__item" key={p.dato}>
            <strong>{p.dato}</strong>
            <span>{p.texto}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
