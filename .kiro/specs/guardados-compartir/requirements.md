# Guardados + Compartir (Fase social 1)

## Objetivo

Fortalecer la **interacción inmediata** sobre noticias IA: permitir guardar publicaciones para revisitarlas, compartir enlaces profundos y registrar señales de interés real que alimenten recomendaciones y métricas internas — sin construir aún el grafo social (followers).

## Problema actual detectado

Nexora tiene feed, reacciones, comentarios y perfiles, pero **no** permite guardar noticias ni compartir de forma nativa. Eso limita retención, viralidad orgánica y datos para ranking (“contenido relevante para ti”).

## Impacto del problema

- Menor revisitación y tiempo en app.
- Sin señales explícitas de intención (guardar > scroll pasivo).
- La IA y el cron no pueden ponderar interés real del usuario.
- Deep links existen parcialmente pero no hay flujo UX de compartir.

## Solución propuesta

Módulo **Guardados + Compartir** en Express + MySQL + Expo:

- Tabla `publicaciones_guardadas` (usuario ↔ publicación, fecha, opcional colección “leer después”).
- Tabla o columnas `publicaciones.compartidos_count` + evento opcional `compartidos_eventos` para analytics.
- API REST autenticada + deep links por `slug`.
- Mobile: modal compartir, copiar URL, Web Share API, pantalla Guardados, acción en detalle y en tarjeta feed.

## Alcance

| Capacidad | Incluido |
|-----------|----------|
| Guardar / quitar guardado | Sí |
| Listar guardados paginados | Sí |
| Marcar “leer después” (flag o colección) | Sí |
| Compartir publicación (link + modal) | Sí |
| Compartir comentario (link ancla `#comentario-id`) | Sí v1 |
| Conteo de compartidos | Sí (incremento server-side al registrar share) |
| Copy URL al portapapeles | Sí |
| Analytics internas (tabla eventos) | Sí (mínimo: tipo, usuario, objetivo) |
| Feed de guardados en app | Sí |
| Notificación al guardar | No (v1) |

## Fuera de alcance (esta fase)

- Followers / following.
- Hashtags clicables y páginas por tema.
- Menciones `@usuario` en cuerpo de comentario (solo nametag visual existente).
- Push nativas.
- Compartir a redes con OG cards dinámicas en Vercel (mejora web fase posterior).

## Reglas de negocio

1. Solo usuarios autenticados guardan o registran compartidos.
2. Un usuario no puede guardar la misma publicación dos veces (UNIQUE `usuario_id, publicacion_id`).
3. Quitar guardado es idempotente.
4. `compartidos_count` solo incrementa vía `POST .../compartir` (no desde cliente directo).
5. URLs públicas usan `slug` cuando existe; fallback `?id=`.
6. Compartir comentario requiere que el comentario sea visible (no oculto por moderación).

## Arquitectura

```
mobile (TarjetaPublicacion, PantallaDetalle, PantallaGuardados)
    │ REST JWT
    ▼
backend/routes/publicaciones.rutas.ts (+ guardados.rutas.ts opcional)
    ▼
services/guardados.servicio.ts, compartir.servicio.ts
    ▼
MySQL: publicaciones_guardadas, compartidos_eventos (opcional)
```

Socket: opcional emitir `guardado_actualizado` (v2); v1 puede invalidar cache local en mobile.

## Flujo técnico

### Guardar

1. Usuario pulsa “Guardar” en feed o detalle.
2. `POST /api/publicaciones/:id/guardar` → INSERT o toggle.
3. Respuesta `{ guardado: true, guardadosTotal?: number }`.
4. Pantalla Guardados lista con `GET /api/usuarios/perfil/guardados?cursor=`.

### Compartir

1. Usuario abre modal Compartir.
2. Cliente construye URL: `{WEB_BASE}/noticia/{slug}` o deep link `nexora://publicacion/{id}`.
3. `POST /api/publicaciones/:id/compartir` registra evento + incrementa contador.
4. Web Share API / copiar portapapeles en cliente.

### Comentario compartible

1. URL: `{WEB_BASE}/noticia/{slug}#c-{comentarioId}`.
2. `POST /api/comentarios/:id/compartir` registra evento (sin duplicar contador de publicación si se prefiere métrica separada).

## Modelo de datos

### `publicaciones_guardadas`

| Campo | Tipo |
|-------|------|
| id | INT PK |
| usuario_id | INT FK |
| publicacion_id | INT FK |
| leer_despues | BOOLEAN DEFAULT FALSE |
| creado_en | DATETIME |

UNIQUE `(usuario_id, publicacion_id)`.

### `compartidos_eventos` (analytics)

| Campo | Tipo |
|-------|------|
| id | INT PK |
| tipo_objetivo | ENUM('publicacion','comentario') |
| objetivo_id | INT |
| usuario_id | INT NULL (anónimo web sin JWT = NULL) |
| canal | VARCHAR(32) — copy, web_share, deep_link |
| creado_en | DATETIME |

### `publicaciones`

- `compartidos_count INT DEFAULT 0` (denormalizado para feed).

## API (contratos)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/publicaciones/:id/guardar` | Toggle guardado |
| GET | `/api/usuarios/perfil/guardados` | Lista paginada |
| PATCH | `/api/publicaciones/:id/guardar` | Actualizar `leer_despues` |
| POST | `/api/publicaciones/:id/compartir` | Registrar share + contador |
| POST | `/api/comentarios/:id/compartir` | Registrar share comentario |
| GET | `/api/publicaciones/:id` | Incluir `guardadoPorMi`, `compartidosCount` |

## Mobile

- `ModalCompartir`, `BotonGuardar`, tab o entrada “Guardados” en perfil.
- `PantallaGuardados` con filtros: Todos / Leer después.
- Integrar en `TarjetaPublicacion` y `PantallaDetalle`.
- Deep linking: ruta `noticia/:slug` ya preparada en navegación.

## Señales para IA (futuro cercano)

- Cron/job nocturno: agregar por usuario top categorías de guardados + shares.
- Campo JSON `usuarios.intereses_inferidos` (fase posterior, no bloqueante v1).

## Criterios de aceptación

- [ ] Usuario guarda y desguarda sin error; estado persiste al recargar feed.
- [ ] Pantalla Guardados muestra solo sus publicaciones guardadas.
- [ ] Compartir incrementa contador y registra evento.
- [ ] Copy URL y Web Share funcionan en web y móvil.
- [ ] Enlace compartido abre detalle correcto (slug o id).
- [ ] Rate limit razonable en compartir (anti-spam).

## Dependencias

**Deben estar estables antes de implementar:**

| Fundamento | Estado Nexora |
|------------|---------------|
| Comentarios anidados (1 nivel) | ✅ |
| Notificaciones in-app | ✅ |
| Perfiles + `@username` | ✅ |
| Reacciones en publicaciones | ✅ |
| Moderación / denuncias | ✅ |
| Realtime | ⚠️ Socket local; **polling en Vercel** (aceptable v1) |
| Deep linking base | ✅ parcial — activar ruta noticia en share |
