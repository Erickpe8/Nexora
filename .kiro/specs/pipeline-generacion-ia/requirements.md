# Pipeline de generación IA

## Objetivo

Definir la **arquitectura evolutiva** del pipeline que genera publicaciones automáticas con IA en Nexora, garantizando continuidad de contenido, estabilidad operativa, validación previa a difusión, escalabilidad progresiva y sincronización en tiempo real con clientes móviles, **sin romper** el contrato actual de dominio (`publicaciones`, evento `nuevas_publicaciones`).

## Problema actual detectado

Hoy la generación está concentrada en **cron + servicio de IA + persistencia + emisión Socket** en un flujo relativamente lineal (`cronGenerador` → `publicacionesIA` → DeepSeek). Eso es válido para prototipo, pero genera:

- Acoplamiento fuerte entre **planificador** y **generación**.
- Tolerancia a fallos limitada (reintento principalmente en siguiente ciclo horario).
- Control de duplicados básico (p. ej. por título) sin trazabilidad rica de ejecución.
- Observabilidad dispersa (logs ad hoc frente a estándar en `observabilidad-plataforma`).
- Dificultad para escalar volumen o introducir **colas/workers** sin rediseño.
- **Sin versionado formal de prompts** en base de datos (el prompt vive en código/servicio DeepSeek).
- Riesgo de emitir eventos si la persistencia falla a mitad de lote si no hay transacciones claras por ítem.

## Impacto del problema

El pipeline IA es el **núcleo conceptual** del producto (“IA como generadora de conversación”). Si falla o degrada calidad: feed vacío o repetitivo, menor engagement, pérdida de identidad. Impacta retención, tiempo de sesión y percepción de comunidad viva.

## Solución propuesta

Evolucionar hacia un **pipeline por etapas desacoplables** (mismos procesos físicos pueden seguir en un solo Node al inicio):

1. **Planificador (scheduler)** — `node-cron`; sin solapamiento de jobs.
2. **Orquestador** — coordina categoría/prompt, límites, reintentos por ítem, agregación de resultados.
3. **Generador IA** — cliente DeepSeek; construcción de prompt; parseo a modelo de dominio.
4. **Validación de contenido** — reglas de negocio + anti-duplicado + palabras prohibidas / estructura.
5. **Persistencia** — commit por publicación o transacción acotada; **nunca** emitir socket de filas no confirmadas en DB.
6. **Distribución** — emisión Socket tras persistencia exitosa del lote o sublote acordado.
7. **Observabilidad** — `ejecucionId`, duraciones, conteos, errores categorizados (alineado a `observabilidad-plataforma`).

Cada etapa debe poder **extraerse** a worker/cola sin cambiar contratos móviles.

## Alcance

- Generación automática periódica; integración DeepSeek; control de prompts (código → BD en evolución).
- Validación inicial; persistencia MySQL; emisión Socket coherente con `tiempo-real` / `feed-ia`.
- Logging y métricas mínimas de generación; reintentos controlados a nivel de ítem o lote.
- Endpoint **interno** protegido para pruebas/disparo controlado (opcional en v1).

## Fuera de alcance

- Personalización por usuario, ranking inteligente del feed, recomendación algorítmica.
- Multi-model routing dinámico, fine-tuning propio, moderación automática avanzada previa a publicación (moderación rica queda en `moderacion-confianza-contenido` y futuros SPECS).

## Reglas de negocio

1. Solo el **sistema (IA)** crea publicaciones; los usuarios no crean hilos.
2. Temáticas permitidas: tecnología, programación, innovación, IA, startups, desarrollo de software, controversias tecnológicas razonables (coherente con `ia-generacion`).
3. Evitar duplicados recientes (título y/o **hash de contenido** cuando exista columna).
4. **Persistir antes de emitir**: los eventos Socket no transportan contenido que no exista en `publicaciones` con `id` válido.
5. Control de **frecuencia** (p. ej. ventana horaria; cantidad 3–5 por ejecución según spec actual).
6. **Reintentos** limitados por ítem ante error transitorio de red/parseo; backoff explícito en orquestador.
7. Errores registrados con contexto (`ejecucionId`, sin secretos).
8. Los **prompts** deben poder versionarse **sin** mezclar strings masivos en controladores (plantillas + registros de versión en BD en fase evolutiva).

## Arquitectura

```
node-cron (scheduler)
    → orquestadorGeneracionIA (ejecucionId)
        → servicioDeepSeek / generadorIA
        → servicioValidacionPublicacionIA
        → servicioPersistenciaPublicaciones
        → socketGateway.emit (solo tras commit OK del alcance definido)
        → observabilidad (logs / métricas)
```

