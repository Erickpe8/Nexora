# Arquitectura Monorepo — Nexora

## Estructura del repositorio

```
nexora/
├── mobile/          -- aplicación React Native (cliente móvil)
├── backend/         -- API REST + WebSockets + cron jobs
├── .kiro/           -- documentación, specs y steering de Kiro
├── docs/            -- documentación general del proyecto
├── README.md        -- descripción general del monorepo
└── docker-compose.yml -- orquestación de servicios (DB, backend)
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
│   ├── components/    -- componentes reutilizables de UI
│   ├── screens/       -- pantallas completas
│   ├── hooks/         -- lógica con estado (useXxx)
│   ├── services/      -- llamadas HTTP y WebSocket
│   ├── navigation/    -- navegadores y constantes de rutas
│   ├── styles/        -- tokens de diseño (colores, tipografía, espaciado)
│   ├── types/         -- interfaces y types TypeScript
│   └── utils/         -- funciones puras de utilidad
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
- AsyncStorage (persistencia local)

### Responsabilidades de `mobile/`
✅ Autenticación (formularios, almacenamiento de token)
✅ Renderizado del feed de publicaciones
✅ Comentarios (crear, ver, responder)
✅ Navegación entre pantallas
✅ Conexión WebSocket y recepción de eventos realtime
✅ Consumo de la API REST del backend
✅ Manejo de estado de UI
✅ Notificaciones in-app
✅ Perfil de usuario

### Lo que `mobile/` NUNCA debe hacer
❌ Ejecutar cron jobs
❌ Conectarse directamente a MySQL
❌ Ejecutar lógica de IA o llamar a DeepSeek API
❌ Contener lógica de negocio del servidor
❌ Ejecutar servidores Node.js
❌ Manejar autenticación del lado del servidor

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
✅ Autenticación JWT (registro, login, verificación)
✅ API REST para todas las entidades
✅ Manejo de MySQL (queries, pool de conexiones)
✅ WebSockets (emitir eventos a clientes conectados)
✅ Cron jobs (generación automática de publicaciones)
✅ Integración con DeepSeek API
✅ Validación de inputs
✅ Seguridad (helmet, cors, rate limiting)
✅ Logs de operaciones y errores
✅ Manejo centralizado de errores

### Lo que `backend/` NUNCA debe hacer
❌ Renderizar UI
❌ Importar librerías de React Native
❌ Manejar navegación
❌ Almacenar estado de UI

---

## Flujo general del sistema

```
[Cron Job — cada hora]
    └── backend/src/infrastructure/cron/cronGenerador.ts
          └── Orquestador de pipeline (ver `.kiro/specs/pipeline-generacion-ia/`)
          └── Consulta DeepSeek API
          └── Valida y guarda publicación en MySQL
          └── Socket.IO emite 'nuevas_publicaciones' a todos los clientes

[Cliente móvil]
    └── mobile/src/hooks/usePublicacionesNuevas.ts
          └── Recibe evento 'nuevas_publicaciones'
          └── Muestra BannerNuevasPublicaciones
          └── Usuario toca → recarga el feed
```

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
