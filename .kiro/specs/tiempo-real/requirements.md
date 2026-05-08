# Requisitos — Tiempo Real

## Objetivo
Proveer una capa de comunicación en tiempo real que sincronice el feed y los comentarios entre todos los usuarios conectados, haciendo que la experiencia se sienta viva e instantánea.

## Funcionalidades

### Conexión WebSocket
- La app establece una conexión WebSocket al autenticarse
- La conexión se mantiene activa mientras el usuario usa la app
- Si la conexión se pierde, se reintenta automáticamente con backoff exponencial
- El usuario no percibe interrupciones en la experiencia durante reconexiones

### Notificaciones de nuevas publicaciones
- Cuando el cron job genera nuevas publicaciones, todos los usuarios conectados reciben una notificación
- La notificación muestra cuántas publicaciones nuevas están disponibles
- El usuario puede tocar la notificación para cargar el contenido nuevo

### Sincronización de comentarios
- Cuando un usuario publica un comentario, todos los usuarios viendo la misma publicación lo ven aparecer en tiempo real
- Cuando un usuario elimina un comentario, desaparece en tiempo real para todos los que lo están viendo
- La sincronización aplica tanto a comentarios raíz como a respuestas

### Indicador de conexión
- La app muestra un indicador sutil cuando la conexión WebSocket está activa
- Si la conexión se pierde, se muestra un aviso de "sin conexión" y se intenta reconectar

## Comportamiento esperado
- La latencia de los eventos en tiempo real debe ser menor a 500ms en condiciones normales
- Los eventos propios (comentarios del usuario actual) no se duplican en la UI
- Si el usuario no está en la pantalla relevante, el evento se encola para cuando regrese
- La reconexión automática no requiere intervención del usuario

## Reglas de negocio
- Solo usuarios autenticados pueden conectarse al WebSocket
- El token JWT se usa para autenticar la conexión WebSocket
- Cada usuario se suscribe automáticamente al canal global de publicaciones
- Cada usuario se suscribe al canal de comentarios de la publicación que está viendo actualmente
- Al salir de una pantalla de detalle, el usuario se desuscribe del canal de comentarios
