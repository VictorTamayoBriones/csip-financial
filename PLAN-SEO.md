# Plan de trabajo — visibilidad orgánica de csip-financial.com

Documento de trabajo. Objetivo: pasar de una landing técnicamente correcta pero
invisible para los buscadores a un sitio que capte demanda orgánica de Crédito
Mejoravit de forma sostenida.

---

## 0. Línea base (26 de julio de 2026)

Lo que **ya está resuelto** y no hay que volver a tocar:

| Área | Estado |
|---|---|
| Canónica, Open Graph, Twitter Card | Generadas desde `sitio.url` en `vite.config.js` |
| JSON-LD | `FinancialService`, `WebSite`, `FAQPage`, `HowTo` |
| `robots.txt` y `sitemap.xml` | Emitidos en `generateBundle()` |
| Cabeceras de seguridad y caché | `vercel.json` (CSP, HSTS implícito, immutable en `/assets`) |
| Rendimiento | Fuentes autohospedadas + precargadas, LCP precargado con `srcset`, `width`/`height` en imágenes |
| Accesibilidad base | Skip link, `aria-label` en controles, jerarquía H1→H2→H3 correcta |
| Cumplimiento | Disclaimer "no somos Infonavit" en el footer y en el FAQ |

Lo que **falta**, y que este plan resuelve:

1. El HTML servido no contiene contenido (`<body><div id="root"></div></body>`).
2. Existe **una sola URL**, así que sólo se puede competir por un puñado de consultas.
3. No hay Search Console, Bing Webmaster ni Google Business Profile.
4. Faltan páginas legales y de identidad (YMYL sin señales de confianza).
5. El JSON-LD describe una entidad incompleta (sin `sameAs`, sin dirección, sin reseñas).
6. No hay medición de conversión: no sabemos qué tráfico se vuelve conversación de WhatsApp.

---

## 1. Cómo mediremos que el plan funcionó

Definir la métrica antes de trabajar evita discutirlo después.

| Indicador | Hoy | Meta a 90 días | Meta a 180 días | Fuente |
|---|---|---|---|---|
| URLs indexadas | 1 (probablemente 0) | 8 | 20 | Search Console → Páginas |
| Impresiones/mes | sin dato | 3 000 | 15 000 | Search Console |
| Clics/mes | sin dato | 150 | 900 | Search Console |
| Consultas con posición ≤ 10 | sin dato | 10 | 45 | Search Console |
| Clics a WhatsApp/mes | sin medir | 60 | 300 | Evento `whatsapp_click` |
| Tasa clic→WhatsApp | sin medir | ≥ 8 % | ≥ 10 % | Vercel Analytics |

Nota realista: un dominio nuevo en un nicho financiero tarda entre 3 y 6 meses en
consolidar posiciones. Las metas de 90 días son de indexación y cola larga, no de
cabeza de demanda.

---

## Fase 0 — Instrumentación (día 1, sin tocar código)

Es lo primero porque **sin esto no podemos evaluar ninguna de las fases siguientes.**

### T0.1 · Google Search Console
- Dar de alta la propiedad de **dominio** (`csip-financial.com`), no la de prefijo de URL:
  cubre `www`, apex, `http` y `https` de una vez.
- Verificar con registro TXT en el DNS. Si el DNS está en Vercel: Project → Domains →
  el registro se añade desde el panel de Vercel.
- Enviar `https://www.csip-financial.com/sitemap.xml`.
- Usar *Inspección de URL → Solicitar indexación* para la home.
- **Criterio de aceptación:** propiedad verificada, sitemap en estado "Correcto", home
  con veredicto "La URL está en Google".

### T0.2 · Bing Webmaster Tools
- Importar la propiedad desde Search Console (dos clics, evita reverificar).
- Bing alimenta también a **Copilot y a DuckDuckGo**, así que no es opcional.

### T0.3 · Google Business Profile
- Crear/reclamar la ficha de **CSIP Servicios Financieros** en Puebla.
- Categoría principal: *Servicio de préstamos* o *Asesor financiero*.
- Rellenar horario (el que ya está en `site.js`: L-V 9:00–19:00, Sáb 9:00–14:00),
  teléfono `221 441 3591`, sitio web, área de servicio (los 7 estados que aparecen
  en `Solicitud.jsx`).
