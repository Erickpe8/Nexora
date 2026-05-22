# Tareas — Red social noticias IA

## Fase 1 — Identidad y noticias enriquecidas (en curso)

- [x] SPEC `red-social-noticias-ia`
- [x] `username` único + migración + registro/perfil
- [x] `slug`, `categoria`, `contenido_expandido`, `relevancia` en publicaciones
- [x] Nametag `@usuario` en comentarios
- [x] Tarjeta feed: categoría, leer más, tiempo relativo, insignia tendencia
- [ ] Pantalla detalle: contenido expandido + fuente + relacionadas (stub)

## Fase 2 — Guardados + Compartir (prioridad estratégica)

> SPEC dedicado: `.kiro/specs/guardados-compartir/`

- [ ] Tabla `publicaciones_guardadas` + API + pantalla Guardados
- [ ] Compartir noticia (deep link + Web Share API + contador)
- [ ] Compartir comentario (URL con ancla)
- [ ] “Leer después” + feed de guardados
- [ ] Analytics `compartidos_eventos`
- [ ] Orden comentarios: recientes / populares (paralelo opcional)
- [ ] Editar comentario (ventana 15 min) (paralelo opcional)

## Fase 3 — Menciones + Hashtags

> SPEC dedicado: `.kiro/specs/menciones-hashtags/`

- [ ] Parser `@usuario` + notificación mención
- [ ] Parser `#tema` + páginas por hashtag
- [ ] Trending hashtags + búsqueda
- [ ] Autocomplete al componer comentario
- [ ] Tendencias / destacadas en feed
- [ ] Noticias relacionadas por etiquetas/categoría

## Fase 4 — Sistema social (followers)

> SPEC dedicado: `.kiro/specs/sistema-social/`

- [ ] Tabla `seguimientos` (usuario-usuario)
- [ ] Tabla `temas_seguidos`
- [ ] Feed “Siguiendo” / filtro por tema
- [ ] Usuarios y temas sugeridos
- [ ] Actividad de usuarios

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
