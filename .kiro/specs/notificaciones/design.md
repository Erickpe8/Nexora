# Diseño Técnico — Notificaciones

## Arquitectura general

Las notificaciones se almacenan en MySQL y se entregan en tiempo real vía WebSocket. El cliente mantiene el conteo de no leídas en estado global para actualizar el badge de navegación.

## Componentes frontend

### Pantallas
- `PantallaNotificaciones` — lista completa de notificaciones del usuario

### Componentes
- `TarjetaNotificacion` — item individual con tipo, descripción, fecha y estado visual
- `BadgeNotificaciones` — badge numérico sobre el ícono del tab de notificaciones

### Hooks
- `useNotificaciones` — obtiene la lista, maneja lectura y estado global de no leídas
- `useNotificacionesEnTiempoReal` — escucha WebSocket para nuevas notificaciones

### Servicios
- `servicioNotificaciones` — encapsula las llamadas HTTP a la API de notificaciones

### Contexto
- `ContextoNotificaciones` — provee el conteo de no leídas a toda la app (para el badge)

## Flujo técnico

### Recibir notificación en tiempo real
1. El backend emite evento `nueva_notificacion` al socket del usuario destinatario
2. `useNotificacionesEnTiempoReal` recibe el evento y actualiza el estado
3. `ContextoNotificaciones` incrementa el conteo de no leídas
4. El `BadgeNotificaciones` se actualiza automáticamente

### Cargar lista de notificaciones
1. `PantallaNotificaciones` monta y llama a `useNotificaciones.cargar()`
2. GET a `/api/notificaciones` devuelve las últimas 50 notificaciones
3. Se renderiza la lista con `TarjetaNotificacion`

### Marcar como leída
1. Usuario toca una `TarjetaNotificacion`
2. `useNotificaciones.marcarLeida(id)` hace PATCH a `/api/notificaciones/:id/leida`
3. El hook actualiza el estado local y decrementa el conteo global
4. Se navega a la publicación o comentario relacionado

### Marcar todas como leídas
1. Usuario toca "Marcar todas como leídas"
2. PATCH a `/api/notificaciones/leer-todas`
3. El hook actualiza todas las notificaciones a leídas y resetea el conteo a 0

### Generación de notificaciones en el backend
- Al crear un comentario: notificar al autor del comentario padre (si es respuesta)
- Al crear un comentario: notificar a todos los participantes previos de la publicación (excepto el autor del nuevo comentario)
- El backend emite `nueva_notificacion` al socket del usuario destinatario usando su `usuarioId`

## Eventos WebSocket

- Canal: socket privado del usuario (room `usuario:{id}`)
- Evento recibido: `nueva_notificacion`
- Payload: `Notificacion`

## Endpoints del backend

| Método | Ruta                                  | Descripción                              |
|--------|---------------------------------------|------------------------------------------|
| GET    | `/api/notificaciones`                 | Obtener notificaciones del usuario       |
| PATCH  | `/api/notificaciones/:id/leida`       | Marcar una notificación como leída       |
| PATCH  | `/api/notificaciones/leer-todas`      | Marcar todas las notificaciones como leídas |

## Estructura de datos

### Tabla `notificaciones` (MySQL)
```sql
id              INT AUTO_INCREMENT PRIMARY KEY
usuario_id      INT NOT NULL REFERENCES usuarios(id)
tipo            ENUM('nueva_respuesta', 'actividad_publicacion') NOT NULL
descripcion     VARCHAR(255) NOT NULL
publicacion_id  INT REFERENCES publicaciones(id)
comentario_id   INT REFERENCES comentarios(id)
leida           BOOLEAN DEFAULT FALSE
creado_en       DATETIME DEFAULT NOW()
```

### Tipos TypeScript
```typescript
type TipoNotificacion = 'nueva_respuesta' | 'actividad_publicacion'

interface Notificacion {
  id: number
  tipo: TipoNotificacion
  descripcion: string
  publicacionId: number
  comentarioId: number | null
  leida: boolean
  creadoEn: string
}

interface EstadoNotificaciones {
  notificaciones: Notificacion[]
  totalNoLeidas: number
}
```
