# Observabilidad de plataforma

## Objetivo

Establecer **observabilidad transversal** del backend Nexora: correlación de peticiones y jobs, logs estructurados, salud del servicio y presupuestos de rendimiento, para operar un sistema con **IA periódica**, **WebSockets** y **API REST** sin depender de un vendor APM en el día cero.

## Problema actual detectado

Tras analizar `api-backend`, `ia-generacion` y `tiempo-real`, falta un **estándar único** de trazabilidad entre: request HTTP, ejecución del cron DeepSeek y conexiones Socket.IO. Los incidentes (latencia IA, pool DB, fugas en logs) se diagnosticarían lentamente; no hay contrato de **health** ni guía de **rendimiento** por capa.

## Impacto del problema

- **MTTR** alto; dependencia de `console.log` ad hoc.
- **Riesgo de cumplimiento** si logs capturan PII o secretos (`gestion-configuracion-secretos`).
- **Escalado horizontal** imposible de razonar sin correlación entre instancias.
- **SLOs** no definibles sin métricas mínimas.

## Solución propuesta

- Middleware **correlacionId** (header `X-Correlacion-Id` o UUID) + registro de duración por request.
- Utilidad **`logger` JSON** única con deny-list de campos sensibles.
- Endpoints **`/api/salud`**, **`/api/salud/listo`**, **`/api/salud/vivo`** (nombres finales unificables en español por decisión de equipo).
- **`ejecucionId`** por corrida de cron IA; logs agregados al inicio/fin y alrededor de DeepSeek (duración, categoría de error, sin prompt completo).
- Socket: WARN en fallo de auth de handshake; gauge opcional de conexiones.

## Alcance

Logs estructurados, correlación HTTP, instrumentación cron+DeepSeek, health liveness/readiness, lineamientos de rendimiento por capa, relación con errores ya definidos en `api-backend`.

## Fuera de alcance

Implementación completa de OpenTelemetry/Prometheus en código; crash reporting RN; SIEM enterprise.

## Reglas de negocio

1. Nunca loguear secretos ni `Authorization` completo.
2. Producción: minimizar PII en logs; emails solo en modo debug explícito apagado en prod.
3. Health: sin trabajo pesado por scrape; readiness con query DB opcional y timeout corto.
4. Cron: cada ejecución loguea totales alineados a `ia-generacion` (generadas, descartadas, duplicadas).

## Arquitectura

Capa transversal **no dominio**: middleware + util + hooks en cliente HTTP DeepSeek y en arranque del job cron. Sin tablas de negocio nuevas en v1.

## Flujo técnico

### Caso feliz (HTTP)

1. Middleware lee/genera `correlacionId`.
2. Al terminar: status, duración ms, ruta, correlación.

### Caso feliz (cron IA)

1. `ejecucionId` UUID al inicio.
2. Log inicio → llamada DeepSeek con duración → persistencia agregada → log fin.

### Errores

Errores no controlados → manejador `api-backend`; stack solo servidor.

## Componentes involucrados

API Express, cliente Axios DeepSeek, `cron/`, `sockets/`, opcionalmente mobile (header correlación).

## Backend

Middleware `correlacion`, `registroPeticion`, `logger.ts`, `config/observabilidad.ts`, rutas `salud.rutas.ts`, instrumentación en servicios que llaman DeepSeek.

## Mobile

Opcional: interceptor Axios envía `X-Correlacion-Id` por pantalla o sesión para soporte extremo a extremo; sin secretos.

## WebSockets

Logs en handshake fallido; no loguear token; métrica opcional `conexionesActivas`.

## IA y automatización

Instrumentar **solo** duración, código HTTP agregado, resultado parseo OK/KO; asociar a `ejecucionId`; no almacenar prompts largos en logs.

## Modelo de datos

**N/A** en v1. Futuro: métricas externas o tabla agregada; no bloquear diseño actual.

## API y contratos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/salud` | Estado + versión + dependencias resumidas. |
| `GET` | `/api/salud/listo` | Liveness. |
| `GET` | `/api/salud/vivo` | Readiness (MySQL opcional). |

Sin secretos en respuesta.

## Eventos Socket.IO

**N/A** para producto. Diagnóstico solo vía logs servidor en handshake/errores.

## Validaciones

Rate limit suave en `/salud`; no exponer env completo en JSON de salud.

## Seguridad

Deny-list en serialización de logs; stdout para agregación infra; revisión PR contra PII.

## Rendimiento

