# Roadmap de Desarrollo — Nexora

## Instrucciones para Kiro

Este archivo define el orden exacto en que se debe desarrollar Nexora.
Cada fase tiene dependencias claras. **No avanzar a la siguiente fase sin completar la actual.**

Al iniciar cada fase:
1. Crear la rama correspondiente (`feature/tk-nombre`)
2. Implementar todas las tareas de esa fase
3. Verificar que las pruebas pasan
4. Hacer commit con el nombre indicado
5. Marcar la fase como completada aquí

---

## Fase 1 — Bootstrap Backend
**Rama:** `feature/tk-bootstrap-backend`
**Spec:** `.kiro/specs/api-backend/tasks.md`
**Estado:** `[x] Completado`

### Qué hacer
- Crear carpeta `backend/` en la raíz del monorepo con su propio `package.json`
- Inicializar Node.js + TypeScript con la estructura: `src/config/`, `src/controllers/`, `src/services/`, `src/routes/`, `src/middlewares/`, `src/sockets/`, `src/cron/`, `src/types/`, `src/utils/`
- Configurar conexión a MySQL con pool de conexiones en `backend/src/config/baseDatos.ts`
- Crear todos los middlewares base en `backend/src/middlewares/`: autenticación, validación, errores, rate limiting
- Configurar `helmet`, `cors`, `dotenv`
- Crear utilidades JWT en `backend/src/utils/`: `generarToken`, `verificarToken`
- Crear script `backend/src/config/crearTablas.ts` con el DDL de todas las tablas
- Crear `backend/src/servidor.ts` funcional que arranque sin errores

### Commits de esta fase
```
chore: inicializar proyecto backend con Node.js y TypeScript
chore: configurar conexión a MySQL con pool de conexiones
feat: agregar middlewares base de autenticación, validación y errores
feat: crear utilidades JWT para generación y verificación de tokens
chore: agregar script de creación de tablas MySQL
```

### Criterio de completado
El servidor arranca, se conecta a MySQL y responde en `GET /` sin errores.

---

## Fase 2 — UI Global (Sistema de Diseño)
**Rama:** `feature/tk-ui-global`
**Spec:** `.kiro/specs/ui-global/tasks.md`
**Estado:** `[x] Completado`
**Dependencia:** Ninguna (puede hacerse en paralelo con Fase 1)

### Qué hacer
- Crear tokens de diseño en `mobile/src/styles/`: `colores.ts`, `tipografia.ts`, `espaciado.ts`
- Configurar NativeWind con colores personalizados en `mobile/tailwind.config.js`
- Crear componentes base en `mobile/src/components/`: `Boton`, `Entrada`, `Tarjeta`, `Texto`
- Crear componentes de estado: `Cargador`, `EsqueletoTarjeta`, `EstadoVacio`
- Crear componentes utilitarios: `Divisor`, `Insignia`

### Commits de esta fase
```
feat: crear sistema de tokens de diseño con colores, tipografía y espaciado
feat: configurar NativeWind con paleta de colores personalizada
feat: implementar componentes base Boton, Entrada, Tarjeta y Texto
feat: agregar componentes de estado CargadorFeed, EstadoVacio y EsqueletoTarjeta
feat: agregar componentes utilitarios Divisor e Insignia
```

### Criterio de completado
Todos los componentes base renderizan correctamente en Expo Go con tema oscuro.

---

## Fase 3 — Navegación
**Rama:** `feature/tk-navegacion`
**Spec:** `.kiro/specs/navegacion/tasks.md`
**Estado:** `[x] Completado`
**Dependencia:** Fase 2 (necesita componentes base para los tabs)

