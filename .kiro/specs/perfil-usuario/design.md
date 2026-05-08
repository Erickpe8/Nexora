# Diseño Técnico — Perfil de Usuario

## Arquitectura general

El módulo de perfil es principalmente de lectura con una operación de escritura (editar nombre). Usa REST estándar sin necesidad de WebSockets.

## Componentes frontend

### Pantallas
- `PantallaPerfil` — perfil propio con edición y cierre de sesión
- `PantallaPerfilPublico` — perfil de otro usuario (solo lectura)

### Componentes
- `CabeceraPerfil` — avatar generado, nombre de usuario y fecha de registro
- `EstadisticasPerfil` — tarjetas con métricas de actividad
- `FormularioEditarNombre` — campo de texto inline para editar el nombre
- `HistorialComentarios` — lista de comentarios recientes del usuario
- `TarjetaHistorial` — item individual del historial con contenido y publicación

### Hooks
- `usePerfil` — obtiene y actualiza los datos del perfil
- `useHistorialComentarios` — obtiene los comentarios recientes del usuario

### Servicios
- `servicioPerfil` — encapsula las llamadas HTTP a la API de perfil

## Flujo técnico

### Ver perfil propio
1. `PantallaPerfil` monta y llama a `usePerfil.cargar()`
2. `servicioPerfil.obtenerPerfil()` hace GET a `/api/usuarios/perfil`
3. El backend devuelve datos del usuario autenticado con estadísticas
4. Se renderiza `CabeceraPerfil`, `EstadisticasPerfil` e `HistorialComentarios`

### Editar nombre de usuario
1. Usuario toca el nombre en `CabeceraPerfil`
2. `FormularioEditarNombre` aparece con el nombre actual
3. Usuario escribe el nuevo nombre y confirma
4. `usePerfil.actualizarNombre(nuevoNombre)` llama al servicio
5. PATCH a `/api/usuarios/perfil` con `{ nombre: nuevoNombre }`
6. El backend valida unicidad y actualiza en MySQL
7. El hook actualiza el estado local con el nuevo nombre

### Ver perfil público
1. Usuario toca el nombre de un autor en un comentario
2. Navega a `PantallaPerfilPublico` con el `usuarioId` como parámetro
3. GET a `/api/usuarios/:id` devuelve datos públicos del usuario

### Historial de comentarios
1. `useHistorialComentarios.cargar(usuarioId)` hace GET a `/api/usuarios/:id/comentarios`
2. El backend devuelve los últimos 20 comentarios con el título de la publicación
3. Se renderiza `HistorialComentarios` con `TarjetaHistorial`

## Endpoints del backend

| Método | Ruta                          | Descripción                                  |
|--------|-------------------------------|----------------------------------------------|
| GET    | `/api/usuarios/perfil`        | Obtener perfil del usuario autenticado       |
| PATCH  | `/api/usuarios/perfil`        | Actualizar nombre del usuario autenticado    |
| GET    | `/api/usuarios/:id`           | Obtener perfil público de un usuario         |
| GET    | `/api/usuarios/:id/comentarios` | Obtener historial de comentarios de un usuario |

## Estructura de datos

### Tipos TypeScript
```typescript
interface PerfilUsuario {
  id: number
  nombre: string
  correo: string        // solo en perfil propio
  creadoEn: string
  totalComentarios: number
}

interface PerfilPublico {
  id: number
  nombre: string
  creadoEn: string
  totalComentarios: number
}

interface ItemHistorial {
  id: number
  contenido: string
  creadoEn: string
  publicacion: {
    id: number
    titulo: string
  }
}

interface ActualizarPerfil {
  nombre: string
}
```

## Avatar generado
- Se usa el nombre de usuario para generar un avatar con iniciales
- Fondo de color determinístico basado en el nombre (hash simple)
- No se soporta subida de imágenes en esta versión