- **Bloqueante identificado:** Google pide una dirección física verificable por
  postal. Hay que decidir si se publica el domicilio o se configura como
  "negocio de área de servicio" (oculta la dirección pero exige igualmente
  verificarla). Sin GBP no se compite en el paquete de mapas, que es donde está
  buena parte de las búsquedas locales de crédito.
- **Criterio de aceptación:** ficha verificada y publicada.

### T0.4 · Correo corporativo
- Sustituir `laloed21@outlook.es` por `contacto@csip-financial.com`.
- Impacto doble: confianza del usuario (una financiera con correo de Outlook personal
  pierde solicitudes) y coherencia de entidad para Google.
- **Archivo:** `src/data/site.js:26`.

**Esfuerzo total Fase 0:** ~3 h de trabajo + días de espera por la postal de GBP.
**Dependencias:** ninguna. Empezar hoy.

---

## Fase 1 — Que el HTML servido contenga el contenido ✅ COMPLETADA (26-jul-2026)

> **Resultado:** `dist/index.html` pasó de 7,8 KB con el cuerpo vacío a 48,5 KB con
> la página completa. T1.4 (el riesgo principal) se verificó y no se materializó:
> los hashes de assets del build SSR coinciden con los del cliente, así que no hizo
> falta el plan B con Playwright. Detalle de la implementación al final de la fase.

### Problema

`dist/index.html` pesa 7,8 KB y su `<body>` es exactamente:

```html
<body>
  <div id="root"></div>
</body>
```

Googlebot sí ejecuta JavaScript, pero lo hace en una segunda pasada diferida y con
menos confianza en el resultado. El resto de rastreadores no:

- **Bingbot** renderiza JS de forma limitada e inconsistente.
- **GPTBot, PerplexityBot, ClaudeBot, Amazonbot** no ejecutan JS. Hoy una parte
  creciente de "¿cómo saco el Mejoravit en efectivo?" se responde en un asistente,
  y ahí el sitio literalmente no existe.
- **LinkedIn / WhatsApp** al compartir sólo leen las meta del `<head>` — eso ya
  funciona bien, pero el cuerpo no.

Es la tarea con mejor relación esfuerzo/impacto del plan.

### Enfoque elegido

Prerender en tiempo de build mediante un **segundo build en modo SSR** cuyo HTML se
inyecta en el `index.html` del build de cliente. No se añade servidor ni se cambia
el modelo de despliegue: sigue siendo un sitio estático en Vercel.

Se descarta `vite-react-ssg` (obliga a reestructurar la app alrededor de su router) y
el prerender con navegador headless (arrastra Chromium al build de Vercel) — este
último queda como plan B documentado en T1.6.

### T1.1 · Punto de entrada de servidor

**Archivo nuevo:** `src/entry-server.jsx`

```jsx
import { StrictMode } from "react"
import { renderToString } from "react-dom/server"
import App from "./App.jsx"

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
```

### T1.2 · Hidratar en lugar de montar

**Archivo:** `src/main.jsx` — cambiar `createRoot(...).render(...)` por `hydrateRoot(...)`.

**Corrección descubierta al implementar:** no se puede hidratar incondicionalmente.
En `npm run dev` no hay prerender —Vite sirve el `index.html` tal cual, con el div
vacío—, así que `hydrateRoot` sobre un contenedor sin hijos hace que React avise de
un desajuste y vuelva a renderizar todo, ensuciando la consola de desarrollo. La
solución es ramificar según `raiz.hasChildNodes()`: hidratar en producción, montar
desde cero en desarrollo.

**Auditoría de hidratación ya realizada** (para saber qué puede romperse):

| Componente | Riesgo | Veredicto |
|---|---|---|
| `Header.jsx:8-9` | `fijo` y `abierto` arrancan en `false`, se actualizan en `useEffect` | Sin desajuste: el servidor produce el mismo marcado que el primer render del cliente |
| `BotonWhatsApp.jsx:7` | `visible` arranca en `false` | Sin desajuste |
| `Solicitud.jsx:20` | Estado del formulario inicial constante | Sin desajuste |
| `Footer.jsx:66` | `new Date().getFullYear()` | Desajuste **sólo** si el build ocurre el 31 de diciembre y el usuario carga el 1 de enero. Mitigar congelando el año en build o aceptarlo |
| `Analytics` / `SpeedInsights` | Componentes de Vercel | Verificar que renderizan `null` en servidor; si fallan, montarlos tras `useEffect` |

