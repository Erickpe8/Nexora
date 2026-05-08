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
| Archivos              | kebab-case    | `tarjeta-publicacion.tsx`      |
| Carpetas              | kebab-case    | `feed-ia/`, `tiempo-real/`     |
| Controladores backend | camelCase     | `controladorAuth`              |
| Rutas backend         | kebab-case    | `auth.rutas.ts`                |

## Estructura de carpetas

### `mobile/src/`
```
mobile/src/
├── components/    -- componentes reutilizables (solo UI, sin lógica de negocio)
├── screens/       -- pantallas completas (una por vista)
├── hooks/         -- lógica con estado (useXxx)
├── services/      -- llamadas HTTP y WebSocket (axios, socket.io-client)
├── navigation/    -- navegadores y constantes de rutas
├── styles/        -- tokens de diseño (colores, tipografía, espaciado)
├── types/         -- interfaces y types TypeScript
└── utils/         -- funciones puras de utilidad
```

### `backend/src/`
```
backend/src/
├── config/        -- conexión DB, variables de entorno
├── controllers/   -- orquestación de requests (sin lógica de negocio)
├── services/      -- lógica de negocio y queries
├── routes/        -- definición de rutas Express
├── middlewares/   -- auth, validación, errores, rate limiting
├── sockets/       -- configuración y eventos Socket.IO
├── cron/          -- cron jobs
├── types/         -- interfaces y types TypeScript
└── utils/         -- funciones puras de utilidad
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