La sala actual de feed global (`feed_global`) y el evento **`nuevas_publicaciones`** se mantienen como contrato salvo decisión explícita de versionar eventos en otro SPEC.

## Flujo técnico

### Caso feliz (lote horario)

1. Cron dispara una sola ejecución si no hay job en curso (mutex en proceso).
2. Orquestador genera `ejecucionId`, pide N publicaciones al generador.
3. Por cada ítem: validar → insertar fila → acumular en memoria para payload de socket.
4. Tras último insert OK del lote visible: emitir `nuevas_publicaciones` con `{ cantidad, publicaciones }` alineado a `arquitectura-monorepo`.
5. Registrar resumen en logs estructurados.

### Errores y degradación

- Fallo DeepSeek: log + contadores; no emitir evento con publicaciones vacías salvo política explícita de “heartbeat” (no recomendado).
- Fallo a mitad de lote: emitir solo si la política producto confirma “parcial OK”; por defecto **emitir solo publicaciones realmente insertadas** (subconjunto).
- Reintentos: máximo por ítem; no bloquear el hilo principal indefinidamente (timeout global ≤ 30 s alineado a `ia-generacion`).

## Componentes involucrados

| Capa | Rol |
|------|-----|
| Scheduler | Disparo temporal, anti-solape. |
| Orquestador | Secuencia, límites, agregación, `ejecucionId`. |
| Generador IA | DeepSeek, prompt, parseo JSON. |
| Validación | Reglas de negocio y calidad mínima. |
| Persistencia | MySQL `publicaciones`. |
| Socket gateway | `io.to('feed_global').emit(...)`. |
| Observabilidad | Trazas de ejecución. |

## Backend

- `cron/cronGenerador.ts` — solo scheduling y delegación al orquestador.
- `services/orquestadorGeneracionIA.servicio.ts` (nuevo, nombre alineado a convenciones) — pipeline.
- `services/deepseek.servicio.ts` — generación pura (sin persistencia mezclada si se refactoriza).
- `services/publicacionesIA.servicio.ts` — validación + insert (o dividir en validación + repositorio).
- `sockets` — emisión centralizada tras persistencia.
- Integración con `logger` / correlación según `observabilidad-plataforma`.

## Mobile

- Sin cambio de contrato: listeners de `nuevas_publicaciones`, banner / refetch (`feed-ia`, `tiempo-real`).
- Opcional futuro: `feed cache manager` local (AsyncStorage) — fuera de v1 del pipeline; documentar como mejora.

## WebSockets

- Mantener **`nuevas_publicaciones`** como evento principal de nuevas filas persistidas.
- Opcional **nuevo** evento `generacion_publicaciones_fallo` (backend → mobile) con payload mínimo `{ ejecucionId, razon, creadoEn }` para telemetría de UI no intrusiva — **solo si** producto quiere mostrar estado “feed puede estar retrasado”; requiere acordar para no duplicar ruido con banner genérico.

## IA y automatización

- **DeepSeek** como proveedor actual; plantillas de sistema en servicio dedicado; evolución a tabla `versiones_prompt_ia` (nombre tentativo en español) con `nombre`, `version`, `plantilla`, `activo`.
- **node-cron** como scheduler inicial; evolución a worker + cola (BullMQ/Redis) en fase 2.

## Modelo de datos

### Estado actual (referencia código)

Tabla **`publicaciones`**: `id`, `titulo`, `resumen`, `pregunta`, `etiquetas` (JSON), `generado_por_ia`, `creado_en`.

### Evolución recomendada (migraciones futuras)

| Evolución | Campos / tablas | Propósito |
|-----------|-----------------|-----------|
| Trazabilidad | `publicaciones.proveedor_ia`, `publicaciones.version_prompt`, `publicaciones.hash_contenido`, `publicaciones.metadatos_generacion` (JSON) | Auditoría, dedupe semántico, rollback de versión de prompt. |
| Versionado prompts | Tabla `versiones_prompt_ia` | Activar/desactivar plantillas sin deploy de lógica. |
| Logs por ejecución | Tabla `registros_generacion_ia` | `ejecucion_id`, `publicacion_id` nullable, `duracion_ms`, `exito`, `mensaje_error`, `tokens` nullable |

Los nombres finales de tablas/columnas deben seguir **español** en convención del proyecto al implementar.

## API y contratos

