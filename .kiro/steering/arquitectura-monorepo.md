# Arquitectura Monorepo — Nexora

## Estructura del repositorio

```
nexora/
├── mobile/              -- aplicación React Native + export web (Expo)
├── backend/             -- API REST + WebSockets + cron (Node.js)
├── api/                 -- entrada serverless Vercel → Express (`crearAplicacion`)
├── scripts/             -- build/deploy Vercel, env, disparo IA
├── .kiro/               -- specs, steering y hooks (metodología SDD)
├── docs/                -- onboarding, arquitectura, deploy
├── vercel.json          -- build, rewrites, cron horario IA
├── README.md
└── docker-compose.yml   -- MySQL local (puerto 3307)
```

## Principio fundamental

**Mobile y backend son proyectos completamente independientes.**
Cada uno tiene su propio `package.json`, sus propias dependencias y su propio proceso de arranque.
No comparten código fuente. Solo comparten contratos (tipos de API y eventos WebSocket documentados en specs).

---

## Carpeta `mobile/`

### Estructura
```
mobile/
├── src/
│   ├── components/    -- UI reutilizable (Boton, Tarjeta, Icono, …)
│   ├── screens/       -- pantallas completas
│   ├── hooks/         -- lógica con estado (useXxx)
│   ├── modules/auth/  -- autenticación (provider, pantallas, API, validadores)
│   ├── services/      -- HTTP (axios) y Socket.IO client
│   ├── navigation/    -- navegadores y rutas
│   ├── context/       -- ContextoAutenticacion, Socket, Notificaciones
│   ├── styles/        -- tokens (colores, tipografía, espaciado)
│   ├── types/         -- contratos TypeScript
│   └── utils/         -- utilidades (p. ej. `socketDisponible.ts`)
├── assets/            -- imágenes, íconos, fuentes
├── app.json           -- configuración de Expo
├── tailwind.config.js -- configuración de NativeWind
├── tsconfig.json
└── package.json
```

### Stack
- React Native + Expo Go
- TypeScript
- Axios (llamadas HTTP)
- Socket.IO Client (tiempo real)
- NativeWind (estilos)
- React Navigation (navegación)
- AsyncStorage / SecureStore (persistencia de token)
- `@expo/vector-icons` (Ionicons outline — iconografía sin emojis en UI)

### Responsabilidades de `mobile/`
- Autenticación (formularios, almacenamiento de token)
- Feed, búsqueda, reacciones, likes en comentarios
- Comentarios (crear, ver, responder, denunciar)
- Navegación entre pantallas (tabs con componente `Icono`)
- Socket.IO cuando el entorno lo permite (backend local con `server.ts`)
- Consumo de la API REST
- Notificaciones in-app y perfil de usuario

### Lo que `mobile/` NUNCA debe hacer
- Ejecutar cron jobs ni llamar a DeepSeek
- Conectarse directamente a MySQL
- Contener lógica de negocio del servidor ni validar JWT
- Usar emojis como iconografía de interfaz (usar `Icono` / Ionicons)

---

## Carpeta `backend/`

### Estructura
```
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── shared/            -- config, database pool, errors, logger
│   ├── infrastructure/    -- sockets, cron, observability, database DDL, cache, ai
│   ├── modules/           -- evolución por dominio (hoy vacío de rutas)
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middlewares/
│   ├── types/
│   └── utils/
├── logs/
├── .env
├── tsconfig.json
└── package.json
```

### Stack
- Node.js + TypeScript
- Express
- MySQL + mysql2
- JWT (jsonwebtoken + bcrypt)
- Socket.IO (servidor)
- node-cron (cron jobs)
- Axios (llamadas a DeepSeek API)
- helmet + cors + express-rate-limit

### Responsabilidades de `backend/`
- Autenticación JWT, API REST, MySQL (`shared/database/pool.ts`, `MYSQL_URL`)
- WebSockets con `server.ts` (no en handler serverless de Vercel)
- Generación IA: 4 publicaciones por ciclo (`orquestadorGeneracionIA.servicio.ts`)
- Cron horario (`cronGenerador.ts`) y ruta `GET /api/cron/generar-ia` (Vercel Cron)
- Semilla post-deploy: primera petición tras deploy en producción (`middlewareSemillaDespliegue`)
- Moderación, denuncias, reacciones, likes; migraciones (`npm run migrar`)

### Lo que `backend/` NUNCA debe hacer
- Renderizar UI ni importar React Native
- Almacenar estado de UI

---

## Flujo general del sistema

### Generación de publicaciones IA