### Qué hacer
- Instalar React Navigation y dependencias en `mobile/`
- Crear constantes de rutas en `mobile/src/navigation/rutas.ts`
- Crear tipos de parámetros de navegación en `mobile/src/types/navegacion.ts`
- Crear `NavegadorAutenticacion` en `mobile/src/navigation/` (stack sin tabs)
- Crear `NavegadorFeed`, `NavegadorNotificaciones`, `NavegadorPerfil` en `mobile/src/navigation/`
- Crear `NavegadorPrincipal` en `mobile/src/navigation/` (bottom tabs con 3 tabs)
- Crear `NavegadorRaiz` en `mobile/src/navigation/` con auth guard
- Crear `ContextoAutenticacion` en `mobile/src/` para el estado global de sesión
- Preparar estructura de deep linking en `mobile/src/navigation/configuracionLinking.ts` (sin activar)

### Commits de esta fase
```
chore: instalar React Navigation y dependencias de navegación
feat: crear constantes de rutas y tipos de parámetros de navegación
feat: implementar NavegadorAutenticacion con stack de login y registro
feat: implementar NavegadorPrincipal con tabs de feed, notificaciones y perfil
feat: implementar NavegadorRaiz con auth guard basado en estado de sesión
feat: crear ContextoAutenticacion para manejo global de sesión
```

### Criterio de completado
La app navega entre pantallas placeholder. El auth guard redirige correctamente según el estado de sesión.

---

## Fase 4 — Autenticación
**Rama:** `feature/tk-autenticacion`
**Spec:** `.kiro/specs/autenticacion/tasks.md`
**Estado:** `[x] Completado`
**Dependencia:** Fase 1 (backend) + Fase 3 (navegación)

### Qué hacer
**Backend (`backend/src/`):**
- Crear tabla `usuarios` en MySQL
- Crear endpoints en `routes/auth.rutas.ts`: `POST /api/auth/registro`, `POST /api/auth/login`, `GET /api/auth/verificar`
- Implementar lógica en `services/auth.servicio.ts` y `controllers/auth.controlador.ts`

**Mobile (`mobile/src/`):**
- Crear tipos de autenticación en `types/`
- Crear `services/servicioAutenticacion.ts` con métodos `login`, `registrar`, `verificarSesion`
- Crear `hooks/useAutenticacion.ts` con estado y métodos
- Crear `hooks/useSesion.ts` para verificar token al iniciar
- Crear `screens/PantallaLogin.tsx` con formulario y validación
- Crear `screens/PantallaRegistro.tsx` con formulario y validación
- Integrar persistencia con AsyncStorage
- Conectar con `ContextoAutenticacion` y `NavegadorRaiz`

### Commits de esta fase
```
feat: crear tabla usuarios y endpoints de registro y login en el backend
feat: implementar servicioAutenticacion con métodos login y registro
feat: crear hook useAutenticacion con manejo de estado y errores
feat: implementar PantallaLogin con formulario y validación
feat: implementar PantallaRegistro con formulario y validación
feat: agregar persistencia de sesión con AsyncStorage
feat: integrar autenticación con NavegadorRaiz y ContextoAutenticacion
```

### Criterio de completado
El usuario puede registrarse, iniciar sesión, cerrar sesión y la sesión persiste al reabrir la app.

---

## Fase 5 — Feed con IA
**Rama:** `feature/tk-feed-ia`
**Spec:** `.kiro/specs/feed-ia/tasks.md` + `.kiro/specs/ia-generacion/tasks.md`
**Estado:** `[x] Completado`
**Dependencia:** Fase 1 (backend) + Fase 4 (autenticación)

### Qué hacer
**Backend (`backend/src/`) — Generación IA:**
- Crear `services/servicioDeepSeek.ts` con integración a DeepSeek API
- Crear `services/servicioPublicacionesIA.ts` con validación, sanitización y prevención de duplicados
- Crear `cron/cronGenerador.ts` con ejecución horaria y lock anti-concurrencia
- Crear `utils/loggerGeneracion.ts` para registro de cada ciclo

**Backend (`backend/src/`) — Endpoints:**
- Crear tabla `publicaciones` en MySQL
- Crear `routes/publicaciones.rutas.ts`: `GET /api/publicaciones`, `GET /api/publicaciones/:id`
- Emitir evento WebSocket `nuevas_publicaciones` al generar desde `sockets/`

