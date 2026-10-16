# Estudia Ingeniería UdeA — sitio de la feria

Sitio web estático (HTML, CSS y JavaScript, sin servidor ni base de datos).
Funciona abriendo `index.html` en el navegador o publicándolo en cualquier hosting de páginas estáticas.

## Qué archivo editar

| Quiero cambiar…                                              | Archivo                         |
|--------------------------------------------------------------|---------------------------------|
| Precio, fechas, textos o enlace de preinscripción de AVA     | `datos/ava.js`                  |
| Un pregrado (descripción, sedes, SNIES, malla, documentos)   | `datos/pregrados.js`            |
| Un posgrado, o las fechas y costos de inscripción a posgrados | `datos/posgrados.js`            |
| Tarjetas del portafolio y redes sociales                     | `datos/portafolio.js`           |
| Preguntas de la prueba diagnóstica                           | `datos/prueba-diagnostica.js`   |
| Título y textos de la portada, tiempo de reinicio del kiosco | `datos/sitio.js`                |
| Enlaces generales de la Facultad                             | `datos/enlaces.js`              |
| Colores y tipografía de la marca                             | `css/marca.css`                 |
| Diseño de los componentes                                    | `css/estilos.css`               |
| Estructura de las secciones                                  | `index.html`                    |
| Funcionamiento (navegación, QR, filtros, prueba)             | `js/app.js`                     |

Las cifras de la portada (número de pregrados y posgrados) y el número de preguntas se calculan solos a partir de los datos.

## Reglas para editar los archivos de `datos/`

- Los textos van entre comillas simples: `'Así'`. Si el texto lleva un apóstrofo, escríbalo como `\'`.
- Cada elemento de una lista termina en coma, menos el último.
- Después de guardar, recargue la página. Si una sección queda en blanco, revise que no falte una coma, una comilla o un corchete en el último cambio.

## Imágenes

Están en `img/`. Para un ícono nuevo, use un PNG blanco con fondo transparente y llámelo por su nombre sin `.png` (por ejemplo `icono:'i-lupa'`).

## Fuentes de los datos

Programas, planes de estudio y enlaces verificados en udea.edu.co el 8 de octubre de 2026.
Las preguntas de la prueba diagnóstica son de práctica, no son preguntas oficiales del examen de admisión.

Librería de códigos QR: qrcodejs (licencia MIT, ver `js/vendor/qrcode-LICENSE.txt`).
