# Gestión de configuración y secretos

## Objetivo

Unificar la **gestión de variables de entorno y secretos** en el monorepo (`backend/`, `mobile/`) con validación **fail-fast**, clasificación clara (secreto / config / público bundle) y coherencia con **observabilidad** (sin fugas en logs), soportando la arquitectura Nexora (JWT, MySQL, DeepSeek, Expo).

## Problema actual detectado

Los accesos dispersos a `process.env`, ejemplos `.env` desalineados con código y builds móviles con **URLs o flags incorrectos** generan incidentes evitables. No hay SPEC que cierre el ciclo **rotación de claves**, **separación Expo `EXPO_PUBLIC_*`** y **abort en producción** ante placeholders — vacío detectado al cruzar `api-backend`, `ia-generacion` y despliegue local Docker.

## Impacto del problema

- **Seguridad:** filtración de `DEEPSEEK_API_KEY` o JWT en logs/repos.
- **Disponibilidad:** arranque “silencioso” con config parcial que falla en runtime en producción.
- **Velocidad de equipo:** debugging por env incorrecto en CI/EAS.
- **Escalabilidad:** imposible rotar secretos con confianza sin contrato único.

## Solución propuesta

- Módulo único **`config` tipado** en backend validado al boot; única puerta de lectura de variables sensibles para servicios.
- Reglas: producción **aborta** si faltan claves críticas o si detecta placeholders (`cambia_este_secreto`, `tu_api_key_aqui`).
- Mobile: solo **`EXPO_PUBLIC_*`** en bundle; documentación explícita en `mobile/.env.example`.
- Matriz entorno → variables requeridas; alineación con `backend/.env.example` existente.

## Alcance

Validación centralizada, clasificación de variables, rotación documentada JWT/DeepSeek, integración conceptual con logs y health.

## Fuera de alcance

Implementación Vault/cloud concreta; pipeline CI completo (solo requisitos: no secretos en logs de build públicos).

## Reglas de negocio

1. Secretos nunca en repo ni en bundle mobile.
2. `NODE_ENV=production` + placeholders conocidos → proceso termina ≠ 0.
3. `EXPO_PUBLIC_API_URL` pública; HTTPS obligatorio en prod hacia API expuesta correctamente.
4. DeepSeek keys **solo** servidor.
5. Rotación `JWT_SECRETO` invalida sesiones salvo estrategia dual-key documentada en SPEC futuro.

## Arquitectura

```
.env / inyección orquestador
        ↓
  config validado (backend)
        ↓
 servicios (DB, JWT, DeepSeek, …)

Expo build → solo EXPO_PUBLIC_* → Axios baseURL
```

## Flujo técnico

### Arranque backend

Cargar env → validar esquema → export `config` inmutable → servicios importan `config`.

### Build mobile

Variables por canal EAS/CI → verificación de que no existen keys bajo `mobile/src`.

### Rotación DeepSeek

Nueva key en proveedor → actualizar secreto infra → rolling restart → revocar key antigua.

## Componentes involucrados

Backend config, todos los servicios que hoy leen env, mobile build, observabilidad (filtrado), Docker Compose.

## Backend

`config/entorno.ts` (o nombre alineado al repo), esquema de validación (manual, zod, etc.), integración en `servidor.ts` antes de listen.

## Mobile

Solo `EXPO_PUBLIC_API_URL`; documentación de canales; sin lógica de secretos.

## WebSockets

Si CORS u orígenes se externalizan a env, deben pasar por el mismo módulo `config` en servidor.

## IA y automatización

`DEEPSEEK_API_KEY`, `DEEPSEEK_URL`; timeouts y límites como **config no secreta** opcional (`DEEPSEEK_TIMEOUT_MS`).

## Modelo de datos

**N/A** para secretos. Opcional futuro: `feature_flags` no sensibles en DB — SPEC aparte.

## API y contratos

Ningún endpoint devuelve `process.env`. Salud puede exponer metadatos no sensibles (`observabilidad-plataforma`).

## Eventos Socket.IO

**N/A**; handshake usa JWT firmado con secreto solo en servidor.

## Validaciones

Tipos, URLs, `DB_PUERTO` numérico; lista de placeholders prohibidos en prod; variables requeridas por entorno documentadas.

## Seguridad

