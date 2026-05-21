# Tareas de implementación — Pipeline de generación IA

## Fase A — Invariantes sin cola

- [x] Documentar mutex / `enEjecucion` en cron; evitar solape.
- [x] Extraer `orquestadorGeneracionIA` desde `cronGenerador.ts` con misma firma externa.
- [x] Garantizar orden persistencia → `emit('nuevas_publicaciones')`.
- [x] Pasar `ejecucionId` a logs (`observabilidad-plataforma`).

## Fase B — Datos

- [x] Migración: columnas trazabilidad en `publicaciones` (`proveedor_ia`, `version_prompt`, `hash_contenido`).
- [x] Tabla `versiones_prompt_ia` + carga inicial desde código existente DeepSeek.
- [x] Tabla `registros_generacion_ia` (una fila por ítem de ejecución).
- [x] Deduplicación por hash SHA-256 de contenido (además de título).

## Fase C — API interna

- [x] `POST /api/interno/ia/generar` con protección por API key (`X-Interno-Api-Key`).
- [x] Rate limit específico (5 disparos/hora).

## Fase D — Colas (SPEC hermano)

- [ ] Implementar según `.kiro/specs/cola-trabajos-generacion-ia` cuando exista el SPEC.