### T1.3 · Script de prerender

**Archivo nuevo:** `scripts/prerender.mjs`

Lógica: importar `dist-ssr/entry-server.js`, leer `dist/index.html`, sustituir
`<div id="root"></div>` por `<div id="root">${html}</div>` y reescribir el archivo.

**Archivo:** `package.json` — el script `build` pasa a ser:

```
vite build && vite build --ssr src/entry-server.jsx --outDir dist-ssr && node scripts/prerender.mjs
```

El bundle de servidor se emite en `dist-ssr/`, **fuera** del directorio de salida que
Vercel publica (`dist/`). Así el artefacto intermedio nunca llega a producción y no
hace falta acordarse de borrarlo. `.gitignore` ya contempla `dist-ssr`.

### T1.4 · Verificar que las URLs de los assets coinciden

**Este es el punto delicado de la fase.** El build SSR genera sus propias referencias
a los assets importados (`familia-380.webp`, `logo-csip.webp`). Vite calcula el hash
de los assets estáticos a partir del contenido, así que *deberían* coincidir con los
del build de cliente — pero hay que comprobarlo, no asumirlo.

Comprobación:

```bash
npm run build
grep -o '/assets/[a-zA-Z0-9._-]*\.webp' dist/index.html | sort -u | \
  while read f; do [ -f "dist$f" ] || echo "ROTO: $f"; done
```

**Criterio de aceptación:** el comando no imprime nada.

### T1.5 · Validación de la fase

```bash
npm run build
grep -c "Crédito Mejoravit" dist/index.html      # > 0
grep -c "hero__titulo" dist/index.html           # > 0
grep -c "Dudas frecuentes" dist/index.html       # > 0
```

Y en el navegador, con JavaScript desactivado, la página debe verse completa y
legible. Después, en Search Console → *Inspección de URL → Ver página rastreada*,
el HTML debe contener el texto.

### T1.6 · Plan B (sólo si T1.4 falla)

Prerender con Playwright contra `vite preview`: se levanta el preview, se navega, se
espera a `networkidle` y se serializa `document.documentElement.outerHTML`. Es
infalible porque ejecuta el bundle real, pero añade ~120 MB de Chromium al build.

**No fue necesario:** T1.4 pasó a la primera. Se deja documentado por si un cambio
futuro en Vite altera el cálculo de hashes.

### T1.7 · Resultado de la implementación

**Archivos nuevos:** `src/entry-server.jsx`, `scripts/prerender.mjs`.
**Modificados:** `src/main.jsx`, `package.json`, `vite.config.js`.

Cambios no previstos en el plan original, ambos justificados:

1. **`vite.config.js` — el plugin `seo()` se salta `generateBundle` en el build SSR.**
   Sin esto emitía `robots.txt` y `sitemap.xml` también en `dist-ssr/`, donde no
   sirven para nada. Se detecta con `configResolved` leyendo `config.build.ssr`.
2. **`package.json` — se añadió `engines: { node: "22.x" }`.** Además de fijar la
   versión en Vercel, documenta un requisito real: Vite 8 no arranca en Node 18, y
   en esta máquina el Node por defecto fuera de la shell interactiva es el 18.14.1.

**Verificaciones ejecutadas y superadas:**

| Comprobación | Resultado |
|---|---|
| Los 11 assets referenciados en el HTML existen en `dist/` | ok |
| `<div id="root"></div>` vacío ya no aparece | ok |
| Contenido presente: H1, FAQ, pasos, requisitos, disclaimer | ok |
| `dist/server` no existe; `dist-ssr` queda fuera de lo publicado | ok |
| `dist-ssr` no contiene `robots.txt` ni `sitemap.xml` | ok |
| Marcado SSR = primer render del cliente (`header--fijo`, `header__nav--abierto`, `flotante--visible` ausentes; `tabindex="-1"`, `aria-expanded="false"` presentes) | ok |
| Año del footer coincide con el año en curso | ok |
| `npm run lint` | limpio |

**Pendiente de verificar por una persona:** abrir `npm run preview` en el navegador y
confirmar que la consola no muestra avisos de hidratación. La comprobación estática
del marcado es sólida, pero no sustituye a ver la consola.

**Esfuerzo real Fase 1:** ~2 h.

---

## Fase 2 — Confianza y entidad (E-E-A-T) 🟡 EN CURSO (29-jul-2026)

