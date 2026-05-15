# Tareas de Implementación — Gestión de Configuración y Secretos

## Backend

- [ ] Crear módulo único de configuración validada (`entorno.ts` o nombre alineado a convenciones del repo).
- [ ] Reemplazar accesos dispersos a `process.env` en servicios críticos (DB, JWT, DeepSeek).
- [ ] Fail-fast en producción con mensajes claros y sin fugas de secretos.

## Mobile

- [ ] Verificar que no existan claves privadas en el árbol `mobile/src`.
- [ ] Documentar canales de build (preview/prod) y URLs esperadas.

## Repositorio

- [ ] Auditar `.gitignore` en raíz, `backend/` y `mobile/`.
- [ ] Opcional: añadir gitleaks o equivalente en CI.

## Operación

- [ ] Documentar rotación de `JWT_SECRETO` y `DEEPSEEK_API_KEY` en runbook interno breve.
