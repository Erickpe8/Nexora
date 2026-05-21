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

---

## Fases implementadas

| Fase | Módulo | Estado |
|------|--------|--------|
| 1 | Bootstrap Backend | ✅ |
| 2 | UI Global (sistema de diseño) | ✅ |
| 3 | Navegación | ✅ |
| 4 | Autenticación | ✅ |
| 5 | Feed + IA | ✅ |
| 6 | Comentarios | ✅ |
| 7 | Notificaciones | ✅ |
| 8 | Perfil de Usuario | ✅ |
| 9 | Observabilidad de Plataforma | ✅ |
| 10 | Gestión de Configuración y Secretos | ✅ |
| 11 | Pipeline de Generación IA (Fase B) | ✅ |
| 12 | Moderación y Confianza de Contenido | ✅ |

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

- Detalle de arquitectura: `.kiro/steering/arquitectura-monorepo.md`
- Stack tecnológico: `.kiro/steering/stack.md`
- Convenciones de código: `.kiro/steering/convenciones.md`
- Specs por módulo: `.kiro/specs/`
