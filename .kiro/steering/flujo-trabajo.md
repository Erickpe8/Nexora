# Flujo de Trabajo — Nexora

## Documentación y SPECS (prioridad)

- Estructura obligatoria de cada SPEC, secciones finales `# CONTEXTO PARA DESARROLLO` y `# PREGUNTAS PARA CONTINUIDAD DEL PROYECTO`, SDD y Gitflow extendido: **`.kiro/steering/metodologia-documentacion-specs.md`**.
- Plantilla vacía de SPEC: **`.kiro/templates/spec-template/requirements.md`**.

---

## Gitflow

| Rama | Uso |
|------|-----|
| `main` | Producción estable. Sin desarrollo directo. |
| `develop` | Integración. Las features deben integrarse aquí antes de release. |
| `feature/<nombre-feature>` | Desarrollo de capacidades. Origen: `develop`. |
| `fix/<nombre-fix>` | Correcciones no cubiertas por hotfix. |
| `hotfix/<nombre-hotfix>` | Producción crítica. |
| `release/<version>` | Congelación y preparación de versión (ej. `release/v1.0.0`). |

**Ejemplos de feature:** `feature/auth-system`, `feature/realtime-comments`, `feature/ai-post-generator`.

### Convivencia con roadmap numerado

El archivo `roadmap-desarrollo.md` puede seguir usando ramas del estilo:

```text
feature/NN-tk-nombre-funcionalidad
```

Donde `NN` es la fase en dos dígitos (`01` … `08`). Esto es **compatible** con Gitflow siempre que la rama nazca desde `develop` y tenga SPEC asociado.

Ejemplos históricos del proyecto:

- `feature/04-tk-autenticacion`
- `feature/05-tk-feed-ia`
- `feature/06-tk-comentarios`

---

## Commits

Formato obligatorio (Conventional Commits con alcance opcional):

```text
tipo(alcance): descripción breve
```

**Tipos permitidos:** `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `perf`.

**Ejemplos:**

```
feat(auth): implementar flujo de refresh de JWT
fix(socket): evitar listeners duplicados al reconectar
docs(spec): documentar arquitectura del feed con IA
refactor(api): separar capa de validación del controlador
chore(deps): actualizar dependencias de socket.io
test(comentarios): añadir pruebas al servicio de comentarios
perf(feed): reducir payload de listado paginado
```

### Reglas adicionales

- Sin punto final en la primera línea; máximo ~72 caracteres en la primera línea.
- Cuerpo del commit opcional separado por línea en blanco.
- La **descripción** puede estar en **español** si el equipo unifica el idioma de mensajes; `tipo` y `alcance` siguen la convención técnica estándar.

### Ejemplos a evitar

```
add login screen
fix bug
feat: Add user profile
```

---

## Por cada nueva funcionalidad

1. Crear o actualizar SPEC bajo `.kiro/specs/<modulo>/` según `metodologia-documentacion-specs.md`.
2. Crear rama desde `develop` (`feature/...` o `feature/NN-tk-...` según convención del equipo/roadmap).
3. Actualizar documentación y archivos `.kiro` cuando aplique.
4. Mantener coherencia con `arquitectura-monorepo.md` y `convenciones.md`.
5. Incluir pruebas cuando aplique.

---

## Comportamiento esperado de Kiro / agentes

Ver también `comportamiento-kiro.md`: simplicidad, no mezclar `mobile/` y `backend/`, no introducir dependencias sin justificación, y respetar el orden **SPEC primero** para cambios complejos.
