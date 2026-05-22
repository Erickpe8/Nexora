# Red social de noticias IA

## Objetivo

Convertir Nexora en una **plataforma social de noticias generadas exclusivamente por IA**, donde la comunidad no publica posts sino **conversa** (comentarios, respuestas, reacciones, guardados, seguimientos) sobre contenido automático. La experiencia debe sentirse como una mezcla de **X, Reddit y Facebook**, orientada a consumo e interacción en tiempo (casi) real.

## Problema actual detectado

Nexora tiene feed IA, comentarios anidados, reacciones, likes, notificaciones y perfiles básicos, pero **no cumple aún** el modelo social completo descrito: falta identidad `@username`, URLs de noticia, guardados, compartir, seguir usuarios/temas, menciones, hashtags, orden de comentarios, edición, recomendaciones/tendencias, imágenes/fuentes en noticias, mini-perfil hover y varias entidades de datos.

## Impacto del problema

Sin este modelo, el producto se percibe como un foro simple y no como una **red de noticias inteligente viva**. Limita retención, descubrimiento, identidad social y escalabilidad del engagement.

## Solución propuesta

Evolución por **fases** sobre el stack actual (**Node.js/Express + MySQL + Expo**, no Laravel): ampliar modelo de datos, API REST y Socket.IO, y UI mobile-first premium (modo oscuro). La IA sigue siendo la **única** creadora de publicaciones vía pipeline DeepSeek + cron.

## Alcance

- Solo IA crea publicaciones (cron + orquestador existente).
- Usuarios: comentar, responder, reaccionar, guardar, compartir (enlaces), seguir usuarios/temas, denunciar.
- Noticias: título, resumen, contenido expandible, categoría, etiquetas, slug URL, relevancia, fuente/imagen (progresivo).
- Perfiles: `@username` único, nametag en comentarios, historial de actividad.
- Feed: scroll infinito, polling/socket, búsqueda, tendencias (fases posteriores).
- Comentarios: árbol Reddit, likes, tiempo relativo, orden (fases posteriores).
- Moderación: denuncias + panel moderador (ya parcial).

## Fuera de alcance (v1 global)

- Publicaciones manuales de usuarios.
- Mensajería directa.
- Migración a Laravel (el backend actual es Express).
- Push nativas (solo in-app en v1).
- Reputación/karma completo (opcional fase tardía).

## Reglas de negocio

1. Ningún endpoint de usuario crea `publicaciones`.
2. `username` único, formato `[a-z0-9_]{3,30}`.
3. Cada noticia tiene `slug` único para URL/deep link.
4. Comentarios soft-delete; moderación puede ocultar.
5. Denuncia no implica culpabilidad automática.

## Arquitectura

Monorepo sin cambios: `backend/` API + Socket en `server.ts`; `mobile/` cliente; Vercel serverless sin socket (polling).

## Flujo técnico

1. Cron/orquestador genera lote IA → persiste noticia → emite `nuevas_publicaciones`.
2. Cliente feed paginado → detalle por id/slug → comentarios con socket o polling.
3. Interacciones optimistas en mobile → confirmación REST.

## Componentes involucrados

- Pipeline IA, publicaciones, comentarios, reacciones, notificaciones, usuarios, moderación, tiempo real.

## Backend

Express, MySQL, JWT, Socket.IO, migraciones incrementales.

## Mobile

Expo, React Navigation, NativeWind, hooks por dominio.

## WebSockets

`nuevas_publicaciones`, `nuevo_comentario`, `nueva_notificacion`, moderación. En Vercel: polling HTTP.

## IA y automatización

DeepSeek genera JSON de noticias; deduplicación hash; registro en `registros_generacion_ia`. Futuro: actualización de noticia, imágenes, clasificación tendencias.

## Modelo de datos (objetivo)

| Entidad | Estado |
|---------|--------|
| usuarios (+ username) | Fase 1 ✅ |
| publicaciones (+ slug, categoría, contenido, relevancia) | Fase 1 ✅ |
| comentarios / respuestas | Existe |
| reacciones / likes | Existe |
| seguidores | Fase 3 |
| publicaciones_guardadas | Fase 2 |
| temas / hashtags | Fase 4 |
| menciones | Fase 4 |
| notificaciones | Existe |

## API y contratos

Extender `/api/publicaciones`, `/api/usuarios`, nuevos `/api/guardados`, `/api/seguir`, etc. según fase.

## Eventos Socket.IO

Sin cambios de nombres; ampliar payloads si hace falta metadata de noticia.

## Validaciones

Sanitización HTML, límites de longitud, rate limit existente.

## Seguridad

JWT, moderador por `MODERADOR_IDS`, denuncias con deduplicación 24h.

## Rendimiento

Paginación feed/comentarios; índices en slug, username, creado_en.

## Escalabilidad futura

Cache Redis para trending; cola trabajos IA (SPEC `cola-trabajos-generacion-ia`); read replicas MySQL.

## Riesgos técnicos

- Socket.IO no en Vercel → UX degradada sin polling bien ajustado.
- Scope creep del brief único → mitigación con fases en `tasks.md`.

## Próximos SPECS recomendados

- `guardados-y-compartir`
- `seguimiento-usuarios-temas`
- `menciones-hashtags`
- `tendencias-recomendaciones`
- `cola-trabajos-generacion-ia`

# CONTEXTO PARA DESARROLLO

Stack real: **Express + MySQL + Expo**, no Laravel. Respetar `.kiro/steering/convenciones.md` (español, camelCase).

# PREGUNTAS PARA CONTINUIDAD DEL PROYECTO

1. ¿Prioridad de Fase 2: guardados o seguir usuarios?
2. ¿Imágenes de noticia vía URL externa o generación IA (DALL·E, etc.)?
3. ¿Mini-perfil hover solo en web o también bottom sheet en móvil?
