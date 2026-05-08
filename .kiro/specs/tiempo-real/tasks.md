# Tareas de Implementación — Tiempo Real

## Backend

- [ ] Instalar y configurar `socket.io` en el servidor Node.js
- [ ] Crear middleware de autenticación para Socket.IO
  - [ ] Extraer token del handshake
  - [ ] Verificar JWT y adjuntar usuario al socket
  - [ ] Rechazar conexiones sin token válido
- [ ] Configurar el evento `connection`
  - [ ] Unir al socket a la sala `feed_global` automáticamente
  - [ ] Manejar evento `unirse_publicacion` para unirse a sala de comentarios
  - [ ] Manejar evento `salir_publicacion` para salir de sala de comentarios
- [ ] Integrar emisión de eventos en el módulo de publicaciones
  - [ ] Emitir `nuevas_publicaciones` a `feed_global` desde el cron job
- [ ] Integrar emisión de eventos en el módulo de comentarios
  - [ ] Emitir `nuevo_comentario` a `comentarios:{publicacionId}` al crear
  - [ ] Emitir `comentario_eliminado` a `comentarios:{publicacionId}` al eliminar
  - [ ] Incluir `socketId` del emisor en el payload

## Frontend

- [ ] Instalar `socket.io-client` en el proyecto React Native
- [ ] Crear `servicioSocket` en `src/services/`
  - [ ] Método `conectar(token)` — inicializa la conexión con autenticación
  - [ ] Método `desconectar()` — cierra la conexión limpiamente
  - [ ] Método `unirsePublicacion(id)` — emite evento al servidor
  - [ ] Método `salirPublicacion(id)` — emite evento al servidor
  - [ ] Patrón singleton para mantener una sola instancia
- [ ] Crear `ContextoSocket` en `src/` con su Provider
  - [ ] Proveer instancia del socket y estado de conexión
  - [ ] Conectar al autenticarse y desconectar al cerrar sesión
- [ ] Crear hook `useSocket` en `src/hooks/`
  - [ ] Exponer: `socket`, `estadoConexion`
- [ ] Crear hook `usePublicacionesNuevas` en `src/hooks/`
  - [ ] Suscribirse al evento `nuevas_publicaciones`
  - [ ] Exponer: `hayNuevas`, `cantidad`, `limpiar()`
- [ ] Crear hook `useComentariosEnTiempoReal` en `src/hooks/`
  - [ ] Unirse a la sala al montar, salir al desmontar
  - [ ] Suscribirse a `nuevo_comentario` y `comentario_eliminado`
  - [ ] Ignorar eventos propios comparando `socketId`
  - [ ] Exponer callbacks `onNuevoComentario` y `onComentarioEliminado`
- [ ] Crear componente `IndicadorConexion` en `src/components/`
  - [ ] Mostrar aviso sutil cuando `estadoConexion` es `desconectado` o `reconectando`
- [ ] Integrar `ContextoSocket` en `App.tsx`
- [ ] Integrar `IndicadorConexion` en el layout principal

## Pruebas

- [ ] Verificar que la conexión WebSocket se establece al autenticarse
- [ ] Verificar que la conexión se rechaza sin token válido
- [ ] Verificar que nuevas publicaciones llegan en tiempo real al feed
- [ ] Verificar que nuevos comentarios aparecen en tiempo real en el detalle
- [ ] Verificar que comentarios eliminados desaparecen en tiempo real
- [ ] Verificar que los eventos propios no se duplican en la UI
- [ ] Verificar que la reconexión automática funciona al perder conexión
