# Ranking inteligente del feed (diferenciador Nexora)

## Objetivo

Que el feed **no sea solo cronológico**: ordenar noticias IA por señales de engagement y afinidad, para que Nexora se sienta “más inteligente que X” — la IA publica y el sistema **ordena el debate**.

## Identidad reforzada

> La IA publica. La comunidad debate. El sistema aprende.

## Problema

Con `ORDER BY creado_en DESC` el valor de guardados, compartidos, reacciones y comentarios no se refleja en descubrimiento. Las noticias que “explotan” no suben solas.

## Señales de ranking (v1 heurística)

| Señal | Fuente |
|-------|--------|
| Relevancia base | `publicaciones.relevancia` (cron tendencias) |
| Engagement reciente | reacciones + comentarios últimas 24–48 h |
| Viralidad | `compartidos_count` + eventos `compartidos_eventos` |
| Intención | guardados (`publicaciones_guardadas`) |
| Frescura | decay por edad (half-life ~12 h) |
| Afinidad usuario | categorías/etiquetas de guardados y shares (fase 1.1) |

## Fórmula v1 (documentada, ajustable)

```
score = (
  relevancia * 2
  + log(1 + total_reacciones) * 5
  + log(1 + total_comentarios) * 8
  + log(1 + compartidos_count) * 12
  + guardados_unicos_7d * 15
) * exp(-horas_desde_publicacion / 18)
```

## API

- `GET /api/publicaciones?orden=ranking` (default progresivo)
- `GET /api/publicaciones?orden=reciente` (escape hatch)
- `GET /api/publicaciones/trending` — top N últimas 24 h por score

## Mobile

- Feed principal usa `orden=ranking`
- Tab o filtro: **Para ti** / **Reciente** / **Tendencia**
- Insignia “Explota” cuando score > umbral y velocidad de comentarios alta

## Jobs / cron

- Reutilizar `actualizar_tendencias` para refrescar `relevancia` desde engagement
- Job opcional `recalcular_scores_feed` cada 15–30 min (GitHub Actions)

## Fuera de alcance v1

- ML embeddings / collaborative filtering
- Resumen de comentarios por IA (fase IA avanzada)
- Detección de polarización

## Dependencias

- Fase 13 Guardados + Compartir ✅
- Tablas `compartidos_eventos`, `publicaciones_guardadas`

## Criterio de aceptación

Dos noticias publicadas el mismo día: la que acumula más debate y shares aparece antes que una sin interacción, manteniendo frescura (no enterrar todo lo nuevo).
