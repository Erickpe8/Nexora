# Nexora — Backend

API REST + WebSockets + Cron Jobs para la red social Nexora.

## Instalación y arranque

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores reales

# 3a. Base de datos nueva — crear todas las tablas desde cero
npm run tablas

# 3b. Base de datos existente — migración incremental (agrega columnas/tablas nuevas sin borrar datos)
npm run migrar

# 4. Arrancar en desarrollo
npm run dev
```

El servidor arranca en `http://localhost:{PUERTO}` (por defecto 4010).

---

## Variables de entorno

Ver `.env.example` para la lista completa. Las más importantes:

| Variable | Descripción |
|----------|-------------|
| `PUERTO` | Puerto del servidor (default: 4010) |
| `DB_HOST / DB_PUERTO / DB_NOMBRE / DB_USUARIO / DB_CONTRASENA` | Conexión MySQL |
| `JWT_SECRETO` | Secreto para firmar tokens JWT |
| `DEEPSEEK_API_KEY` | Clave de la API de DeepSeek |
| `INTERNO_API_KEY` | Clave para el endpoint interno de generación IA |
| `MODERADOR_IDS` | IDs de usuarios con rol moderador (separados por coma) |
| `MODERACION_AUTO_OCULTAR` | `true` para auto-ocultar comentarios al superar umbral |
| `MODERACION_UMBRAL_DENUNCIAS` | Número de denuncias para auto-ocultar (default: 5) |

---

## Endpoints

Todos los endpoints (excepto salud y auth) requieren header:
```
Authorization: Bearer <token>
```

Formato de respuesta exitosa: `{ "datos": <payload> }`
Formato de error: `{ "error": "mensaje", "codigo": <status> }`

---

### Salud — sin autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/salud` | Estado completo: versión, uptime, MySQL |
| `GET` | `/api/salud/listo` | Liveness — proceso vivo |
| `GET` | `/api/salud/vivo` | Readiness — MySQL responde (503 si no) |

---

### Autenticación — rate limit 10/15min por IP

| Método | Ruta | Auth | Body | Descripción |
|--------|------|------|------|-------------|
| `POST` | `/api/auth/registro` | No | `{ nombre, correo, contrasena }` | Crear cuenta |
| `POST` | `/api/auth/login` | No | `{ correo, contrasena }` | Iniciar sesión |
| `GET` | `/api/auth/verificar` | Sí | — | Verificar token activo |

**Respuesta de registro/login:**
```json
{
  "datos": {
    "token": "eyJ...",
    "usuario": { "id": 1, "nombre": "Ana", "correo": "ana@nexora.app", "creadoEn": "..." }
  }
}
```

---

### Publicaciones

| Método | Ruta | Auth | Query | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/api/publicaciones` | Sí | `pagina`, `limite` | Feed paginado |
| `GET` | `/api/publicaciones/:id` | Sí | — | Detalle de publicación |
| `GET` | `/api/publicaciones/:id/comentarios` | Sí | — | Comentarios de una publicación |
| `POST` | `/api/publicaciones/:id/comentarios` | Sí | — | Crear comentario |

**Body crear comentario:**
```json
{ "contenido": "texto (máx 500 chars)", "comentarioPadreId": 5 }
```

---

### Comentarios

| Método | Ruta | Auth | Body | Descripción |
|--------|------|------|------|-------------|
| `DELETE` | `/api/comentarios/:id` | Sí | — | Eliminar comentario propio |
| `POST` | `/api/comentarios/:id/denuncias` | Sí | `{ motivo, detalle? }` | Denunciar comentario |

**Motivos válidos:** `spam`, `acoso`, `contenido_inapropiado`, `desinformacion`, `otro`

---

### Notificaciones

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/notificaciones` | Sí | Últimas 50 notificaciones del usuario |
| `PATCH` | `/api/notificaciones/leer-todas` | Sí | Marcar todas como leídas |
| `PATCH` | `/api/notificaciones/:id/leida` | Sí | Marcar una como leída |