| Entorno | Al desplegar / arrancar | Cada hora |
|---------|-------------------------|-----------|
| **Local** (`npm run dev` en backend) | 4 posts al iniciar `server.ts` | Cron `0 * * * *` → 4 posts |
| **Vercel** (producción) | 4 posts en la primera petición al API del nuevo deployment | Vercel Cron → `GET /api/cron/generar-ia` → 4 posts |

Pipeline: `cronGenerador.ts` → `ejecutarCicloOrquestadorGeneracionIA` → DeepSeek → `procesarLotePublicacionesIA` → MySQL. Detalle en `.kiro/specs/pipeline-generacion-ia/`.

### Tiempo real (solo con `server.ts`)

```
Socket.IO emite 'nuevas_publicaciones' → mobile/usePublicacionesNuevas → BannerNuevasPublicaciones
```

En **Vercel** y **Expo Web** contra `*.vercel.app` el cliente **no** conecta Socket (`socketDisponibleEnEntorno`); el feed se actualiza por pull (recargar / paginación).

### Deploy Vercel

- Build: `scripts/vercel-build.cjs` (backend `tsc` + `expo export --platform web`)
- Runtime API: `api/index.ts` exporta `crearAplicacion()` sin cron ni Socket.IO
- Guía: `docs/DEPLOY-VERCEL.md`

---

## Contratos compartidos

Mobile y backend se comunican únicamente a través de:

### API REST
- Documentada en `.kiro/specs/api-backend/design.md`
- Formato de respuesta estándar: `{ datos: any }` o `{ error: string, codigo: number }`
- Base URL configurada en variable de entorno en `mobile/`

### Eventos WebSocket
| Evento                  | Dirección          | Payload                              |
|-------------------------|--------------------|--------------------------------------|
| `nuevas_publicaciones`  | backend → mobile   | `{ cantidad, publicaciones[] }`      |
| `nuevo_comentario`      | backend → mobile   | `{ comentario, socketId }`           |
| `comentario_eliminado`  | backend → mobile   | `{ id, socketId }`                   |
| `nueva_notificacion`    | backend → mobile   | `Notificacion`                       |
| `unirse_publicacion`    | mobile → backend   | `publicacionId: number`              |
| `salir_publicacion`     | mobile → backend   | `publicacionId: number`              |

---

## SPECS transversales (confianza y operación)

Módulos de requisitos **extendidos** (formato unificado en `requirements.md`) que cruzan varios features sin duplicar el núcleo de producto:

| Carpeta | Propósito |
|---------|-----------|
| `.kiro/specs/moderacion-confianza-contenido/` | Denuncias, visibilidad de comentarios y gobernanza de riesgo sobre UGC + excepciones IA. |
| `.kiro/specs/observabilidad-plataforma/` | Logs estructurados, correlación, salud del servicio y señales mínimas de rendimiento. |
| `.kiro/specs/gestion-configuracion-secretos/` | Variables de entorno, secretos, validación al arranque y reglas Expo `EXPO_PUBLIC_*`. |
| `.kiro/specs/pipeline-generacion-ia/` | Arquitectura evolutiva del pipeline IA (etapas, persistencia antes de socket, versionado de prompts, colas futuras). |

---

## Reglas para Kiro

0. **SPECS nuevos o extendidos** deben seguir `.kiro/steering/metodologia-documentacion-specs.md`: flujo *analizar → detectar → proponer → actualizar arquitectura → crear SPEC*; estructura completa de `requirements.md` (incluye `## Problema actual detectado` … `## Próximos SPECS recomendados` y secciones finales `# CONTEXTO PARA DESARROLLO` / `# PREGUNTAS PARA CONTINUIDAD DEL PROYECTO`). **No SPECS aislados:** dependencias y próximos SPECS explícitos.
1. **Siempre identificar en qué lado vive el código** antes de generarlo
2. **Nunca mezclar imports** de React Native en el backend ni de Express en mobile
3. **Rutas de archivos**: usar `mobile/src/...` o `backend/src/...` siempre con el prefijo correcto
4. **Al generar specs**: separar claramente las secciones "Backend" y "Frontend (Mobile)"
5. **Al generar código**: confirmar el contexto (¿estamos en mobile o backend?) antes de escribir
6. **Variables de entorno**: cada proyecto tiene su propio `.env` independiente; en backend la lectura tipada vive en `shared/config/entorno.ts` y el pool MySQL en `shared/database/pool.ts`
7. **Dependencias**: nunca instalar una dependencia de backend en mobile ni viceversa