**Mobile (`mobile/src/`):**
- Crear tipos `Publicacion`, `RespuestaFeed` en `types/`
- Crear `services/servicioPublicaciones.ts`
- Crear `hooks/useFeed.ts` con paginación y scroll infinito
- Crear `hooks/usePublicacionesNuevas.ts` para WebSocket
- Crear componentes en `components/`: `TarjetaPublicacion`, `InsigniaIA`, `BannerNuevasPublicaciones`, `CargadorFeed`
- Crear `screens/PantallaFeed.tsx` con FlatList, pull-to-refresh y banner de tiempo real
- Crear `screens/PantallaDetalle.tsx` con contenido completo

### Commits de esta fase
```
feat: crear tabla publicaciones y endpoints de feed paginado
feat: implementar servicioDeepSeek con integración a DeepSeek API
feat: crear cron job de generación automática de publicaciones cada hora
feat: agregar validación, sanitización y prevención de duplicados en publicaciones IA
feat: implementar servicioPublicaciones y hook useFeed con paginación
feat: crear TarjetaPublicacion, InsigniaIA y BannerNuevasPublicaciones
feat: implementar PantallaFeed con scroll infinito y actualización en tiempo real
feat: implementar PantallaDetalle con contenido completo de publicación
```

### Criterio de completado
El cron genera publicaciones cada hora. El feed las muestra paginadas. El banner aparece cuando llegan nuevas publicaciones en tiempo real.

---

## Fase 6 — Comentarios
**Rama:** `feature/tk-comentarios`
**Spec:** `.kiro/specs/comentarios/tasks.md`
**Estado:** `[x] Completado`
**Dependencia:** Fase 5 (necesita publicaciones para comentar)

### Qué hacer
**Backend (`backend/src/`):**
- Crear tabla `comentarios` con soporte de anidación y soft delete
- Crear `routes/comentarios.rutas.ts`: `GET /api/publicaciones/:id/comentarios`, `POST /api/publicaciones/:id/comentarios`, `DELETE /api/comentarios/:id`
- Emitir eventos WebSocket `nuevo_comentario` y `comentario_eliminado` desde `sockets/`

**Mobile (`mobile/src/`):**
- Crear tipos `Comentario`, `NuevoComentario` en `types/`
- Crear `services/servicioComentarios.ts`
- Crear `hooks/useComentarios.ts` con actualización optimista
- Crear `hooks/useComentariosEnTiempoReal.ts`
- Crear componentes en `components/`: `FormularioComentario`, `TarjetaComentario`, `RespuestasComentario`, `ListaComentarios`
- Integrar `ListaComentarios` en `screens/PantallaDetalle.tsx`

### Commits de esta fase
```
feat: crear tabla comentarios con anidación y soft delete
feat: implementar endpoints de comentarios con validación y autorización
feat: emitir eventos WebSocket al crear y eliminar comentarios
feat: crear servicioComentarios y hook useComentarios con actualización optimista
feat: implementar componentes de comentarios FormularioComentario y TarjetaComentario
feat: integrar comentarios en tiempo real en PantallaDetalle
```

### Criterio de completado
Los usuarios pueden comentar, responder y eliminar sus comentarios. Los comentarios aparecen en tiempo real para todos los usuarios en la misma publicación.

---

## Fase 7 — Notificaciones
**Rama:** `feature/tk-notificaciones`
**Spec:** `.kiro/specs/notificaciones/tasks.md`
**Estado:** `[x] Completado`
**Dependencia:** Fase 6 (las notificaciones se generan desde comentarios)

### Qué hacer
**Backend (`backend/src/`):**
- Crear tabla `notificaciones`
- Crear función `crearNotificacion` en `services/notificaciones.servicio.ts`, integrada en el módulo de comentarios
- Crear `routes/notificaciones.rutas.ts`: `GET /api/notificaciones`, `PATCH /api/notificaciones/:id/leida`, `PATCH /api/notificaciones/leer-todas`
- Emitir evento WebSocket `nueva_notificacion` al socket privado del usuario desde `sockets/`

