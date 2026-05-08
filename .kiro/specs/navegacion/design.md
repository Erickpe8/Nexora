# Diseño Técnico — Navegación

## Arquitectura de navegación

```
NavegadorRaiz (Stack)
├── NavegadorAutenticacion (Stack)  -- sin tabs, sin header
│   ├── PantallaLogin
│   └── PantallaRegistro
└── NavegadorPrincipal (Bottom Tabs)
    ├── Tab: Feed (Stack)
    │   ├── PantallaFeed
    │   ├── PantallaDetalle
    │   └── PantallaPerfilPublico
    ├── Tab: Notificaciones (Stack)
    │   └── PantallaNotificaciones
    └── Tab: Perfil (Stack)
        └── PantallaPerfil
```

## Implementación

### `NavegadorRaiz`
```typescript
// src/navigation/NavegadorRaiz.tsx
// Stack navigator raíz
// Decide entre NavegadorAutenticacion y NavegadorPrincipal
// basado en el estado de sesión de ContextoAutenticacion
```

### `NavegadorAutenticacion`
```typescript
// src/navigation/NavegadorAutenticacion.tsx
// Stack sin header visible
// Transición horizontal estándar
```

### `NavegadorPrincipal`
```typescript
// src/navigation/NavegadorPrincipal.tsx
// Bottom Tab Navigator
// Tab icons: Feed (home), Notificaciones (bell), Perfil (user)
// Badge en tab de Notificaciones desde ContextoNotificaciones
// Barra de tabs con fondo fondoTarjeta y acento para tab activo
```

### `NavegadorFeed`
```typescript
// src/navigation/NavegadorFeed.tsx
// Stack dentro del tab Feed
// Header con título "Nexora" en PantallaFeed
// Header con título de la publicación en PantallaDetalle
```

## Constantes de rutas

```typescript
// src/navigation/rutas.ts
export const RUTAS = {
  // Auth
  LOGIN: 'Login',
  REGISTRO: 'Registro',

  // Tabs
  TAB_FEED: 'TabFeed',
  TAB_NOTIFICACIONES: 'TabNotificaciones',
  TAB_PERFIL: 'TabPerfil',

  // Feed stack
  FEED: 'Feed',
  DETALLE: 'Detalle',
  PERFIL_PUBLICO: 'PerfilPublico',

  // Notificaciones stack
  NOTIFICACIONES: 'Notificaciones',

  // Perfil stack
  PERFIL: 'Perfil',
} as const
```

## Tipos de parámetros de navegación

```typescript
// src/types/navegacion.ts
export type ParamsRaiz = {
  Auth: undefined
  Principal: undefined
}

export type ParamsAuth = {
  Login: undefined
  Registro: undefined
}

export type ParamsFeed = {
  Feed: undefined
  Detalle: { publicacionId: number }
  PerfilPublico: { usuarioId: number }
}

export type ParamsTabs = {
  TabFeed: undefined
  TabNotificaciones: undefined
  TabPerfil: undefined
}
```

## Auth guard

```typescript
// NavegadorRaiz verifica el estado de autenticación
// Si hay sesión activa → mostrar NavegadorPrincipal
// Si no hay sesión → mostrar NavegadorAutenticacion
// El cambio de estado dispara re-render automático del navegador raíz
// No se usan redirects manuales, React Navigation maneja el cambio de árbol
```

## Configuración de React Navigation

```typescript
// Dependencias necesarias:
// @react-navigation/native
// @react-navigation/stack
// @react-navigation/bottom-tabs
// react-native-screens
// react-native-safe-area-context

// Tema personalizado alineado con colores del sistema de diseño
const temaNavegacion = {
  dark: true,
  colors: {
    primary: '#6C63FF',
    background: '#0F0F0F',
    card: '#1A1A1A',
    text: '#F0F0F0',
    border: '#2A2A2A',
    notification: '#6C63FF',
  },
}
```

## Deep linking (preparado para el futuro)

```typescript
// Estructura de linking preparada pero no activada
const configuracionLinking = {
  prefixes: ['nexora://'],
  config: {
    screens: {
      Principal: {
        screens: {
          TabFeed: {
            screens: {
              Detalle: 'publicacion/:publicacionId',
            },
          },
        },
      },
    },
  },
}
```
