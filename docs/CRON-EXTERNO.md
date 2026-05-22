# Cron externo — Nexora

La automatización **no** depende de Vercel Cron (eliminado de `vercel.json`). Un planificador externo invoca endpoints HTTP protegidos; el backend Express encola trabajo pesado y responde rápido.

## Arquitectura

```
GitHub Actions (o VPS / Railway / Render)
        │  POST + Bearer CRON_SECRET
        ▼
Vercel / API Express
        │  /api/internal/cron/*
        ▼
cola_trabajos (MySQL)  ←── process-queue cada 5 min
        │
        ▼
Orquestador IA / tendencias / limpieza
        │
        ▼
cron_ejecuciones (historial)
```

## Endpoints

| Método | Ruta | Uso |
|--------|------|-----|
| POST | `/api/internal/cron/generate-news` | Generar noticias IA |
| POST | `/api/internal/cron/generate-news/enqueue` | Solo encolar IA |
| POST | `/api/internal/cron/update-trends` | Relevancia / tendencias |
| POST | `/api/internal/cron/cleanup-cache` | Limpiar registros antiguos |
| POST | `/api/internal/cron/update-metrics` | Snapshot de métricas |
| POST | `/api/internal/cron/process-recommendations` | Recomendaciones (stub v2) |
| POST | `/api/internal/cron/retrain-trends` | Reentrenamiento (stub v2) |
| POST | `/api/internal/cron/review-reported-content` | Denuncias pendientes |
| POST | `/api/internal/cron/process-queue` | **Drenar cola** (`?max=1-5`) |
| GET | `/api/internal/cron/executions` | Historial (`?limite=20`) |

Query `?modo=encolar` → **202** (rápido). `?modo=ejecutar` (default) → ejecuta y registra en `cron_ejecuciones`.

### Autenticación

```http
Authorization: Bearer <CRON_SECRET>
X-Cron-Origen: github-actions
```

- `CRON_SECRET`: mínimo 16 caracteres (recomendado 32+ aleatorio).
- `CRON_ORIGENES_PERMITIDOS`: lista opcional en env (por defecto incluye `github-actions`, `manual`, `vps`, etc.).

## Variables de entorno

| Variable | Dónde |
|----------|--------|
| `CRON_SECRET` | Vercel, Railway, `.env` local, GitHub Secrets |
| `CRON_ORIGENES_PERMITIDOS` | Opcional |
| `NEXORA_API_URL` | Solo GitHub Secrets (URL base sin `/api`) |

Ejemplo GitHub Secrets:

- `NEXORA_API_URL` = `https://nexora-ruddy-nine.vercel.app`
- `CRON_SECRET` = mismo valor que en Vercel

## GitHub Actions

Workflows en `.github/workflows/`:

| Workflow | Frecuencia |
|----------|------------|
| `cron-process-queue.yml` | Cada 5 min |
| `cron-generate-news.yml` | Cada 2 h (encola) |
| `cron-update-trends.yml` | Cada hora |
| `cron-update-metrics.yml` | Cada 6 h |
| `cron-cleanup-cache.yml` | Diario 04:00 UTC |
| `cron-review-reported.yml` | Diario 08:00 UTC |
| `cron-retrain-trends.yml` | Domingo 02:00 UTC |
| `cron-process-recommendations.yml` | Cada 4 h |

**Nota:** GitHub Actions no permite cron más frecuente que **5 minutos**. Para “cada minuto”, migrar a VPS (`crontab`), Railway Cron, Cloudflare Workers Cron o Temporal.

## Migración de base de datos

```bash
npm run migrar --prefix backend
```

Crea `cola_trabajos` y `cron_ejecuciones`.

## Prueba manual

```bash
curl -X POST "https://TU-DOMINIO/api/internal/cron/generate-news?modo=encolar" \
  -H "Authorization: Bearer TU_CRON_SECRET" \
  -H "X-Cron-Origen: manual"

curl -X POST "https://TU-DOMINIO/api/internal/cron/process-queue?max=1" \
  -H "Authorization: Bearer TU_CRON_SECRET" \
  -H "X-Cron-Origen: manual"
```

Script local: `npm run vercel:sembrar-feed` (usa el nuevo endpoint).

## Rutas legacy

`/api/cron/generar-ia` sigue funcionando con el mismo Bearer, pero está **deprecada**. Usar `/api/internal/cron/generate-news`.

## Migración futura

Solo cambia el invocador (URL + secret). Los endpoints y la cola MySQL permanecen iguales para Railway, Render, VPS, EventBridge o BullMQ.
