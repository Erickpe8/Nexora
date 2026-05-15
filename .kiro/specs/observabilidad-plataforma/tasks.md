# Tareas de Implementación — Observabilidad de Plataforma

## Fundamentos

- [ ] Utilidad `logger` con salida JSON y niveles.
- [ ] Middleware de correlación y registro de duración en Express.

## Salud

- [ ] Implementar rutas `listo` / `vivo` (o nombres finales unificados en español según convención del equipo).
- [ ] Integrar chequeo MySQL opcional con timeout corto.

## IA y cron

- [ ] Añadir `ejecucionId` y métricas agregadas al job de generación.
- [ ] Log de errores DeepSeek categorizados (red, 4xx, 5xx, parseo).

## Sockets

- [ ] Logs en fallo de autenticación JWT en handshake.
- [ ] Contador opcional de sockets conectados.

## Calidad

- [ ] Guía breve en steering o comentario de equipo: campos permitidos en logs.
- [ ] Script o regla de CI que falle si se detectan `console.log` crudos en rutas críticas (opcional).