| Método | Ruta (patrón actual Nexora) | Descripción |
|--------|-----------------------------|-------------|
| `GET` | `/api/publicaciones` | Feed paginado (ya existente). |
| `GET` | `/api/publicaciones/:id` | Detalle (ya existente). |
| `POST` | `/api/interno/ia/generar` (propuesta) | Disparo controlado de generación; **solo** con auth interna (API key header, rol admin, o deshabilitado en producción pública). |

Formato de error estándar: `{ error: string, codigo: number }`.

## Eventos Socket.IO

| Evento | Dirección | Payload | Cuándo |
|--------|-----------|---------|--------|
| `nuevas_publicaciones` | backend → mobile | `{ cantidad, publicaciones[] }` | Tras persistencia confirmada del lote o sublote publicable. |
| `generacion_publicaciones_fallo` | backend → mobile (opcional) | `{ ejecucionId, razon, creadoEn }` | Fallo global de ejecución sin publicaciones nuevas (política producto). |

**Nota:** no usar `new_post_created` en código Nexora; el contrato canónico documentado en monorepo es **`nuevas_publicaciones`**.

## Validaciones

- Sanitización básica de texto; límites de título/resumen/pregunta/etiquetas (ya en `publicacionesIA.servicio`).
- Duplicados: título existente + futuro `hash_contenido`.
- Lista de keywords prohibidas (configurable por env o tabla).
- Estructura JSON de salida del modelo validada antes de insert.
- Rate limiting del endpoint interno y del propio orquestador (no spamear DeepSeek).

## Seguridad

- Secretos solo servidor (`gestion-configuracion-secretos`); no exponer plantillas completas ni prompts al cliente.
- Endpoint interno con capa de autorización fuerte o desactivación en prod.
- Logs sin contenido sensible completo de prompts en producción (truncado o hash).

## Rendimiento

- Presupuesto total de ejecución acorde a `ia-generacion` (p. ej. menos de 30 s por ciclo).
- Evitar bloqueos largos: timeouts en HTTP a DeepSeek; paralelismo **solo** si el proveedor y el pool DB lo soportan (por defecto secuencial para simplicidad).
- Tamaño de payload Socket: enviar solo campos necesarios para el banner/lista (no historial completo del lote si es grande).

## Escalabilidad futura

| Fase | Contenido |
|------|-----------|
| 1 (actual evolutivo) | Cron + proceso único + orquestador en proceso + logs estructurados. |
| 2 | Redis + BullMQ + workers de generación desacoplados del API HTTP. |
| 3 | Multi-proveedor, priorización por coste/calidad, scoring de engagement (con SPECS dedicados). |
| 4 | Generación contextual por métricas (con `analytics-engagement-feed` y gobernanza de privacidad). |

## Riesgos técnicos

| Riesgo | Mitigación |
|--------|------------|
| Dependencia de DeepSeek | Timeouts, circuit breaker ligero, proveedor alternativo en SPEC futuro. |
| Coste IA | Límite de tokens y de ítems por ejecución. |
| Spam semántico / repetición | Hash + filtros + diversidad de categoría en orquestador. |
| Eventos duplicados | Idempotencia de emisión por `ejecucionId` + conjunto de ids insertados. |
| Fallos silenciosos del cron | Health + alertas (`observabilidad-plataforma`). |

## Dependencias

| SPEC / artefacto | Relación |
|------------------|----------|
| `ia-generacion` | Reglas de negocio y volumen por hora. |
| `feed-ia` | Contrato de experiencia de feed. |
| `tiempo-real` | Socket, reconexión, salas. |
| `api-backend` | Prefijo `/api`, errores, rate limit. |
| `observabilidad-plataforma` | Correlación, logs, salud. |
| `gestion-configuracion-secretos` | Keys DeepSeek, flags de entorno. |
| `moderacion-confianza-contenido` | Evolución futura hacia moderación de salida IA (no v1 aquí). |

## Cambios arquitectónicos generados

- La generación IA deja de modelarse como “un solo archivo que lo hace todo” y pasa a **pipeline explícito** con límites de responsabilidad.
- Se prepara **versionado de prompts** y **registros de ejecución** sin obligar implementación inmediata de todas las tablas.
- Se fija la regla **persistir antes de emitir** como invariante de integridad del producto.

## Posibles problemas futuros derivados

- Complejidad operativa al añadir Redis/colas.
- Necesidad de **idempotencia** distribuida si hay varios workers.
- Presión por **ranking** y **moderación automática** que cruza con otros dominios.

## Próximos SPECS recomendados

