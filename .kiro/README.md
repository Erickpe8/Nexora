# Documentación Kiro — Nexora

Índice de la metodología SDD (Spec-Driven Development) del monorepo.

## Steering (dirección técnica)

| Archivo | Contenido |
|---------|-----------|
| [project.md](steering/project.md) | Producto, visión, público objetivo |
| [arquitectura-monorepo.md](steering/arquitectura-monorepo.md) | Estructura mobile/backend, contratos REST y Socket.IO, deploy Vercel |
| [stack.md](steering/stack.md) | Tecnologías por capa |
| [convenciones.md](steering/convenciones.md) | Nomenclatura, idioma español, carpetas, componente `Icono` |
| [metodologia-documentacion-specs.md](steering/metodologia-documentacion-specs.md) | Flujo SDD, formato de SPECS, Gitflow |
| [comportamiento-kiro.md](steering/comportamiento-kiro.md) | Reglas para agentes IA |
| [flujo-trabajo.md](steering/flujo-trabajo.md) | Ramas, commits, flujo por feature |
| [roadmap-desarrollo.md](steering/roadmap-desarrollo.md) | Fases 1–12 y estado |

## Specs (módulos)

Cada carpeta tiene `requirements.md`, `design.md` y `tasks.md`.

| Spec | Ámbito |
|------|--------|
| [api-backend](specs/api-backend/) | REST, middlewares, rutas, salud |
| [autenticacion](specs/autenticacion/) | JWT, registro, login, módulo `mobile/src/modules/auth/` |
| [feed-ia](specs/feed-ia/) | Feed, paginación, búsqueda |
| [ia-generacion](specs/ia-generacion/) | Integración DeepSeek |
| [pipeline-generacion-ia](specs/pipeline-generacion-ia/) | Orquestador, cron, semilla post-deploy, Vercel Cron |
| [comentarios](specs/comentarios/) | Comentarios, respuestas, likes |
| [tiempo-real](specs/tiempo-real/) | Socket.IO (local); limitaciones en Vercel/web |
| [notificaciones](specs/notificaciones/) | Notificaciones in-app |
| [navegacion](specs/navegacion/) | Tabs, stacks, iconos outline |
| [perfil-usuario](specs/perfil-usuario/) | Perfil propio y público |
| [ui-global](specs/ui-global/) | Tokens, componentes base, `Icono` |
| [moderacion-confianza-contenido](specs/moderacion-confianza-contenido/) | Denuncias, moderación |
| [observabilidad-plataforma](specs/observabilidad-plataforma/) | Logs, `/api/salud` |
| [gestion-configuracion-secretos](specs/gestion-configuracion-secretos/) | `.env`, `MYSQL_URL`, Vercel |
| [red-social-noticias-ia](specs/red-social-noticias-ia/) | Visión social X+Reddit+FB, solo IA publica, fases 1–6 |
| [guardados-compartir](specs/guardados-compartir/) | Fase 13: guardados, compartir, leer después, analytics |
| [ranking-inteligente](specs/ranking-inteligente/) | Fase 14: feed por score, tendencia, “explota” |
| [menciones-hashtags](specs/menciones-hashtags/) | Fase 15: @usuario, #tema, descubrimiento |
| [sistema-social](specs/sistema-social/) | Fase 18: followers (después de señales y contenido) |

## Hooks (automatización)

| Hook | Uso |
|------|-----|
| [validar-typescript](hooks/validar-typescript.md) | Compilar backend y mobile |
| [validar-convenciones](hooks/validar-convenciones.md) | Nombres y estructura |
| [validar-estructura](hooks/validar-estructura.md) | Carpetas del monorepo |
| [actualizar-specs](hooks/actualizar-specs.md) | Sincronizar specs tras cambios |
| [actualizar-documentacion](hooks/actualizar-documentacion.md) | Checklist docs + steering |

## Templates

- [component-template](templates/component-template/)
- [hook-template](templates/hook-template/)
- [screen-template](templates/screen-template/)
- [service-template](templates/service-template/)
- [spec-template](templates/spec-template/)

## Documentación general (fuera de `.kiro`)

- [docs/README.md](../docs/README.md)
- [docs/onboarding.md](../docs/onboarding.md)
- [docs/arquitectura.md](../docs/arquitectura.md)
- [docs/DEPLOY-VERCEL.md](../docs/DEPLOY-VERCEL.md)
