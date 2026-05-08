# Diseño Técnico — Feed con IA

## Arquitectura general

El módulo de feed combina tres capas:
1. **Generación**: cron job en el backend que consulta DeepSeek API cada hora
2. **Almacenamiento**: publicaciones guardadas en MySQL
3. **Distribución**: API REST para carga inicial + WebSockets para actualizaciones en tiempo real

## Componentes frontend

### Pantallas
- `PantallaFeed` — lista principal de publicaciones con scroll infinito
- `PantallaDetalle` — vista completa de una publicación

### Componentes
- `TarjetaPublicacion` — card individual con título, resumen, pregunta y metadata
- `InsigniaIA` — badge visual que indica que la publicación fue generada por IA
- `BannerNuevasPublicaciones` — banner que aparece cuando llegan publicaciones nuevas en tiempo real
- `CargadorFeed` — skeleton loader mientras se obtienen datos

### Hooks
- `useFeed` — maneja la lista de publicaciones, paginación y estado de carga
- `usePublicacionesNuevas` — escucha el WebSocket para nuevas publicaciones

### Servicios
- `servicioPublicaciones` — encapsula las llamadas HTTP al endpoint de publicaciones

## Flujo técnico

### Carga inicial del feed
1. `PantallaFeed` monta y llama a `useFeed.cargar(pagina: 1)`
2. `servicioPublicaciones.obtenerFeed(pagina)` hace GET a `/api/publicaciones?pagina=1&limite=10`
3. El backend consulta MySQL y devuelve las publicaciones paginadas
4. El hook actualiza el estado y renderiza las tarjetas

### Scroll infinito
1. Al llegar al final de la lista, `useFeed.cargarMas()` incrementa la página
2. Se hace una nueva petición con la página siguiente
3. Las nuevas publicaciones se agregan al final de la lista existente

### Generación automática (cron job)
1. El cron job se ejecuta cada hora con `node-cron`
2. Construye un prompt para DeepSeek API solicitando noticias tecnológicas actuales
3. DeepSeek devuelve un JSON con las publicaciones generadas
4. El backend valida y guarda cada publicación en MySQL
5. Emite un evento WebSocket `nuevas_publicaciones` a todos los clientes conectados

### Actualización en tiempo real
1. `usePublicacionesNuevas` se conecta al WebSocket al montar `PantallaFeed`
2. Al recibir el evento `nuevas_publicaciones`, muestra el `BannerNuevasPublicaciones`
3. Al tocar el banner, se cargan las nuevas publicaciones al inicio del feed

## Endpoints del backend

| Método | Ruta                        | Descripción                              |
|--------|-----------------------------|------------------------------------------|
| GET    | `/api/publicaciones`        | Obtener feed paginado                    |
| GET    | `/api/publicaciones/:id`    | Obtener detalle de una publicación       |

## Estructura de datos

### Tabla `publicaciones` (MySQL)
```sql
id              INT AUTO_INCREMENT PRIMARY KEY
titulo          VARCHAR(255) NOT NULL
resumen         TEXT NOT NULL
pregunta        VARCHAR(500) NOT NULL
etiquetas       JSON
generado_por_ia BOOLEAN DEFAULT TRUE
creado_en       DATETIME DEFAULT NOW()
```

### Tipos TypeScript
```typescript
interface Publicacion {
  id: number
  titulo: string
  resumen: string
  pregunta: string
  etiquetas: string[]
  generadoPorIa: boolean
  creadoEn: string
  totalComentarios: number
}

interface RespuestaFeed {
  publicaciones: Publicacion[]
  pagina: number
  totalPaginas: number
}
```

### Prompt para DeepSeek API
```
Eres un asistente de noticias tecnológicas. Genera {n} publicaciones sobre noticias 
tecnológicas actuales. Para cada una incluye:
- titulo: título claro y atractivo
- resumen: resumen de máximo 300 palabras
- pregunta: una pregunta controversial que invite al debate
- etiquetas: array de 2-3 categorías relevantes

Responde únicamente con un array JSON válido.
```

## WebSocket
- Evento emitido: `nuevas_publicaciones`
- Payload: `{ cantidad: number, publicaciones: Publicacion[] }`
- Canal: broadcast a todos los clientes autenticados conectados