1. **`cola-trabajos-generacion-ia`** — BullMQ, idempotencia, dead-letter, réplicas.
2. **`versionado-prompts-ia`** — esquema `versiones_prompt_ia`, rollback, pruebas A/B éticas.
3. **`sistema-ranking-feed`** — cuando el volumen supere lectura cronológica simple.
4. **`analytics-engagement-feed`** — señales para fase 4 del pipeline (sin PII indebida).
5. **`moderacion-salida-ia`** — acoplamiento controlado con `moderacion-confianza-contenido` para retirada o marcado.
6. **`escalabilidad-socket-io-ha`** — sticky sessions o Redis adapter al escalar API horizontalmente.

## Checklist técnico

- [ ] Extraer mutex / anti-solape de cron si no está explícito.
- [ ] Crear `orquestadorGeneracionIA` y mover coordinación fuera de `cronGenerador` donde corresponda.
- [ ] Asegurar orden **insert → emit** por política de lote; tests de regresión.
- [ ] Añadir `ejecucionId` a logs de generación (integración observabilidad).
- [ ] Diseñar migración incremental de columnas en `publicaciones` (proveedor, version_prompt, hash).
- [ ] Tabla `versiones_prompt_ia` + semilla inicial (opcional fase).
- [ ] Tabla `registros_generacion_ia` (opcional fase).
- [ ] Endpoint interno protegido o feature flag.
- [ ] Documentar en `arquitectura-monorepo.md` si se añade evento opcional de fallo.

# CONTEXTO PARA DESARROLLO

1. Se diseñó el **pipeline evolutivo** de generación IA como arquitectura de referencia para Nexora.
2. Se formalizó el problema del **monolito cron+servicio** y la ruta de desac acoplamiento por etapas.
3. Se reafirma **persistencia antes de eventos Socket** y el uso del evento canónico **`nuevas_publicaciones`** (no `new_post_created`).
4. Afectan principalmente **backend** (`cron`, servicios IA, sockets) y de forma indirecta **mobile** (contratos de eventos).
5. Nuevas dependencias futuras opcionales: Redis, BullMQ; tablas nuevas para prompts y logs de ejecución.
6. Riesgos pendientes: coste IA, duplicados semánticos, emisiones duplicadas si hay múltiples instancias sin cola.
7. Limitaciones: fase 1 puede seguir en un solo proceso Node; no exige cola el día uno.
8. Desarrollar después: orquestador real, migraciones de columnas, SPEC de cola, SPEC de versionado de prompts.
9. Conservar: “solo IA crea publicaciones”; contrato `nuevas_publicaciones` y sala `feed_global` hasta decisión contraria documentada.
10. Toda IA/dev debe leer **`ia-generacion`**, **`feed-ia`**, **`tiempo-real`** y este SPEC antes de refactorizar `cronGenerador` o `publicacionesIA`.

# PREGUNTAS PARA CONTINUIDAD DEL PROYECTO

- ¿Se permitirá **conmutación dinámica** de proveedor (DeepSeek ↔ otro) por configuración sin redeploy?
- ¿Habrá **fallback** automático entre modelos del mismo proveedor ante rate limit?
- ¿Se almacenarán **embeddings** para deduplicación semántica o basta hash de texto normalizado?
- ¿**Redis** será obligatorio para dedupe de ventana corta antes de insertar?
- ¿Cómo se define **observabilidad distribuida** cuando el worker deje de compartir proceso con el API?
- ¿Se introduce un **score de calidad** por publicación antes de mostrarla (y quién lo calcula)?
- ¿Las publicaciones IA tendrán **estado** (`borrador` | `publicada`) visibles solo en backend hasta aprobación manual?
- ¿Se requiere **moderación automática** del texto IA antes del insert (LLM secundario o listas)?
- ¿La generación contextual por engagement requerirá **consentimiento explícito** de telemetría en mobile?
- ¿El plan de **Socket.IO multi-instancia** será Redis adapter + sticky o sesiones stateless solo para feed?
- ¿Los **reintentos** incrementarán coste duplicado y cómo se detectan respuestas idénticas del proveedor?
- ¿Existirá **rollback** de una versión de prompt defectuosa sin borrar publicaciones ya publicadas?
- ¿Se guardará **snapshot del prompt** por `publicacion_id` para auditoría legal?
- ¿Cómo se evita **saturación temática** (p. ej. máximo N posts seguidos de la misma etiqueta)?
- ¿El scheduler seguirá **centralizado** en un solo pod o se necesitará **leader election** al escalar?