> **Corrección de secuencia:** el plan ponía la Fase 2 antes de la 3, pero las
> páginas legales son URLs nuevas y hasta ahora el sitio tenía una sola ruta y un
> prerender de una sola página. Hubo que adelantar **T3.1** (enrutado y prerender
> multi-ruta) para poder hacer nada de esta fase. Ya está hecho.
>
> **Hecho:** T3.1, las tres páginas escritas, T2.4 en lo que no depende de datos
> por confirmar, y el enlazado interno desde el pie y el formulario.
> **Bloqueado por datos:** las tres páginas están en borrador (`noindex`, fuera
> del sitemap) hasta que se rellene `src/data/legal.js`. Detalle al final.

El Mejoravit es **YMYL** (*Your Money or Your Life*): Google aplica un estándar de
calidad más alto a las páginas que pueden afectar las finanzas de una persona. Un
sitio financiero sin identidad verificable, sin aviso de privacidad y sin personas
detrás tiene un techo de posicionamiento bajo, por muy bien optimizado que esté.

Además, el sitio **capta datos personales** (nombre, teléfono, estado, situación
laboral en `Solicitud.jsx:17`), lo que obliga a un aviso de privacidad conforme a la
LFPDPPP.

### T2.1 · Aviso de privacidad — `/aviso-de-privacidad`

Contenido mínimo exigido por la LFPDPPP y su Reglamento:

- Identidad y domicilio del responsable (CSIP Servicios Financieros).
- Datos personales recabados: nombre, teléfono, estado, situación laboral.
- Finalidades primarias (atender la solicitud, integrar expediente) y, separadas,
  las secundarias (contacto comercial posterior) con opción de negarse.
- Medios para ejercer derechos ARCO y para revocar el consentimiento, con un correo
  de contacto real.
- Mención de transferencias a terceros si las hay.
- Procedimiento y medio de notificación de cambios al aviso.

Enlazarlo desde el footer y desde `Solicitud.jsx:144`, donde hoy hay un texto genérico
("Al enviar aceptas que un asesor de CSIP te contacte") que debe convertirse en enlace
al aviso completo.

> No soy abogado y este listado no sustituye una revisión legal. El texto debe
> revisarlo alguien con criterio jurídico antes de publicarse.

### T2.2 · Términos y condiciones del servicio — `/terminos`

Qué incluye el servicio de CSIP, qué no, cómo se cobran los honorarios, y el
disclaimer de independencia frente al Infonavit que ya existe en el footer. Reduce
fricción comercial y es señal de legitimidad.

### T2.3 · Quiénes somos — `/nosotros`

Página con: años operando, número de trámites acompañados, ciudad y domicilio,
y **al menos una persona identificable** (nombre, cargo, foto). Para YMYL, el
anonimato es una penalización de facto.

### T2.4 · Completar el JSON-LD de la entidad

**Archivo:** `vite.config.js`, bloque `FinancialService`.

Añadir:

- `address`: `streetAddress` y `postalCode` reales (hoy sólo hay localidad y estado).
- `geo` con `latitude` / `longitude`.
- **`sameAs`**: array con Facebook, Instagram, LinkedIn y WhatsApp Business. Es el
  campo que permite a Google consolidar las menciones dispersas en una sola entidad
  "CSIP". Su ausencia es la carencia más costosa del schema actual.
- `contactPoint` con `contactType: "customer service"`, `availableLanguage: "Spanish"`.
- `foundingDate`.
- `logo` como `ImageObject` con `width`/`height`.

### T2.5 · Reseñas

`aggregateRating` sólo puede añadirse cuando existan reseñas **reales y verificables**
en Google Business Profile. Inventarlas es una violación directa de las políticas de
datos estructurados y expone a una acción manual. Secuencia correcta: T0.3 → pedir
reseñas a clientes atendidos → cuando haya ≥ 10, añadir `aggregateRating` al schema.

### T2.6 · Resultado de la implementación

**Infraestructura (T3.1, adelantada):** `react-router` en modo declarativo,
`src/data/rutas.js` como fuente única (enrutado + prerender + sitemap + `<head>`),
`scripts/prerender.mjs` iterando rutas, `"cleanUrls": true` en `vercel.json`.