---

### Usuarios / Perfil

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/usuarios/perfil` | Sí | Perfil propio con estadísticas |
| `PATCH` | `/api/usuarios/perfil` | Sí | Actualizar nombre |
| `GET` | `/api/usuarios/:id` | Sí | Perfil público (sin correo) |
| `GET` | `/api/usuarios/:id/comentarios` | Sí | Historial de comentarios del usuario |

**Body actualizar perfil:**
```json
{ "nombre": "NuevoNombre" }
```

---

### Moderación — requiere rol moderador

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/moderacion/denuncias` | Sí + mod | Lista paginada de denuncias |
| `PATCH` | `/api/moderacion/comentarios/:id` | Sí + mod | Ocultar o restaurar comentario |

**Body moderar comentario:**
```json
{ "accion": "oculto", "notaInterna": "razón opcional" }
```

**Query denuncias:** `pagina`, `limite`, `estado` (pendiente/revisada/resuelta/descartada)

---

### Interno — requiere header `X-Interno-Api-Key`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/interno/ia/generar` | Disparo manual del pipeline IA (máx 5/hora) |

---

## WebSockets

Conexión con autenticación JWT:
```js
const socket = io('http://localhost:4010', {
  auth: { token: 'eyJ...' }
})
```

### Eventos del servidor → cliente

| Evento | Sala | Payload |
|--------|------|---------|
| `nuevas_publicaciones` | `feed_global` | `{ cantidad, publicaciones[] }` |
| `nuevo_comentario` | `comentarios:{publicacionId}` | `{ comentario, socketId }` |
| `comentario_eliminado` | `comentarios:{publicacionId}` | `{ id, socketId }` |
| `comentario_oculto` | `comentarios:{publicacionId}` | `{ comentarioId, publicacionId }` |
| `comentario_restaurado` | `comentarios:{publicacionId}` | `{ comentarioId, publicacionId }` |
| `nueva_notificacion` | `usuario:{id}` | `Notificacion` |

### Eventos del cliente → servidor

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `unirse_publicacion` | `publicacionId: number` | Unirse a sala de comentarios |
| `salir_publicacion` | `publicacionId: number` | Salir de sala de comentarios |

---

## Cron Job — Generación IA

Se ejecuta automáticamente cada hora en punto (`0 * * * *`).

- Llama a DeepSeek API para generar 4 publicaciones
- Valida, sanitiza y deduplica (por título y hash SHA-256)
- Persiste en MySQL
- Emite `nuevas_publicaciones` a todos los clientes conectados
- Registra resultado en `logs/generacion.log` y en `registros_generacion_ia`

Para disparar manualmente en desarrollo:
```bash
curl -X POST http://localhost:4010/api/interno/ia/generar \
  -H "X-Interno-Api-Key: nexora_interno_dev"
```

---

## Estructura del proyecto

```
backend/src/
├── app.ts                    — Express app factory
├── server.ts                 — Entry point (HTTP + Socket + Cron)
├── controllers/              — Orquestación HTTP (thin layer)
├── services/                 — Lógica de negocio
├── routes/                   — Definición de rutas
├── middlewares/              — Auth, validación, errores, correlación, rate limit
├── infrastructure/
│   ├── database/             — DDL (crearTablas) + migraciones (migrarTablas)
│   ├── sockets/              — Socket.IO server
│   ├── cron/                 — Cron job de generación IA
│   └── observability/        — Log de generación IA
├── shared/
│   ├── config/entorno.ts     — Variables de entorno validadas
│   ├── database/pool.ts      — Pool MySQL
│   ├── errors/errorHttp.ts   — Error de dominio
│   └── logger/registro.ts    — Logger JSON estructurado
├── types/index.ts            — Tipos TypeScript compartidos
└── utils/jwt.ts              — Utilidades JWT
```
