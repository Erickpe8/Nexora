# Tareas de Implementación — Moderación y Confianza de Contenido

## Base de datos

- [x] Crear tabla `denuncias` con índices por objetivo y fecha.
- [x] Extender tabla `comentarios` con campos de moderación (`estado_moderacion`, `oculto_en`, `moderador_id`, `nota_interna`).

## Backend

- [x] Rutas bajo convención REST del proyecto:
  - `POST /api/comentarios/:id/denuncias`
  - `GET /api/moderacion/denuncias`
  - `PATCH /api/moderacion/comentarios/:id`
- [x] Servicio `servicioDenuncias` con deduplicación (ventana 24h) y validación de motivos.
- [x] Servicio `servicioModeracion` con transacción DB + emisión Socket.
- [x] Integración Socket.IO para eventos `comentario_oculto` / `comentario_restaurado`.
- [x] Middleware `requiereModerador` con control por `MODERADOR_IDS` en env.
- [x] Auto-ocultar por umbral configurable (`MODERACION_UMBRAL_DENUNCIAS`, `MODERACION_AUTO_OCULTAR`).

## Mobile

- [x] Tipo `Comentario` extendido con `estadoModeracion`.
- [x] `servicioModeracion.ts` con método `denunciarComentario`.
- [x] Hook `useDenuncias` con estado de envío, confirmación y errores.
- [x] Componente `ModalDenuncia` (bottom sheet, selección de motivo + detalle opcional).
- [x] `TarjetaComentario` con botón "Denunciar" y placeholder para comentarios ocultos.
- [x] `useComentariosEnTiempoReal` escucha `comentario_oculto` y `comentario_restaurado`.
- [x] `useComentarios` con `ocultarDesdeTiempoReal` y `restaurarDesdeTiempoReal`.

## Operación

- [ ] Documentar procedimiento manual hasta existir panel moderador (pendiente doc ops).