**Reorganización del `<head>`:** estaba repartido entre `index.html` (título,
descripción, OG) y `vite.config.js` (canónica, JSON-LD). Con cuatro rutas eso
producía títulos duplicados, así que todo lo que es propio de una página se
generó en `src/seo.js` y lo inyecta el prerender. En `vite.config.js` sólo
quedan las precargas con hash y la imagen social, que sí son comunes.

**Mecanismo de borrador.** Una ruta con datos sin confirmar en `src/data/legal.js`
se construye y se puede revisar, pero se sirve con `noindex, nofollow` y no entra
en el sitemap. El build lo avisa por consola con la lista de campos que faltan.
Publicar un aviso de privacidad con huecos es peor que no tenerlo, y una página de
"quiénes somos" sin nombres no aporta la señal de confianza que la justifica.

**JSON-LD**: los campos sin confirmar se omiten en vez de emitirse vacíos —un
campo vacío Google lo lee como dato de la entidad y lo da por bueno—. Ya se emiten
`logo` como `ImageObject`, `contactPoint` y `address`; `legalName`, `foundingDate`,
`sameAs` y `streetAddress` aparecerán solos al rellenar `legal.js`.
`FAQPage`/`HowTo` quedan sólo en la home y `BreadcrumbList` sólo en las internas.

**Correcciones que exigió el paso a varias páginas:**

- Los anclajes de navegación pasaron de `#credito` a `/#credito`: desde
  `/nosotros` un `#credito` no lleva a ninguna parte.
- `DesplazarArriba`: React Router conserva la posición vertical al cambiar de
  ruta, así que ir a "Quiénes somos" desde media home aterrizaba a media página.
- El enlace de saltar al contenido apuntaba a `#credito`, que no existe fuera de
  la home; ahora apunta a `#contenido` en el `<main>`.

**Datos que faltan** (todos en `src/data/legal.js`):

| Campo | Para qué | Bloquea |
|---|---|---|
| `razonSocial` | Identidad del responsable | Aviso, términos, `legalName` |
| `domicilio` | Exigido por la LFPDPPP | Aviso, términos, `streetAddress` |
| `correoPrivacidad` | Ejercicio de derechos ARCO | Aviso |
| `identidad.desde` | Antigüedad | Nosotros, `foundingDate` |
| `identidad.responsable` | Persona identificable (YMYL) | Nosotros |
| `identidad.redes` | Consolidación de entidad | `sameAs` |

**Pendiente de una persona:** revisión legal del aviso y de los términos antes de
quitarles el `noindex`.

**Esfuerzo Fase 2:** 8–10 h de redacción y maquetación + revisión legal externa.

---

## Fase 3 — Arquitectura multipágina y contenido

Una URL sólo puede posicionar para un grupo estrecho de consultas. Aquí es donde se
construye el volumen.

### T3.1 · Enrutado y prerender de varias rutas

Añadir `react-router` en modo declarativo y extender `scripts/prerender.mjs` para
iterar sobre la lista de rutas, escribiendo `dist/<ruta>/index.html` en cada caso.
El sitemap pasa a generarse desde esa misma lista en `vite.config.js`, de modo que
una ruta nueva se propaga sola a sitemap, prerender y navegación.

Añadir `"cleanUrls": true` a `vercel.json` para servir `/nosotros` sin `.html`.

**Decisión de diseño:** la lista de rutas vive en `src/data/rutas.js` y es la única
fuente de verdad, igual que `sitio.url` lo es hoy para el dominio.

### T3.2 · Mapa de contenidos

Ordenado por relación volumen/dificultad. La cabecera de demanda ("mejoravit") está
dominada por infonavit.org.mx y portales financieros grandes; la oportunidad real
está en la cola larga transaccional e informacional.

| URL | Consulta objetivo | Intención | Extensión | Prioridad |
|---|---|---|---|---|
| `/` (actual) | mejoravit en efectivo | Transaccional | — | Hecha |
| `/cuanto-me-presta-mejoravit` | cuánto me presta el mejoravit | Informacional alta | 1 200 pal. + calculadora | 1 |
| `/requisitos-mejoravit` | requisitos mejoravit 2026 | Informacional | 900 pal. | 2 |
| `/puntos-infonavit` | cómo consultar mis puntos infonavit | Informacional | 1 000 pal. | 3 |
| `/mejoravit-puebla` | crédito mejoravit puebla | Local transaccional | 700 pal. | 4 |
| `/mejoravit-en-efectivo` | mejoravit en efectivo, cómo disponer | Transaccional | 1 000 pal. | 5 |
| `/mejoravit-vs-crediterreno` | diferencia mejoravit crediterreno | Comparativa | 900 pal. | 6 |
| `/nosotros`, `/aviso-de-privacidad`, `/terminos` | marca | Confianza | — | Fase 2 |

