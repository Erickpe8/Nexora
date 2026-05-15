# Diseño Técnico — Observabilidad de Plataforma

## Principio

La observabilidad es **transversal**: no pertenece a un solo feature de producto. Se implementa como **middleware**, **utilidades** y **convenciones** consumidas por `api-backend`, `ia-generacion` y `tiempo-real`.

## Correlación

- **HTTP**: `correlacionId` en AsyncLocalStorage (Node 20+) o equivalente ligero; propagación a servicios vía parámetro si ALS no está disponible.
- **Cron**: UUID por ejecución al inicio del job.
- **Socket**: `socket.id` + `usuarioId` solo para correlación operativa; evitar ruido INFO en cada mensaje de negocio.

## Health

- **Liveness**: proceso vivo (sin DB).
- **Readiness**: dependencias críticas para el tráfico real (MySQL recomendado).

## Métricas (fases)

1. Logs estructurados + duración por request.
2. Contadores en memoria exportables.
3. Integración Prometheus/Grafana cuando el despliegue lo requiera.

## Dependencias

Ver `requirements.md` para contratos HTTP y checklist.
