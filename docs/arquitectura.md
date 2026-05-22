# Arquitectura del Sistema — Nexora

Documento de referencia visual de la arquitectura completa del proyecto.

---

## Visión general

```
┌─────────────────────────────────────────────────────────────┐
│                        NEXORA                               │
│                                                             │
│   ┌──────────────┐          ┌──────────────────────────┐   │
│   │   mobile/    │◄────────►│       backend/           │   │
│   │ React Native │  REST +  │  Node.js + Express       │   │
│   │    + Expo    │ Socket.IO│  + MySQL + Socket.IO     │   │
│   └──────────────┘          └──────────┬─────────────┘   │
│                                         │                   │
│                              ┌──────────▼──────────┐       │
│                              │   DeepSeek API (IA)  │       │
│                              │   Cron cada hora     │       │
│                              └─────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujo principal del sistema

```
[Cron Job — cada hora]
    └── backend/src/infrastructure/cron/cronGenerador.ts
          ├── Llama a DeepSeek API
          ├── Valida, sanitiza y deduplica (hash SHA-256)
          ├── Persiste en MySQL (tabla publicaciones)
          └── Socket.IO emite 'nuevas_publicaciones' → todos los clientes

[Cliente móvil]
    └── mobile/src/hooks/usePublicacionesNuevas.ts
          ├── Recibe evento 'nuevas_publicaciones'
          ├── Muestra BannerNuevasPublicaciones
          └── Usuario toca → recarga el feed
```

---

## Estructura de carpetas

### Mobile (`mobile/src/`)

```
mobile/src/
├── components/    → UI reutilizable (sin lógica de negocio)
├── screens/       → Pantallas completas (una por vista)
├── hooks/         → Lógica con estado (useXxx en español)
├── services/      → Llamadas HTTP y WebSocket
├── navigation/    → Navegadores y constantes de rutas
├── styles/        → Tokens de diseño (colores, tipografía, espaciado)
├── types/         → Interfaces y types TypeScript
├── context/       → Contextos React (autenticación, notificaciones)
└── utils/         → Funciones puras de utilidad
```

### Backend (`backend/src/`)

```
backend/src/
├── app.ts                    → Express app factory (sin listen)
├── server.ts                 → Arranque HTTP + Socket.IO + Cron
├── shared/
│   ├── config/entorno.ts     → Variables de entorno validadas (único punto de lectura)
│   ├── database/pool.ts      → Pool MySQL
│   ├── errors/errorHttp.ts   → Error de dominio
│   └── logger/registro.ts    → Logger JSON estructurado
├── infrastructure/
│   ├── sockets/              → Socket.IO server
│   ├── cron/                 → Cron job de generación IA
│   ├── database/             → DDL (crearTablas) + migraciones
│   ├── observability/        → Logs de generación IA
│   ├── ai/                   → Hooks futuros proveedor IA
│   └── cache/                → Reservado
├── modules/                  → Dominios futuros (evolución)
├── controllers/              → Orquestación HTTP (thin layer)
├── services/                 → Lógica de negocio y queries SQL
├── routes/                   → Definición de rutas Express
├── middlewares/              → Auth, validación, errores, rate limiting
├── types/                    → Interfaces y types TypeScript
└── utils/                    → Funciones puras (jwt, etc.)
```

---

## Contratos de comunicación

### API REST

- Base URL: `EXPO_PUBLIC_API_URL` (configurada en `mobile/.env`)
- Respuesta exitosa: `{ "datos": <payload> }`
- Respuesta de error: `{ "error": "mensaje", "codigo": <status> }`
- Documentación completa: `backend/README.md`

### Eventos WebSocket

| Evento | Dirección | Sala | Payload |
|--------|-----------|------|---------|
| `nuevas_publicaciones` | backend → mobile | `feed_global` | `{ cantidad, publicaciones[] }` |
| `nuevo_comentario` | backend → mobile | `comentarios:{id}` | `{ comentario, socketId }` |
| `comentario_eliminado` | backend → mobile | `comentarios:{id}` | `{ id, socketId }` |
| `comentario_oculto` | backend → mobile | `comentarios:{id}` | `{ comentarioId, publicacionId }` |
| `comentario_restaurado` | backend → mobile | `comentarios:{id}` | `{ comentarioId, publicacionId }` |
| `nueva_notificacion` | backend → mobile | `usuario:{id}` | `Notificacion` |
| `unirse_publicacion` | mobile → backend | — | `publicacionId: number` |
| `salir_publicacion` | mobile → backend | — | `publicacionId: number` |

---

## Modelo de datos (tablas MySQL)

| Tabla | Propósito |
|-------|-----------|
| `usuarios` | Cuentas de usuario (auth) |
| `publicaciones` | Posts generados por IA |
| `comentarios` | Comentarios y respuestas anidadas |
| `notificaciones` | Notificaciones in-app |
| `denuncias` | Reportes de contenido |
| `versiones_prompt_ia` | Historial de prompts DeepSeek |
| `registros_generacion_ia` | Trazabilidad del pipeline IA |
| `reacciones_publicacion` | Reacciones en posts |
| `likes_comentario` | Likes en comentarios |
| `denuncias` | Reportes de contenido |
| `estado_sistema` | Control de semilla post-deploy (Vercel) |

---

## Despliegue en Vercel

- **Web:** `mobile/dist` (Expo export) servido como estático.
- **API:** `api/index.ts` → `backend/dist/app` (sin Socket.IO ni cron en el proceso serverless).
- **IA en producción:** semilla de 4 posts tras cada deploy (primera petición) + cron horario en `vercel.json`.
- **MySQL:** Railway u otro proveedor vía `MYSQL_URL` + `DB_SSL=true`.
- Guía paso a paso: [DEPLOY-VERCEL.md](DEPLOY-VERCEL.md)

## Fases implementadas

| Fase | Módulo | Estado |
|------|--------|--------|
| 1 | Bootstrap Backend | Completado |
| 2 | UI Global (sistema de diseño + Icono) | Completado |
| 3 | Navegación | Completado |
| 4 | Autenticación | Completado |
| 5 | Feed + IA | Completado |
| 6 | Comentarios | Completado |
| 7 | Notificaciones | Completado |
| 8 | Perfil de Usuario | Completado |
| 9 | Observabilidad de Plataforma | Completado |
| 10 | Gestión de Configuración y Secretos | Completado |
| 11 | Pipeline de Generación IA | Completado |
| 12 | Moderación y Confianza de Contenido | Completado |

---

## Reglas de separación estricta

**Mobile NUNCA debe:**
- Ejecutar cron jobs
- Conectarse directamente a MySQL
- Llamar a DeepSeek API
- Contener lógica de negocio del servidor
- Importar Express, mysql2, node-cron, bcrypt

**Backend NUNCA debe:**
- Renderizar UI
- Importar librerías de React Native
- Manejar navegación
- Almacenar estado de UI

---

## Referencias

- Índice Kiro: [.kiro/README.md](../.kiro/README.md)
- Detalle de arquitectura: [.kiro/steering/arquitectura-monorepo.md](../.kiro/steering/arquitectura-monorepo.md)
- Stack: [.kiro/steering/stack.md](../.kiro/steering/stack.md)
- Convenciones (incl. `Icono`): [.kiro/steering/convenciones.md](../.kiro/steering/convenciones.md)
- Specs por módulo: [.kiro/specs/](../.kiro/specs/)
