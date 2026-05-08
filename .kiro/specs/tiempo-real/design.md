# Diseño Técnico — Tiempo Real

## Arquitectura general

La capa de tiempo real usa Socket.IO sobre WebSockets. El servidor gestiona salas (rooms) por publicación y un canal global para el feed. El cliente mantiene una única conexión persistente durante la sesión.

## Componentes frontend

### Servicios
- `servicioSocket` — singleton que gestiona la conexión Socket.IO, autenticación y reconexión

### Hooks
- `useSocket` — expone el estado de conexión y el cliente Socket.IO
- `usePublicacionesNuevas` — suscripción al canal global de nuevas publicaciones (usado en `PantallaFeed`)
- `useComentariosEnTiempoReal` — suscripción al canal de una publicación específica (usado en `PantallaDetalle`)

### Contexto
- `ContextoSocket` — provee el cliente Socket.IO a toda la app sin prop drilling

## Flujo técnico

### Establecer conexión
1. Al autenticarse, `servicioSocket.conectar(token)` inicializa Socket.IO con el token en el handshake
2. El servidor valida el token en el middleware de Socket.IO
3. Si es válido, el socket se une automáticamente a la sala `feed_global`
4. `ContextoSocket` provee el socket a los hooks que lo necesiten

### Reconexión automática
1. Socket.IO maneja la reconexión automáticamente con su configuración nativa
2. Se configura `reconnectionDelay: 1000` y `reconnectionDelayMax: 10000`
3. Al reconectar, el socket se vuelve a unir a las salas correspondientes

### Canal global — nuevas publicaciones
- Sala: `feed_global`
- Evento: `nuevas_publicaciones`
- Payload: `{ cantidad: number, publicaciones: Publicacion[] }`
- Todos los usuarios autenticados están en esta sala

### Canal por publicación — comentarios
- Sala: `comentarios:{publicacionId}`
- Eventos: `nuevo_comentario`, `comentario_eliminado`
- El cliente se une al entrar a `PantallaDetalle` y se sale al salir

### Evitar duplicados
- Los eventos emitidos por el propio usuario se ignoran en el cliente
- El servidor incluye `socketId` del emisor en el payload
- El hook compara con el `socketId` local antes de actualizar el estado

## Configuración del servidor (Socket.IO)

```typescript
// Middleware de autenticación
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  const usuario = verificarJWT(token)
  if (!usuario) return next(new Error('No autorizado'))
  socket.data.usuario = usuario
  next()
})

// Al conectar
io.on('connection', (socket) => {
  socket.join('feed_global')

  socket.on('unirse_publicacion', (publicacionId: number) => {
    socket.join(`comentarios:${publicacionId}`)
  })

  socket.on('salir_publicacion', (publicacionId: number) => {
    socket.leave(`comentarios:${publicacionId}`)
  })
})
```

## Tipos TypeScript

```typescript
interface EventoNuevasPublicaciones {
  cantidad: number
  publicaciones: Publicacion[]
}

interface EventoNuevoComentario {
  comentario: Comentario
  socketId: string
}

interface EventoComentarioEliminado {
  id: number
  socketId: string
}

type EstadoConexion = 'conectado' | 'desconectado' | 'reconectando'
```

## Configuración del cliente Socket.IO

```typescript
const socket = io(BASE_URL, {
  auth: { token },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 10000,
  transports: ['websocket'],
})
```
