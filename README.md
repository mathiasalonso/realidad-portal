# realidad-portal

Sitio público. Es lo único que ve alguien que entra sin cuenta.

## Pantallas

Diseñadas y aprobadas:
- Portada
- Análisis (vista de lectura)
- Portada en celular (390px)

Implementadas y sirviendo contenido real del backend:
- `/` portada
- `/analisis/[slug]` análisis, con render de los ocho tipos de bloque
- `/temas` y `/temas/[slug]` vista por tema
- `/datos` y `/datos/[slug]` ficha de dataset con sus versiones
- `/metodo` metodología

Pendientes:
- Archivo completo con buscador y filtros
- Objeciones abiertas como página propia
- Resultados de búsqueda (el botón de la lupa todavía no hace nada)
- Servir los archivos de los datasets: hoy el botón de descarga registra la
  métrica pero no baja ningún archivo

## Requisitos que condicionan el código

- **SEO y velocidad importan**: el portal es la puerta de entrada y buena parte del tráfico va a llegar de búsqueda. Las páginas de análisis se generan estáticamente y se revalidan al publicar.
- **Más del 61% del tráfico llega por celular.** Se diseña y prueba primero a 390px.
- **Cada figura lleva fuente citada, enlace a la tabla y descarga del CSV.** No es un adorno: es lo que distingue el portal de un blog de opinión.
- **Sin rastreadores de terceros.** La medición de lectura la hace el backend propio.
- Patrones de lectura con respaldo empírico que el código debe conservar: barra de progreso de lectura, un subtítulo cada dos párrafos, suscripción a mitad de nota y tres análisis relacionados al final.

## Identidad visual

Tomada del sitio de la Facultad Politécnica (pol.una.py):

| Uso | Color |
|---|---|
| Azul institucional (marcas de gráficos, tintes, texto grande) | `#357CBD` |
| Acciones y enlaces de texto | `#1B6BB8` |
| Azul oscuro (títulos, bandas) | `#14508C` |
| Banda oscura de contraste | `#0B2740` |
| Fondo de página | `#F4F7FB` |
| Tinta | `#0F1720` |
| Texto secundario | `#64727F` |
| Bordes | `#E6EDF4` |

El `#357CBD` **no se usa para texto chico sobre blanco**: da 4.4:1 y no llega al mínimo de accesibilidad. Para eso va `#1B6BB8` (5.5:1).

Tipografías: **Lato** (cuerpo) y **Titillium Web** (etiquetas) son las de la facultad; **Plus Jakarta Sans** se suma para titulares.

Paleta de gráficos, validada para daltonismo y contraste: `#357CBD`, `#D2691E`, `#0F9B8E`.

## Cómo consume los datos

`lib/api.ts` es el único punto que habla con el backend. Dos decisiones:

- **`revalidate` por página** (60s en la portada y los análisis, 300s en datos):
  el portal se sirve estático y se regenera solo, así que es rápido sin quedar
  desactualizado más de un minuto después de publicar.
- **`pedirONull` en lugar de lanzar error**: si el backend está caído, la portada
  se dibuja sin la franja de indicadores en vez de mostrar una pantalla de error.
  Una sección faltante es mejor que un portal roto.

## Medición de lectura

`components/ProgresoLectura.tsx` hace las dos cosas a la vez: dibuja la barra de
progreso y, al ocultarse la pestaña, manda la profundidad y los segundos al
backend con `sendBeacon`. Descarta lecturas de menos de 3 segundos, que son
rebotes y solo ensucian el promedio.

Usa `visibilitychange` y no `beforeunload`, que no es confiable en el celular.
