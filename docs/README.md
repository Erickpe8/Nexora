# Documentación general — Nexora

Documentos en la raíz `docs/` complementan `.kiro/` (specs y steering).

| Documento | Para quién | Contenido |
|-----------|------------|-----------|
| [onboarding.md](onboarding.md) | Nuevos desarrolladores | Clone, `.kiro/`, arranque local, buenas prácticas |
| [arquitectura.md](arquitectura.md) | Referencia rápida | Diagramas, tablas, contratos REST/Socket |
| [DEPLOY-VERCEL.md](DEPLOY-VERCEL.md) | Deploy producción | Railway MySQL, variables, cron IA, semilla 4 posts |

## Relación con `.kiro/`

- **Steering** = reglas estables del proyecto (arquitectura, convenciones, stack).
- **Specs** = requisitos y diseño por módulo (fuente de verdad del comportamiento).
- **docs/** = guías operativas y vistas resumidas; si hay conflicto con un spec, prevalece el spec del módulo.

Índice completo Kiro: [.kiro/README.md](../.kiro/README.md)
