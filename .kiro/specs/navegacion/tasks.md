# Tareas de Implementación — Navegación

## Instalación y configuración

- [ ] Instalar dependencias de React Navigation:
  - [ ] `@react-navigation/native`
  - [ ] `@react-navigation/stack`
  - [ ] `@react-navigation/bottom-tabs`
  - [ ] `react-native-screens`
  - [ ] `react-native-safe-area-context`
- [ ] Ejecutar configuración nativa de `react-native-screens` si aplica con Expo

## Constantes y tipos

- [ ] Crear `src/navigation/rutas.ts` con el objeto `RUTAS` y todas las constantes de rutas
- [ ] Crear `src/types/navegacion.ts` con los tipos de parámetros:
  - [ ] `ParamsRaiz`
  - [ ] `ParamsAuth`
  - [ ] `ParamsFeed`
  - [ ] `ParamsTabs`

## Navegadores

- [ ] Crear `NavegadorAutenticacion` en `src/navigation/`
  - [ ] Stack con `PantallaLogin` y `PantallaRegistro`
  - [ ] Sin header visible
  - [ ] Transición horizontal estándar
- [ ] Crear `NavegadorFeed` en `src/navigation/`
  - [ ] Stack con `PantallaFeed`, `PantallaDetalle` y `PantallaPerfilPublico`
  - [ ] Header con título "Nexora" en `PantallaFeed`
  - [ ] Header con título dinámico en `PantallaDetalle`
- [ ] Crear `NavegadorNotificaciones` en `src/navigation/`
  - [ ] Stack con `PantallaNotificaciones`
- [ ] Crear `NavegadorPerfil` en `src/navigation/`
  - [ ] Stack con `PantallaPerfil`
- [ ] Crear `NavegadorPrincipal` en `src/navigation/`
  - [ ] Bottom Tab Navigator con los 3 tabs
  - [ ] Íconos para cada tab (Feed, Notificaciones, Perfil)
  - [ ] Badge en tab de Notificaciones conectado a `ContextoNotificaciones`
  - [ ] Estilos de la barra de tabs alineados con el sistema de diseño
- [ ] Crear `NavegadorRaiz` en `src/navigation/`
  - [ ] Stack raíz que decide entre Auth y Principal
  - [ ] Leer estado de sesión desde `ContextoAutenticacion`
  - [ ] Sin animación al cambiar entre Auth y Principal
  - [ ] Aplicar tema de navegación personalizado

## Auth guard

- [ ] Implementar lógica de auth guard en `NavegadorRaiz`
  - [ ] Si `usuario` existe en contexto → mostrar `NavegadorPrincipal`
  - [ ] Si `usuario` es null → mostrar `NavegadorAutenticacion`
  - [ ] El cambio de estado de autenticación actualiza el árbol automáticamente
- [ ] Verificar que al cerrar sesión se limpia el historial de navegación

## Deep linking (preparado)

- [ ] Crear `src/navigation/configuracionLinking.ts` con la estructura de deep linking
- [ ] Dejar comentado y documentado para activación futura
- [ ] No activar en esta versión

## Pruebas

- [ ] Verificar que usuarios no autenticados no pueden acceder a tabs
- [ ] Verificar que al autenticarse se redirige al feed automáticamente
- [ ] Verificar que al cerrar sesión se redirige al login y se limpia el historial
- [ ] Verificar que la navegación Feed → Detalle → Perfil Público funciona correctamente
- [ ] Verificar que el badge de notificaciones se actualiza en el tab
- [ ] Verificar que el botón de retroceso del dispositivo funciona en todos los stacks