Después, una página por estado de los que ya lista `Solicitud.jsx:6-15` (Tlaxcala,
Veracruz, CDMX, Estado de México, Hidalgo, Morelos), **sólo si tienen contenido
diferenciado real**. Seis páginas idénticas con el topónimo cambiado son contenido
duplicado y hacen más daño que bien.

### T3.3 · La calculadora de puntos

De todas las piezas, la de mayor retorno esperado:

- Ataca la consulta con más volumen de intención comercial ("cuánto me prestan").
- Es la única pieza del plan que atrae **enlaces entrantes naturales**, que es lo que
  hoy falta por completo.
- Convierte mejor que un texto: el usuario que ve una cifra escribe por WhatsApp.
- Requiere confirmar la tabla de puntos y montos vigente del Infonavit; hay que
  fecharla visiblemente y revisarla cada semestre.

Relacionado: `montoMaximo` en `src/data/site.js:36` sigue en `null`, con un comentario
que pide confirmar la cifra. Sigue pendiente y el héroe está renunciando a mostrar un
dato que aumenta la tasa de clic.

### T3.4 · Enlazado interno y migas

- Cada página nueva enlaza a la home con anclaje descriptivo y a 2–3 páginas hermanas.
- `BreadcrumbList` en el JSON-LD de cada página interna.
- Migas visibles en las páginas internas (no en la home).

### T3.5 · Ajustar el schema por página

`FAQPage` y `HowTo` deben inyectarse **sólo** en la página a la que corresponden, no
en todas. Añadir `Article` con `datePublished` / `dateModified` / `author` en las
páginas de contenido.

> Nota de expectativas: Google retiró los resultados enriquecidos de `HowTo` en 2023
> y restringió los de `FAQPage` a sitios gubernamentales y de salud. Mantenerlos es
> correcto —los motores de IA sí los aprovechan— pero **no** hay que esperar
> acordeones ni pasos ilustrados en la SERP.

**Esfuerzo Fase 3:** 6 h de infraestructura (T3.1) + 4–6 h por página de contenido.
Es la fase más larga y conviene ejecutarla de forma incremental, una página por semana.

---

## Fase 4 — Medición de conversión y fugas

### T4.1 · Eventos de conversión

Instrumentar con `track()` de `@vercel/analytics`:

| Evento | Dónde |
|---|---|
| `whatsapp_click` (con propiedad `origen`) | `Hero.jsx:33`, `Hero.jsx:48`, `Header.jsx`, `Footer.jsx`, `CtaFinal.jsx`, `BotonWhatsApp.jsx` |
| `formulario_enviado` | `Solicitud.jsx:36` |
| `formulario_error` (con el campo que falló) | `Solicitud.jsx:32` |

Sin esto no se puede saber qué página genera conversaciones y cuál sólo genera visitas.

### T4.2 · Corregir la apertura de WhatsApp desde el formulario

`Solicitud.jsx:47` usa `window.open(...)`. En Safari iOS y en varios navegadores
integrados (el de Facebook, el de Instagram) el bloqueador de ventanas emergentes
puede cancelarla **aunque venga de un clic**, y el usuario se queda sin
retroalimentación: cree que envió el formulario y no pasó nada.

Corrección: usar `window.location.href = url`, o construir un `<a>` con `href` real y
dejar que el submit sólo valide. Es una fuga de conversión directa.

### T4.3 · Estados de error del formulario

Hoy `validar()` (`Solicitud.jsx:28`) no valida el teléfono, y el campo `telefono` de
`inicial` (`Solicitud.jsx:17`) ni siquiera se renderiza — está declarado en el estado
pero no hay input. O se añade el campo o se elimina del estado.

**Esfuerzo Fase 4:** 3 h.

---

## Fase 5 — Fuera del sitio y mantenimiento

### T5.1 · Citas NAP
Alta en directorios mexicanos con **nombre, dirección y teléfono idénticos** a los de
GBP y del JSON-LD: Google Business Profile, Bing Places, Apple Business Connect,
Waze, Sección Amarilla, Cylex. La inconsistencia entre citas es lo que más diluye la
señal local.

