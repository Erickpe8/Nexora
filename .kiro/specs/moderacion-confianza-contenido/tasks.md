# Tareas de Implementación — Moderación y Confianza de Contenido

## Base de datos

- [ ] Crear tabla `denuncias` con índices por objetivo y fecha.
- [ ] Extender tabla `comentarios` con campos de moderación (migración incremental).

## Backend

- [ ] Rutas y controlador de denuncias bajo convención REST del proyecto.
- [ ] Servicio `servicioDenuncias` con deduplicación y validación de motivos.
- [ ] Integración Socket.IO para eventos de visibilidad.
- [ ] Tests de regresión con `.kiro/specs/comentarios` (no romper DELETE/soft-delete).

## Mobile

- [ ] UI de denuncia en detalle de publicación.
- [ ] Servicio HTTP dedicado y tipos TypeScript.
- [ ] Manejo de eventos socket de ocultamiento en hook de comentarios existente o adjunto.

## Operación

- [ ] Documentar procedimiento manual hasta existir panel moderador.
