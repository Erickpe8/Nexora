# Convenciones de Código — Nexora

## Idioma
TODO el proyecto debe estar en español:
- Variables, funciones, interfaces, types
- Nombres de componentes, hooks, servicios
- Carpetas y archivos
- Comentarios en el código

## Nomenclatura

| Elemento              | Convención    | Ejemplo                        |
|-----------------------|---------------|--------------------------------|
| Componentes           | PascalCase    | `TarjetaPublicacion`           |
| Pantallas             | PascalCase    | `PantallaFeed`                 |
| Hooks                 | camelCase     | `useFeed`, `useAutenticacion`  |
| Servicios             | camelCase     | `servicioPublicaciones`        |
| Interfaces / Types    | PascalCase    | `Publicacion`, `RespuestaFeed` |
| Variables / funciones | camelCase     | `totalComentarios`, `cargar()` |
| Archivos componentes  | PascalCase    | `TarjetaPublicacion.tsx`       |
| Archivos hooks/servicios | camelCase  | `useFeed.ts`, `servicioSocket.ts` |
| Carpetas              | kebab-case    | `feed-ia/`, `tiempo-real/`     |
| Controladores backend | camelCase     | `controladorAuth`              |
| Rutas backend         | kebab-case    | `auth.rutas.ts`                |

## Estructura de carpetas

### `mobile/src/`
```
mobile/src/
├── components/    -- UI reutilizable (incluye Icono.tsx)
├── screens/       -- pantallas completas
├── hooks/         -- lógica con estado (useXxx)
├── modules/auth/  -- dominio autenticación (pantallas, hooks, API, storage)
├── services/      -- HTTP y Socket.IO
├── navigation/    -- navegadores y rutas
├── context/       -- providers globales
├── styles/        -- tokens de diseño
├── types/         -- interfaces TypeScript
└── utils/         -- helpers puros (p. ej. socketDisponible)
```

### Iconografía (sin emojis en UI)
- Usar el componente `Icono` (`mobile/src/components/Icono.tsx`) con nombres semánticos (`inicio`, `buscar`, `corazon`, …).
- Implementación: Ionicons outline vía `@expo/vector-icons` (estilo alineado a Flowbite/Heroicons).
- No usar emojis Unicode en botones, tabs, reacciones ni estados vacíos.

### `backend/src/`
```
backend/src/
├── app.ts                 -- fábrica Express (sin listen)
├── server.ts              -- arranque HTTP + Socket.IO + cron
├── shared/
│   ├── config/            -- entorno (.env)
│   ├── database/          -- pool MySQL
│   ├── errors/            -- ErrorHttp y errores de dominio
│   └── logger/            -- registro mínimo estructurado
├── infrastructure/
│   ├── sockets/           -- Socket.IO
│   ├── cron/              -- jobs programados (generación IA)
│   ├── database/          -- DDL / crearTablas
│   ├── observability/     -- logs de generación IA, etc.
│   ├── ai/                -- hooks futuros proveedor IA
│   └── cache/             -- reservado
├── modules/               -- dominios futuros (auth, feed, …); rutas hoy en routes/
├── controllers/           -- orquestación HTTP
├── services/              -- lógica de negocio y queries
├── routes/                -- rutas Express
├── middlewares/           -- auth, validación, errores, rate limiting
├── types/                 -- interfaces y types TypeScript
└── utils/                 -- funciones puras (jwt, …)
```

## Estilo de código

- Código limpio y minimalista
- Uso moderado de azúcar sintáctico
- Separación clara de responsabilidades
- Simplicidad antes que sobreingeniería
- Un archivo por componente / servicio / hook
- Uso obligatorio de interfaces o types (nunca `any` sin justificación)

## Reglas de arquitectura

### Mobile
- Los componentes solo renderizan UI, no contienen lógica de negocio
- Los hooks encapsulan toda la lógica con estado
- Los servicios encapsulan todas las llamadas HTTP y WebSocket
- Las pantallas orquestan hooks y componentes, sin lógica directa

### Backend
- Los controladores solo orquestan: reciben request, llaman al servicio, devuelven respuesta
- Los servicios contienen toda la lógica de negocio y queries SQL
- Los middlewares son funciones puras y reutilizables
- Las rutas solo definen el path, método y middlewares aplicados

## Comentarios
- Solo cuando aporten valor real
- Explicar lógica compleja o decisiones no obvias
- Evitar comentarios redundantes que repiten lo que el código ya dice
- Siempre en español
