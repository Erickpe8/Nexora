# Hook — Validar Estructura

## Propósito
Verificar que la estructura de carpetas y archivos del proyecto se mantiene coherente con la arquitectura definida.

## Estructura esperada del frontend

```
src/
├── components/     -- componentes reutilizables (sin lógica de negocio)
├── screens/        -- pantallas completas (una por vista)
├── services/       -- llamadas a la API (axios)
├── hooks/          -- lógica reutilizable con estado
├── navigation/     -- navegadores y constantes de rutas
├── types/          -- interfaces y types TypeScript
├── utils/          -- funciones puras de utilidad
└── styles/         -- tokens de diseño (colores, tipografía, espaciado)
```

## Estructura esperada del backend

```
backend/src/
├── config/         -- conexión DB, variables de entorno
├── middlewares/    -- autenticación, validación, errores, rate limiting
├── modulos/        -- módulos de negocio (auth, publicaciones, etc.)
│   └── [modulo]/
│       ├── [modulo].rutas.ts
│       ├── [modulo].controlador.ts
│       └── [modulo].servicio.ts
├── ia/             -- cron job, DeepSeek, logger
├── socket/         -- configuración Socket.IO
├── types/          -- tipos compartidos
└── servidor.ts     -- punto de entrada
```

## Validaciones a realizar

### Frontend
- [ ] No hay archivos de componentes fuera de `components/` o `screens/`
- [ ] No hay llamadas HTTP fuera de `services/`
- [ ] No hay tipos definidos fuera de `types/`
- [ ] No hay lógica de estado compleja directamente en pantallas (usar hooks)
- [ ] Los navegadores están en `navigation/`

### Backend
- [ ] Cada módulo tiene exactamente: `.rutas.ts`, `.controlador.ts`, `.servicio.ts`
- [ ] No hay lógica de negocio en los controladores (solo orquestación)
- [ ] No hay queries SQL fuera de los servicios
- [ ] Los middlewares están en `middlewares/`
- [ ] Las variables de entorno se leen solo desde `config/entorno.ts`

## Señales de alerta
- Archivos en la raíz de `src/` que no sean `App.tsx` o `index.ts`
- Módulos del backend sin los 3 archivos requeridos
- Queries SQL en controladores
- Lógica de negocio en rutas del backend
- Componentes con más de una responsabilidad clara
