# Diseño Técnico — Comentarios

## Arquitectura general

El módulo de comentarios usa REST para operaciones CRUD y WebSockets para sincronización en tiempo real entre usuarios que ven la misma publicación.

## Componentes frontend

### Componentes
- `ListaComentarios` — lista de comentarios de una publicación
- `TarjetaComentario` — card individual con autor, contenido, fecha y botón de respuesta
- `FormularioComentario` — campo de texto y botón de envío
- `RespuestasComentario` — lista anidada de respuestas bajo un comentario

### Hooks
- `useComentarios` — maneja la lista de comentarios, creación y eliminación
- `useComentariosEnTiempoReal` — escucha WebSocket para nuevos comentarios en la publicación activa

### Servicios
- `servicioComentarios` — encapsula las llamadas HTTP a la API de comentarios

## Flujo técnico

### Cargar comentarios
1. `PantallaDetalle` monta y llama a `useComentarios.cargar(publicacionId)`
2. `servicioComentarios.obtener(publicacionId)` hace GET a `/api/publicaciones/:id/comentarios`
3. El backend devuelve comentarios con sus respuestas anidadas
4. El hook actualiza el estado y renderiza `ListaComentarios`

### Crear comentario
1. Usuario escribe en `FormularioComentario` y toca enviar
2. `useComentarios.crear(contenido, publicacionId)` llama al servicio
3. El servicio hace POST a `/api/publicaciones/:id/comentarios`
4. El backend guarda el comentario y emite evento WebSocket `nuevo_comentario`
5. El hook agrega el comentario al estado local optimistamente
6. El campo de texto se limpia

### Responder a comentario
1. Usuario toca "Responder" en `TarjetaComentario`
2. `FormularioComentario` aparece con el contexto del comentario padre
3. El flujo es igual al de crear comentario pero con `comentarioPadreId` incluido
4. POST a `/api/publicaciones/:id/comentarios` con `comentarioPadreId`

### Eliminar comentario
1. Usuario toca el botón de eliminar en su propio comentario
2. `useComentarios.eliminar(comentarioId)` llama al servicio
3. DELETE a `/api/comentarios/:id`
4. Si tiene respuestas, el backend marca como eliminado (soft delete)
5. El hook actualiza el estado local

### Tiempo real
1. `useComentariosEnTiempoReal` se suscribe al canal `comentarios:{publicacionId}`
2. Al recibir `nuevo_comentario`, agrega el comentario a la lista si no es del usuario actual
3. Al recibir `comentario_eliminado`, actualiza el comentario en la lista

## Endpoints del backend

| Método | Ruta                                    | Descripción                          |
|--------|-----------------------------------------|--------------------------------------|
| GET    | `/api/publicaciones/:id/comentarios`    | Obtener comentarios de una publicación |
| POST   | `/api/publicaciones/:id/comentarios`    | Crear comentario o respuesta         |
| DELETE | `/api/comentarios/:id`                  | Eliminar comentario propio           |

## Estructura de datos

### Tabla `comentarios` (MySQL)
```sql
id                  INT AUTO_INCREMENT PRIMARY KEY
publicacion_id      INT NOT NULL REFERENCES publicaciones(id)
usuario_id          INT NOT NULL REFERENCES usuarios(id)
comentario_padre_id INT REFERENCES comentarios(id)  -- NULL si es raíz
contenido           TEXT NOT NULL
eliminado           BOOLEAN DEFAULT FALSE
creado_en           DATETIME DEFAULT NOW()
```

### Tipos TypeScript
```typescript
interface Comentario {
  id: number
  publicacionId: number
  usuarioId: number
  nombreUsuario: string
  comentarioPadreId: number | null
  contenido: string
  eliminado: boolean
  creadoEn: string
  respuestas: Comentario[]
}

interface NuevoComentario {
  contenido: string
  comentarioPadreId?: number
}
```

## WebSocket
- Canal: `comentarios:{publicacionId}`
- Eventos emitidos:
  - `nuevo_comentario` → payload: `Comentario`
  - `comentario_eliminado` → payload: `{ id: number }`
