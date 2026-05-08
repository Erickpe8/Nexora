# Requisitos — Notificaciones

## Objetivo
Informar a los usuarios en tiempo real sobre actividad relevante en la plataforma, como nuevas respuestas a sus comentarios y actividad en publicaciones que siguen.

## Funcionalidades

### Recibir notificaciones en tiempo real
- El usuario recibe notificaciones instantáneas sin necesidad de recargar la app
- Las notificaciones llegan a través de WebSocket mientras el usuario está conectado
- Si el usuario no está conectado, las notificaciones se almacenan y se entregan al reconectarse

### Tipos de notificaciones
- **Nueva respuesta**: cuando alguien responde a un comentario del usuario
- **Actividad en publicación**: cuando hay nuevos comentarios en una publicación donde el usuario ha participado

### Estados leído / no leído
- Cada notificación tiene un estado: leída o no leída
- Las notificaciones no leídas se destacan visualmente en la lista
- El usuario puede marcar una notificación como leída al tocarla
- El usuario puede marcar todas las notificaciones como leídas con un solo botón

### Badge de notificaciones
- El ícono de notificaciones en la navegación muestra un badge con el conteo de no leídas
- El badge desaparece cuando todas las notificaciones están leídas
- El conteo se actualiza en tiempo real al recibir nuevas notificaciones

### Lista de notificaciones
- El usuario puede ver todas sus notificaciones en una pantalla dedicada
- Las notificaciones se ordenan por fecha (más recientes primero)
- Cada notificación muestra: tipo, descripción, fecha y estado leído/no leído
- Al tocar una notificación, navega a la publicación o comentario relacionado

## Comportamiento esperado
- Las notificaciones llegan en menos de 1 segundo desde que ocurre el evento
- El badge se actualiza inmediatamente al recibir una nueva notificación
- Al navegar desde una notificación, esta se marca automáticamente como leída
- Si no hay notificaciones, se muestra un mensaje amigable

## Reglas de negocio
- Solo usuarios autenticados reciben notificaciones
- Un usuario no recibe notificaciones de su propia actividad
- Las notificaciones se conservan por un máximo de 30 días
- El máximo de notificaciones mostradas en la lista es 50 (las más recientes)
- No se envían notificaciones push en esta versión (solo en-app)
