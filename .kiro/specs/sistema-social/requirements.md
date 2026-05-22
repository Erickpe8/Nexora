# Sistema social — Followers, temas y feed personalizado (Fase 3)

## Objetivo

Capa social profunda: **seguir usuarios y temas**, feed personalizado, actividad y recomendaciones — solo después de engagement (guardados/compartir) y descubrimiento (menciones/hashtags).

## Pre-requisito obligatorio

Checklist “red viva” en verde:

- [x] Comentarios anidados + likes
- [x] Notificaciones
- [x] Perfiles completos
- [x] Reacciones
- [x] Moderación
- [ ] Guardados + compartir (Fase 1)
- [ ] Menciones + hashtags (Fase 2)
- [ ] Realtime estable o polling documentado en producción

## Alcance resumido

| Entidad | Tabla |
|---------|--------|
| Seguir usuario | `seguimientos` (seguidor_id, seguido_id) |
| Seguir tema | `temas_seguidos` o `seguimientos_tema` |
| Feed Siguiendo | Query publicaciones de autores IA + actividad de seguidos en comentarios |
| Sugerencias | `usuarios_sugeridos`, `temas_sugeridos` (heurística v1, ML v2) |
| Actividad | `GET /api/usuarios/:id/actividad` |

## Fuera de alcance v1

- DMs, grupos, listas Twitter-style.

## Feed personalizado (v1 heurística)

1. Publicaciones IA en categorías de temas seguidos.
2. Boost por guardados/compartidos del usuario.
3. Mezcla 70% global trending / 30% personalizado.

## Criterio de aceptación

Usuario sigue a otro y ve actividad en tab “Siguiendo”; puede seguir tema `#startups` y filtrar feed.
