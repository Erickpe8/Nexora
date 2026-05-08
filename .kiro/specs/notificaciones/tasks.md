# Tareas de Implementación — Notificaciones

## Backend

- [ ] Crear tabla `notificaciones` en MySQL con los campos definidos en el diseño
- [ ] Crear función `crearNotificacion(usuarioId, tipo, descripcion, publicacionId, comentarioId?)`
  - [ ] Guardar notificación en MySQL
  - [ ] Emitir evento `nueva_notificacion` al socket del usuario destinatario (room `usuario:{id}`)
- [ ] Integrar generación de notificaciones en el módulo de comentarios
  - [ ] Al crear una respuesta: notificar al autor del comentario padre
  - [ ] Al crear un comentario: notificar a participantes previos de la publicación
  - [ ] Excluir al autor del nuevo comentario de las notificaciones
- [ ] Crear endpoint `GET /api/notificaciones`
  - [ ] Devolver las últimas 50 notificaciones del usuario autenticado
  - [ ] Ordenar por `creado_en` descendente
  - [ ] Proteger con middleware `verificarToken`
- [ ] Crear endpoint `PATCH /api/notificaciones/:id/leida`
  - [ ] Verificar que la notificación pertenece al usuario autenticado
  - [ ] Marcar como leída en MySQL
  - [ ] Proteger con middleware `verificarToken`
- [ ] Crear endpoint `PATCH /api/notificaciones/leer-todas`
  - [ ] Marcar todas las notificaciones del usuario como leídas
  - [ ] Proteger con middleware `verificarToken`
- [ ] Configurar Socket.IO para unir a cada usuario a su room privado `usuario:{id}` al conectarse

## Frontend

- [ ] Crear tipos `Notificacion`, `TipoNotificacion`, `EstadoNotificaciones` en `src/types/`
- [ ] Crear `servicioNotificaciones` en `src/services/`
  - [ ] Método `obtener()`
  - [ ] Método `marcarLeida(id)`
  - [ ] Método `marcarTodasLeidas()`
- [ ] Crear `ContextoNotificaciones` en `src/`
  - [ ] Estado global: `totalNoLeidas`
  - [ ] Métodos: `incrementar()`, `decrementar()`, `resetear()`
  - [ ] Integrar en `App.tsx`
- [ ] Crear hook `useNotificaciones` en `src/hooks/`
  - [ ] Estado: `notificaciones`, `cargando`
  - [ ] Métodos: `cargar()`, `marcarLeida()`, `marcarTodasLeidas()`
  - [ ] Actualizar `ContextoNotificaciones` al marcar como leída
- [ ] Crear hook `useNotificacionesEnTiempoReal` en `src/hooks/`
  - [ ] Suscribirse al evento `nueva_notificacion` del socket
  - [ ] Agregar notificación al estado local
  - [ ] Incrementar conteo en `ContextoNotificaciones`
- [ ] Crear componente `TarjetaNotificacion` en `src/components/`
  - [ ] Mostrar tipo (ícono), descripción, fecha
  - [ ] Fondo diferenciado para notificaciones no leídas
  - [ ] Al tocar: marcar como leída y navegar a la publicación relacionada
- [ ] Crear componente `BadgeNotificaciones` en `src/components/`
  - [ ] Mostrar conteo de no leídas desde `ContextoNotificaciones`
  - [ ] Ocultar si el conteo es 0
- [ ] Crear pantalla `PantallaNotificaciones` en `src/screens/`
  - [ ] Lista de `TarjetaNotificacion`
  - [ ] Botón "Marcar todas como leídas"
  - [ ] Estado vacío si no hay notificaciones
- [ ] Integrar `BadgeNotificaciones` en el tab de notificaciones del `NavegadorPrincipal`

## Pruebas

- [ ] Verificar que al responder un comentario se genera notificación al autor original
- [ ] Verificar que el autor del comentario no recibe notificación de su propia acción
- [ ] Verificar que la notificación llega en tiempo real vía WebSocket
- [ ] Verificar que marcar como leída actualiza el badge correctamente
- [ ] Verificar que "marcar todas como leídas" resetea el badge a 0
- [ ] Verificar que la lista muestra máximo 50 notificaciones
