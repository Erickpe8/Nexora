# Menciones + Hashtags (Fase social 2)

## Objetivo

Conectar conversaciones y habilitar **descubrimiento por tema** estilo X: `@usuario` y `#tema` parseados, enlazados, buscables y con notificaciones.

## Dependencias

- Fase 1 **Guardados + Compartir** completada.
- Fundamentos sociales estables (comentarios, notificaciones, perfiles, reacciones, moderación).

## Alcance resumido

| Área | Entregables |
|------|-------------|
| Parser | Regex/tokenizer `@username` y `#tag` en comentarios (y bio futuro) |
| Enlaces | Tap → perfil público / pantalla tema |
| Hashtags | Tabla `hashtags` + `publicacion_hashtags`; extraer de `etiquetas` IA |
| Trending | Job/cron agrega `hashtags.trending_score` |
| Notificaciones | Tipo `mencion` al crear comentario con @ |
| Búsqueda | `GET /api/hashtags/:tag/publicaciones` |
| Mobile | Autocomplete @ al escribir; chips # en detalle; pantalla Tema |

## Fuera de alcance

- Follow de hashtags (Fase 3).
- Threads multi-nivel >1 (mejora aparte).

## API objetivo (borrador)

- `GET /api/hashtags/trending`
- `GET /api/hashtags/:tag`
- `GET /api/usuarios/buscar?q=` (autocomplete @)
- Extender `POST comentarios` → parsear menciones → `crearNotificacion('mencion')`

## Criterio de aceptación

Escribir `@usuario` en un comentario notifica al mencionado; pulsar `#IA` abre feed filtrado por etiqueta; trending visible en sidebar o tab Descubrir.