**Mobile (`mobile/src/`):**
- Crear tipos de notificaciones en `types/`
- Crear `services/servicioNotificaciones.ts`
- Crear `ContextoNotificaciones` para el badge global
- Crear `hooks/useNotificaciones.ts`
- Crear `hooks/useNotificacionesEnTiempoReal.ts`
- Crear componentes en `components/`: `TarjetaNotificacion`, `BadgeNotificaciones`
- Crear `screens/PantallaNotificaciones.tsx`
- Integrar badge en el tab de notificaciones del `NavegadorPrincipal`

### Commits de esta fase
```
feat: crear tabla notificaciones y función de creación automática
feat: implementar endpoints de notificaciones con marcado de leídas
feat: emitir notificaciones en tiempo real al socket privado del usuario
feat: crear ContextoNotificaciones y hook useNotificaciones
feat: implementar TarjetaNotificacion y BadgeNotificaciones
feat: crear PantallaNotificaciones con lista y marcado de leídas
feat: integrar badge de notificaciones en tab de navegación
```

### Criterio de completado
El badge muestra el conteo de no leídas. Las notificaciones llegan en tiempo real. El usuario puede marcarlas como leídas.

---

## Fase 8 — Perfil de Usuario
**Rama:** `feature/tk-perfil-usuario`
**Spec:** `.kiro/specs/perfil-usuario/tasks.md`
**Estado:** `[x] Completado`
**Dependencia:** Fase 4 (autenticación) + Fase 6 (historial de comentarios)

### Qué hacer
**Backend (`backend/src/`):**
- Crear `routes/usuarios.rutas.ts`: `GET /api/usuarios/perfil`, `PATCH /api/usuarios/perfil`, `GET /api/usuarios/:id`, `GET /api/usuarios/:id/comentarios`
- Implementar lógica en `services/usuarios.servicio.ts` y `controllers/usuarios.controlador.ts`

**Mobile (`mobile/src/`):**
- Crear tipos de perfil en `types/`
- Crear `services/servicioPerfil.ts`
- Crear `hooks/usePerfil.ts` y `hooks/useHistorialComentarios.ts`
- Crear componentes en `components/`: `CabeceraPerfil`, `EstadisticasPerfil`, `FormularioEditarNombre`, `TarjetaHistorial`, `HistorialComentarios`
- Crear `screens/PantallaPerfil.tsx` con edición y cierre de sesión
- Crear `screens/PantallaPerfilPublico.tsx`
- Conectar navegación desde comentarios al perfil público

### Commits de esta fase
```
feat: implementar endpoints de perfil propio y perfil público
feat: crear servicioPerfil y hooks de perfil e historial
feat: implementar componentes de perfil con avatar de iniciales
feat: crear PantallaPerfil con edición de nombre y cierre de sesión
feat: crear PantallaPerfilPublico con historial de comentarios
feat: conectar navegación al perfil público desde comentarios
```

### Criterio de completado
El usuario puede ver y editar su perfil. Puede ver el perfil público de otros usuarios desde los comentarios.

---

## Resumen de fases

| Fase | Módulo              | Rama                          | Dependencias     |
|------|---------------------|-------------------------------|------------------|
| 1    | Bootstrap Backend   | `feature/tk-bootstrap-backend`| —                |
| 2    | UI Global           | `feature/tk-ui-global`        | —                |
| 3    | Navegación          | `feature/tk-navegacion`       | Fase 2           |
| 4    | Autenticación       | `feature/tk-autenticacion`    | Fases 1, 3       |
| 5    | Feed + IA           | `feature/tk-feed-ia`          | Fases 1, 4       |
| 6    | Comentarios         | `feature/tk-comentarios`      | Fase 5           |
| 7    | Notificaciones      | `feature/tk-notificaciones`   | Fase 6           |
| 8    | Perfil de Usuario   | `feature/tk-perfil-usuario`   | Fases 4, 6       |

## Regla para Kiro
Antes de empezar cualquier fase, leer el `tasks.md` del spec correspondiente.
Implementar exactamente lo que está documentado, sin agregar funcionalidades extra.
Al terminar cada fase, marcar el estado como `[x] Completado` en este archivo.