- Objetivo alineado a specs existentes: API operaciones simples **menos de 500 ms** donde ya se documentó; logging **async** o no bloqueante; sampling en DEBUG alto volumen.
- Cron completo **menos de 30 s** según `ia-generacion`; si se acerca al límite, log WARN con `ejecucionId`.
- Health DB: timeout corto (orden 1–2 s) configurable por env.

## Escalabilidad futura

Prometheus exporter, OpenTelemetry, dashboards (p95 DeepSeek, error rate API, sockets), alertas SLO, sampling adaptativo.

## Riesgos técnicos

| Riesgo | Mitigación |
|--------|------------|
| I/O de logs | Niveles + sampling. |
| Health saturando pool | Liveness sin DB; readiness con timeout. |
| PII accidental | Lista permitida + lint/CI opcional. |

## Dependencias

| SPEC | Relación |
|------|----------|
| `api-backend` | Errores, prefijo `/api`, middlewares. |
| `ia-generacion` | Duración y conteos del pipeline. |
| `tiempo-real` | Volumen conexiones y auth. |
| `gestion-configuracion-secretos` | `LOG_NIVEL`, filtrado. |

## Cambios arquitectónicos generados

- **Aspecto transversal** de observabilidad reconocido como ciudadano de primera clase (no “log cuando acuerde el dev”).
- Expectativa de **correlación** entre HTTP y cron en el mismo proceso Node (hasta split de workers).

## Posibles problemas futuros derivados

- **Cardinality explosion** si se etiquetan métricas con `usuarioId` sin hashing.
- **Coste** de almacenamiento de logs si el body de error se vuelca entero.
- **Doble instrumentación** si se añade OTel más adelante sin retirar middleware duplicado.

## Próximos SPECS recomendados

1. **`estrategia-despliegue-alta-disponibilidad`** — múltiples réplicas API + sticky sessions o adapter Redis para Socket.IO; impacto directo en métricas y health.
2. **`pruebas-carga-y-perf`** — presupuestos formales, scripts k6 y umbrales de regresión.
3. **`privacidad-telemetria-mobile`** — si se envía correlación o analytics desde el cliente (RGPD/consentimiento).

## Checklist técnico

- [ ] `logger` JSON + niveles por `NODE_ENV`.
- [ ] Middleware correlación + duración.
- [ ] `ejecucionId` en cron y logs DeepSeek.
- [ ] Rutas salud con semántica documentada en código.
- [ ] (Opcional) Header correlación desde mobile.
- [ ] Documentar `LOG_NIVEL` en `gestion-configuracion-secretos` al añadir variable.

# CONTEXTO PARA DESARROLLO

1. Se construyó el marco conceptual de **observabilidad backend** unificada.
2. Se abordó la falta de **trazabilidad y salud** ante IA, sockets y API.
3. Se introduce correlación, health y presupuestos de **rendimiento** por capa sin nuevo modelo de datos.
4. Afectados: implementación futura en `servidor.ts`, middlewares, `cron/`, cliente DeepSeek, `sockets/`.
5. Dependencias NPM opcionales: ALS nativo; exporters en fase 2.
6. Riesgos pendientes: filtrado incompleto, cardinalidad de métricas, health mal configurado.
7. Limitaciones: sin proveedor APM elegido; sin trazas distribuidas mobile↔API hasta OTel.
8. Después: definir nombres finales de rutas; integrar métricas si hay réplicas.
9. Conservar: formato de error al cliente; correlación no sustituye autenticación.
10. Toda IA/dev debe coordinar con **`gestion-configuracion-secretos`** antes de loguear respuestas de proveedores o env.

# PREGUNTAS PARA CONTINUIDAD DEL PROYECTO

- ¿El **readiness** debe fallar si DeepSeek está caído pero MySQL OK (modo degradado solo feed nuevo)?
- ¿Se exigirá **traceparent** estándar W3C además de `X-Correlacion-Id` para interoperar con gateways?
- ¿Los logs de **prompt** quedarán solo en nivel DEBUG local y deshabilitados por compile-time en prod?
- ¿Quién posee el **budget** de cardinalidad de labels en métricas (equipo backend vs SRE)?
- ¿Habrá **política de retención** de logs por tipo (acceso vs aplicación vs auditoría moderación)?
- ¿El cron en segundo plano compartirá **pool DB** con requests HTTP y cómo se evita inanición bajo carga?
- ¿Se consolidará **un solo formato** de timestamp (UTC ISO8601) en todos los logs?
- ¿Debe el cliente móvil mostrar **ID de correlación** en pantalla de error para soporte L1?
