# Tareas — Guardados + Compartir

**Rama sugerida:** `feature/13-guardados-compartir`  
**Spec:** `requirements.md`

## Backend — Base de datos

- [x] Migración: tabla `publicaciones_guardadas`
- [x] Migración: tabla `compartidos_eventos`
- [x] Migración: columna `publicaciones.compartidos_count`
- [ ] Índices: `(usuario_id, creado_en)`, `(publicacion_id)`

## Backend — Servicios

- [x] `guardados.servicio.ts`: toggle, listar, actualizar `leer_despues`
- [x] `compartir.servicio.ts`: registrar evento, incrementar contador, validar visibilidad comentario
- [x] Extender mapper de publicación: `guardadoPorMi`, `compartidosCount`

## Backend — API

- [x] `POST /api/publicaciones/:id/guardar` (toggle)
- [x] `PATCH /api/publicaciones/:id/guardar` body `{ leerDespues: boolean }`
- [x] `GET /api/usuarios/perfil/guardados` paginado
- [x] `POST /api/publicaciones/:id/compartir` body `{ canal?: string }`
- [x] `POST /api/comentarios/:id/compartir`
- [x] Rate limit: compartir 60/hora por usuario
- [ ] Tests manuales documentados en `docs/`

## Mobile — Servicios y hooks

- [x] `servicioEngagement.ts` (guardar + compartir)
- [x] `useGuardados.ts` (lista + paginación)
- [x] `useGuardarPublicacion.ts` (toggle en tarjeta)

## Mobile — UI

- [x] `AccionesEngagement` (guardar + leer después + compartir)
- [x] `ModalCompartir` (copiar URL, Web Share, WhatsApp, X, Facebook)
- [x] Integrar en `TarjetaPublicacion`
- [x] Integrar en `PantallaDetalle`
- [x] `PantallaGuardados` + entrada desde `PantallaPerfil`
- [x] Filtro “Leer después”
- [x] Compartir en `TarjetaComentario`

## Mobile — Deep links

- [x] Ruta `noticia/:slug` en linking config
- [x] Resolver slug → `PantallaDetalle`
- [ ] Soporte hash `#c-{id}` scroll a comentario (web; fase 1.1)

## Analytics internas

- [ ] Endpoint admin futuro o query SQL documentada para top compartidos/guardados
- [ ] Log estructurado en `registro` al compartir (correlación opcional)

## Documentación

- [ ] Actualizar `docs/arquitectura.md` tablas nuevas
- [ ] Actualizar `.kiro/steering/roadmap-desarrollo.md` Fase 13 completada al terminar

## Criterio de completado

Usuario puede guardar noticias, ver su lista, compartir con URL funcional y el backend registra eventos + contador sin romper feed existente.
