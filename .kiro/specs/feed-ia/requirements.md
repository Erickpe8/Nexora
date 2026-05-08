# Requisitos — Feed con IA

## Objetivo
Mostrar a los usuarios un feed dinámico de publicaciones generadas automáticamente por IA cada hora, con noticias tecnológicas actuales, resúmenes y preguntas controversiales.

## Funcionalidades

### Visualización del feed
- El usuario autenticado ve una lista de publicaciones ordenadas por fecha de creación (más recientes primero)
- Cada publicación muestra: título, resumen, pregunta controversial, fecha y número de comentarios
- El feed soporta scroll infinito con paginación
- Se muestra un indicador de carga mientras se obtienen las publicaciones

### Generación automática de publicaciones (IA)
- Un cron job se ejecuta cada hora en el backend
- El cron job consulta la DeepSeek API para obtener noticias tecnológicas actuales
- Por cada ejecución se generan entre 3 y 5 publicaciones nuevas
- Cada publicación contiene:
  - Título de la noticia
  - Resumen claro y conciso (máximo 300 palabras)
  - Una pregunta controversial relacionada para incentivar el debate
  - Etiquetas de categoría (ej: IA, programación, hardware, startups)

### Actualización en tiempo real
- Cuando se generan nuevas publicaciones, los usuarios conectados reciben una notificación en el feed
- El usuario puede tocar la notificación para cargar las nuevas publicaciones sin recargar toda la pantalla

### Detalle de publicación
- Al tocar una publicación, el usuario navega a la pantalla de detalle
- La pantalla de detalle muestra el contenido completo y la sección de comentarios

## Comportamiento esperado
- El feed debe cargar en menos de 2 segundos en condiciones normales
- Si no hay publicaciones disponibles, se muestra un mensaje amigable
- Los errores de red se manejan con un mensaje de reintento
- El feed recuerda la posición de scroll al volver desde el detalle

## Reglas de negocio
- Solo la IA puede crear publicaciones, los usuarios no pueden publicar contenido propio
- Las publicaciones generadas por IA se marcan con un indicador visual
- Las publicaciones no se eliminan automáticamente (se mantiene el historial)
- El contenido generado debe ser relevante para tecnología, programación e innovación