`.env` en `.gitignore`; permisos 600 en servidores; secret scanning CI recomendado; no loguear headers `Authorization`.

## Rendimiento

Validación al boot es **O(n)** en número de variables — insignificante; evitar lecturas repetidas de `process.env` en hot paths (usar objeto `config` cacheado).

## Escalabilidad futura

Vault, rotación automática, config por región, usuarios DB read-only para réplicas.

## Riesgos técnicos

| Riesgo | Mitigación |
|--------|------------|
| URL equivocada en store | Canales EAS separados; checklist release. |
| Defaults inseguros | Validación estricta prod. |
| Divergencia nombre variable | Single source `entorno.ts` + `.env.example` único. |

## Dependencias

| SPEC | Relación |
|------|----------|
| `api-backend` | JWT, CORS. |
| `ia-generacion` | DeepSeek. |
| `observabilidad-plataforma` | `LOG_NIVEL`, filtrado. |
| `autenticacion` | expiración/secreto JWT. |

## Cambios arquitectónicos generados

- **Configuración** tratada como **módulo de plataforma** con contrato explícito, no como detalle implícito de cada servicio.
- Precede y habilita observabilidad y despliegues reproducibles.

## Posibles problemas futuros derivados

- **Brecha** entre dev local (dotenv) y prod (inyección) si no se prueba el mismo esquema en staging.
- **Rotación JWT** masiva mal comunicada a usuarios móviles.
- **Sobrecarga** del archivo `config` si se meten feature flags sin SPEC dedicado.

## Próximos SPECS recomendados

1. **`feature-flags-y-config-remota`** — si se necesita tunear comportamiento sin redeploy (con auth y cache).
2. **`ci-cd-y-seguridad-pipeline`** — gitleaks, escaneo dependencias, variables por entorno en GitHub Actions / EAS.
3. **`estrategia-versionado-api-mobile`** — cuando `EXPO_PUBLIC_API_URL` deba apuntar a `/api/v2`.

## Checklist técnico

- [ ] Implementar módulo `config` validado y migrar lecturas dispersas.
- [ ] Fail-fast producción con mensajes sin fugas.
- [ ] Auditar `.gitignore`; alinear `mobile/.env.example`.
- [ ] Runbook rotación JWT y DeepSeek.
- [ ] Coordinar variable `LOG_NIVEL` con `observabilidad-plataforma`.

# CONTEXTO PARA DESARROLLO

1. Se construyó el marco de **configuración y secretos** como capa de plataforma.
2. Se resolvió el vacío de **contrato único y validación** entre backend y mobile Expo.
3. Aparece un **punto único de verdad** para env en servidor y reglas claras para bundle.
4. Afectados: arranque backend, builds mobile, futuros sockets CORS parametrizados, logs.
5. NPM opcional: zod/io-ts para esquema; resto sin dependencia obligatoria.
6. Riesgos: desalineación dev/prod, rotaciones no planificadas, logs filtrados incompletamente.
7. Limitaciones: sin vault concreto; sin matriz legal por jurisdicción.
8. Después: implementar `config`; añadir tests de arranque con env inválida.
9. Conservar: nombres en `backend/.env.example`; cualquier rename actualiza README + SPECS.
10. Ninguna IA/dev debe asumir valores reales de `.env`; solo `.env.example` y este SPEC.

# PREGUNTAS PARA CONTINUIDAD DEL PROYECTO

- ¿Se adoptará **Zod** (u otro) como estándar único de validación de env para compartir tipos con front interno?
- ¿El backend en Docker local debe **arrancar sin DeepSeek** si el cron está desactivado por flag `CRON_IA_HABILITADO=false`?
- ¿Habrá **secretos rotativos** (JWT signing keys múltiples) antes del primer lanzamiento a tienda?
- ¿EAS usará **perfiles** distintos para `preview` vs `production` con validación en CI de que no se cruzan URLs?
- ¿Se separará **usuario MySQL migraciones** vs **runtime** en variables distintas?
- ¿Cómo se versionará la política de **placeholders prohibidos** cuando se añadan nuevas integraciones (email, push)?
- ¿Debe existir **checksum** del archivo de config en runtime para detectar tampering (amenaza baja pero coste bajo)?
- ¿Quién aprueba el **cambio de `JWT_EXPIRACION`** respecto a sesión móvil y refresh (SPEC futuro)?
