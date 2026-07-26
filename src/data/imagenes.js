/**
 * El atributo `sizes` del héroe vive aquí porque lo necesitan dos sitios: el
 * componente Hero y el plugin de vite.config.js, que genera la precarga.
 *
 * Si la precarga y la etiqueta <img> no declaran exactamente el mismo `sizes`,
 * el navegador puede elegir candidatos distintos y acabar descargando las dos
 * versiones de la imagen.
 */
export const heroeSizes = "(max-width: 480px) 92vw, (max-width: 900px) 420px, 515px"
