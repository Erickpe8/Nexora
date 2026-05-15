# Tareas de implementación — Pipeline de generación IA

## Fase A — Invariantes sin cola

- [x] Documentar mutex / `enEjecucion` en cron si aplica; evitar solape.
- [x] Extraer `orquestadorGeneracionIA` desde `cronGenerador.ts` con misma firma externa.
- [x] Garantizar orden persistencia → `emit('nuevas_publicaciones')` con prueba manual o test.
- [x] Pasar `ejecucionId` a logs (`observabilidad-plataforma`).

## Fase B — Datos

- [ ] Migración: columnas trazabilidad en `publicaciones` (proveedor, version_prompt, hash, metadatos JSON).
- [ ] Tabla `versiones_prompt_ia` + carga inicial desde código existente DeepSeek.
- [ ] Tabla `registros_generacion_ia` (una fila por ejecución o por ítem; decidir en implementación).

## Fase C — API interna

- [ ] `POST /api/interno/ia/generar` con protección (API key / rol / solo desarrollo).
- [ ] Rate limit específico.

## Fase D — Colas (SPEC hermano)

- [ ] Implementar según `.kiro/specs/cola-trabajos-generacion-ia` cuando exista el SPEC.
