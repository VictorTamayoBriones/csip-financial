# CSIP · Landing page

Landing page de CSIP Servicios Financieros para el producto **Crédito Mejoravit en
efectivo**. React + Vite, sin dependencias de UI: todo el estilo es CSS propio.

## Comandos

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run preview  # previsualizar el build
npm run lint     # eslint
```

## Qué editar

Casi todo el contenido variable vive en **`src/data/site.js`**: teléfono, correo,
horario, beneficios, pasos del proceso, requisitos y preguntas frecuentes. Cambiar
ahí actualiza toda la página (héroe, formulario, pie y enlaces de WhatsApp).

Pendientes marcados en ese archivo:

- `sitio.url` — **debe cambiarse por el dominio real antes de publicar.** De ahí
  salen la etiqueta canónica, las Open Graph, el JSON-LD, el sitemap y el robots.
- `empresa.correo` — está puesto `contacto@csip.mx` como provisional.
- `montoMaximo` — está en `null`. Al asignarle una cifra (p. ej. `"$118,000"`) se
  muestra automáticamente en el héroe.

## SEO

Las etiquetas fijas (título, descripción, robots, Open Graph sin URL, Twitter,
iconos) están en `index.html`. Todo lo que depende del dominio lo genera el plugin
`seo()` de `vite.config.js` en cada build:

- `<link rel="canonical">`, `og:url`, `og:image` (con alto, ancho y texto
  alternativo) y `twitter:image`.
- JSON-LD con cuatro bloques: `FinancialService` (datos de la empresa, teléfono,
  horario y el crédito que ofrece), `WebSite`, `FAQPage` (generado desde
  `preguntas`, elegible para resultados enriquecidos) y `HowTo` (los cuatro pasos
  del proceso).
- `dist/robots.txt` y `dist/sitemap.xml`.

Como el JSON-LD se genera desde `src/data/site.js`, editar una pregunta frecuente
actualiza a la vez la sección visible y los datos estructurados: no se desincronizan.

La imagen para compartir en redes (`public/og-image.jpg`, 1200×630) se genera a
partir de `tools/og-card.html`. Para regenerarla: abre `http://localhost:5173/tools/og-card.html`
con el servidor de desarrollo y captura la página a 1200×630.

## Línea de diseño

Los colores se muestrearon del logotipo: azul `#1F3391`, verde `#046B08`, negro y
fondo crema `#F7F7F1`. Tipografías: Playfair Display para títulos, Inter para texto.

El patrón de rombos de la marca se recreó como SVG vectorial en `public/pattern.svg`
y se aplica con `mask-image` (clase `.patron`), de modo que se puede teñir de
cualquier color y escalar sin perder nitidez.

## Rendimiento y cabeceras

Las tipografías están **autohospedadas** en `src/assets/fonts/` con sus `@font-face`
al inicio de `src/index.css`. Antes se pedían a Google Fonts, lo que encadenaba dos
dominios externos antes de pintar texto. Son fuentes variables: un archivo por
familia cubre todos los pesos. El plugin de `vite.config.js` inyecta la precarga de
las tres, más la de la imagen del héroe, usando el nombre con hash del build.

`vercel.json` define:

- **CSP y cabeceras de seguridad** en todas las rutas. La CSP es estricta
  (`default-src 'self'`); sólo abre `script-src`/`connect-src` a los dominios de
  Vercel Analytics. Verificada sin violaciones sobre el build real.
- **Caché inmutable de un año para `/assets/*`**. Vite pone hash de contenido en
  esos nombres, así que un cambio genera un archivo nuevo. Por defecto Vercel los
  servía con `max-age=0, must-revalidate`, lo que obligaba a revalidar todo en
  cada visita recurrente.
- **Caché de un día** para los archivos sin hash (`og-image.jpg`, iconos, patrón).

Ojo: Vercel valida `vercel.json` contra un esquema estricto. No admite claves
propias como `comment` dentro de las reglas; el despliegue falla.

## Estructura

```
src/
  data/site.js        contenido y configuración
  components/         un .jsx + .css por sección
  index.css           tokens de marca, reset y utilidades
public/
  pattern.svg         patrón de marca (usado como máscara)
  favicon.svg         logotipo simplificado
```
