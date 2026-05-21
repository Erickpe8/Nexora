# Tareas de Implementación — Observabilidad de Plataforma

## Fundamentos

- [x] Utilidad `logger` con salida JSON y niveles (`info`, `advertencia`, `error`, `debug`).
- [x] Middleware de correlación y registro de duración en Express (`middlewares/correlacion.ts`).

## Salud

- [x] Implementar rutas `listo` / `vivo` (`/api/salud/listo`, `/api/salud/vivo`).
- [x] Integrar chequeo MySQL opcional con timeout corto (2000ms).

## IA y cron

- [x] Añadir `ejecucionId` y métricas agregadas al job de generación.
- [x] Log de errores DeepSeek categorizados (red, 4xx, 5xx, parseo).

## Sockets

- [x] Logs en fallo de autenticación JWT en handshake.
- [x] Contador de sockets conectados (`obtenerSocketsConectados()`).

## Calidad

- [x] Sanitización de campos sensibles en logs (lista deny en `registro.ts`).
- [ ] Script o regla de CI que falle si se detectan `console.log` crudos en rutas críticas (opcional, pendiente CI).
