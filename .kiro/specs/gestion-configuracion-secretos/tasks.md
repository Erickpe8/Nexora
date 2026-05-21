# Tareas de Implementación — Gestión de Configuración y Secretos

## Backend

- [x] Módulo único de configuración validada (`shared/config/entorno.ts`).
- [x] Fail-fast en producción con detección de placeholders prohibidos.
- [x] Variables nuevas documentadas: `INTERNO_API_KEY`, `MODERADOR_IDS`, `MODERACION_UMBRAL_DENUNCIAS`, `MODERACION_AUTO_OCULTAR`.
- [x] Reemplazar accesos dispersos a `process.env` — todos pasan por `entorno`.

## Mobile

- [x] Verificar que no existen claves privadas en `mobile/src` (solo `EXPO_PUBLIC_API_URL`).
- [ ] Documentar canales de build (preview/prod) y URLs esperadas (pendiente cuando se configure EAS Build).

## Repositorio

- [x] `.env.example` actualizado con todas las variables y comentarios claros.
- [x] `.gitignore` en `backend/` y `mobile/` ya ignoran `.env`.
- [ ] Opcional: añadir gitleaks o equivalente en CI.

## Operación

- [ ] Documentar rotación de `JWT_SECRETO` y `DEEPSEEK_API_KEY` en runbook interno (pendiente doc ops).
