# Tareas — Red social noticias IA

## Fase 1 — Identidad y noticias enriquecidas (en curso)

- [x] SPEC `red-social-noticias-ia`
- [x] `username` único + migración + registro/perfil
- [x] `slug`, `categoria`, `contenido_expandido`, `relevancia` en publicaciones
- [x] Nametag `@usuario` en comentarios
- [x] Tarjeta feed: categoría, leer más, tiempo relativo, insignia tendencia
- [ ] Pantalla detalle: contenido expandido + fuente + relacionadas (stub)

## Fase 2 — Guardados + Compartir ✅

> SPEC: `.kiro/specs/guardados-compartir/`

- [x] Tabla `publicaciones_guardadas` + API + pantalla Guardados
- [x] Compartir noticia + contador + analytics
- [x] Compartir comentario (URL con ancla)
- [x] “Leer después” + feed de guardados
- [ ] Orden comentarios: recientes / populares (paralelo)
- [ ] Editar comentario (ventana 15 min) (paralelo)

## Fase 3 — Ranking inteligente (siguiente)

> SPEC: `.kiro/specs/ranking-inteligente/`

- [ ] Score heurístico en `GET /api/publicaciones?orden=ranking`
- [ ] Endpoint `/api/publicaciones/trending`
- [ ] Cron/job refresco relevancia desde engagement
- [ ] Mobile: tabs Para ti / Reciente / Tendencia
- [ ] Insignia “Explota” por velocidad de debate

## Fase 4 — Menciones + Hashtags

> SPEC: `.kiro/specs/menciones-hashtags/`

- [ ] Parser `@usuario` + notificación mención
- [ ] Parser `#tema` + páginas por hashtag
- [ ] Trending hashtags + búsqueda
- [ ] Autocomplete al componer comentario

## Fase 5 — Tendencias IA + recomendaciones

- [ ] Tendencias / destacadas en feed (cron + UI)
- [ ] Noticias relacionadas por etiquetas/categoría
- [ ] Recomendaciones por guardados/compartidos

## Fase 6 — Sistema social (followers) — al final

> SPEC: `.kiro/specs/sistema-social/`

- [ ] Tabla `seguimientos` + temas seguidos
- [ ] Feed “Siguiendo” solo con señales previas

## Fase 5 — IA avanzada

- [ ] Actualización automática de noticia (timeline)
- [ ] Imagen/fuente en generación
- [ ] Recomendaciones por intereses
- [ ] Moderación IA (spam/toxicidad) opcional

## Fase 6 — Pulido premium

- [ ] Mini tarjeta perfil (hover web / sheet móvil)
- [ ] Banner perfil
- [ ] Animaciones micro-interacción
- [ ] Cache trending (Redis) si escala