### T5.2 · Perfiles sociales
Crear/reclamar Facebook, Instagram y LinkedIn de empresa, enlazarlos desde el footer
y meterlos en `sameAs` (T2.4). No hace falta publicar a diario; hace falta que existan
y sean coherentes.

### T5.3 · Rastreadores de IA
- Declarar explícitamente en `robots.txt` el permiso a `GPTBot`, `PerplexityBot`,
  `ClaudeBot`, `Google-Extended` y `Applebot-Extended` (hoy quedan cubiertos por el
  `User-agent: *`, pero la declaración explícita evita ambigüedad).
- Publicar `/llms.txt` con un resumen del sitio y enlaces a las páginas clave.
- Precondición: la Fase 1. Sin prerender, estos rastreadores no ven nada aunque se
  les permita el paso.

### T5.4 · Mantenimiento recurrente

| Cadencia | Tarea |
|---|---|
| Semanal | Revisar consultas nuevas en Search Console; anotar las que no tienen página propia |
| Mensual | Revisar Cobertura/Páginas por errores de indexación; pedir 2–3 reseñas |
| Trimestral | Actualizar `dateModified` de las páginas revisadas; validar el JSON-LD |
| Semestral | Revisar montos, puntos y requisitos del Infonavit en toda la web |

### T5.5 · Corregir `lastmod` del sitemap

`vite.config.js` fija `lastmod` con `new Date()` en cada build, así que la fecha cambia
en cada despliegue aunque el contenido sea idéntico. Un `lastmod` que siempre miente
deja de ser una señal útil para el rastreador. Derivarlo del último commit que tocó el
contenido de cada ruta (`git log -1 --format=%cs -- <archivo>`).

---

## Cronograma sugerido

| Semana | Contenido |
|---|---|
| 1 | Fase 0 completa. T1.1–T1.5 (prerender). T4.2 (fuga de WhatsApp) |
| 2 | Fase 2: aviso de privacidad, términos, nosotros, schema completo |
| 3 | T3.1 (infraestructura multipágina) + T4.1 (eventos) + T5.5 |
| 4 | `/cuanto-me-presta-mejoravit` con calculadora |
| 5 | `/requisitos-mejoravit` |
| 6 | `/puntos-infonavit` + T5.1/T5.2 (NAP y sociales) |
| 7 | `/mejoravit-puebla` + T5.3 (llms.txt) |
| 8 | `/mejoravit-en-efectivo` + primera revisión de datos en Search Console |
| 9+ | Cadencia de una página por semana guiada por las consultas reales de GSC |

A partir de la semana 8 el plan deja de ser una lista fija: las consultas que aparezcan
en Search Console deben dictar qué se escribe después. Es información que hoy no
tenemos y que sólo empieza a acumularse cuando se cierra la Fase 0.

---

## Riesgos y decisiones abiertas

| Riesgo / decisión | Impacto | Mitigación |
|---|---|---|
| Los hashes de assets del build SSR no coinciden con los del cliente | Imágenes rotas en producción | T1.4 verifica antes de desplegar; T1.6 es el plan B |
| GBP exige domicilio físico verificable | Sin ficha no hay SEO local | Decidir entre publicar domicilio o negocio de área de servicio |
| El aviso de privacidad sin revisión legal | Riesgo regulatorio, no sólo de SEO | Revisión por abogado antes de publicar |
| Tabla de puntos/montos del Infonavit desactualizada | Pérdida de confianza y de posiciones | Fechar visiblemente y revisar cada semestre (T5.4) |
| Páginas por estado casi idénticas | Contenido duplicado, efecto negativo | Sólo publicar las que tengan contenido diferenciado real |
| Reseñas estructuradas sin reseñas reales | Acción manual de Google | T2.5: primero las reseñas, después el schema |
| `montoMaximo` sigue en `null` | El héroe pierde su dato más persuasivo | Confirmar la cifra vigente con el equipo |

---

## Orden de ataque si hubiera que elegir sólo tres cosas

1. **Fase 0** — sin medición, todo lo demás es a ciegas. 3 horas.
2. **Fase 1** — el sitio existe para los rastreadores. 4–6 horas.
3. **T3.3, la calculadora de puntos** — la única pieza que atrae enlaces y convierte.
