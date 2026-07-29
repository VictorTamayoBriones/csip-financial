import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'

const raiz = document.getElementById('root')
const arbol = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// En producción el HTML ya viene renderizado desde el build (ver
// scripts/prerender.mjs) y sólo hay que hidratarlo. En `npm run dev` no hay
// prerender: Vite sirve el index.html tal cual, con el div vacío, así que ahí
// montamos desde cero. Hidratar un contenedor vacío haría que React avisara de
// un desajuste y volviera a renderizar todo.
if (raiz.hasChildNodes()) {
  hydrateRoot(raiz, arbol)
} else {
  createRoot(raiz).render(arbol)
}
