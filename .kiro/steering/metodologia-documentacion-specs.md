# Metodología de Documentación y SPECS — Nexora

Documento canónico para **Spec-Driven Development (SDD)**, **flujo de arquitectura vivo**, estructura obligatoria de SPECS, **Gitflow** y **commits**. Las herramientas y agentes deben tratar este archivo como referencia junto a `comportamiento-kiro.md`, `convenciones.md`, `flujo-trabajo.md` y `arquitectura-monorepo.md`.

La documentación **no es pasiva**: precede y guía el código, conecta módulos, expone riesgos y encadena el siguiente trabajo.

---

## Contexto del producto (recordatorio)

- **Mobile-first**; tecnología, programación e innovación.
- **Los usuarios no crean publicaciones**; la **IA** (DeepSeek + cron) genera temas de discusión de forma periódica.
- La IA es **generadora de conversación**, no sustituto humano; la interacción humana es **comentarios, respuestas y debate**.
- **Backend** = núcleo de negocio y secretos; **mobile** = consumidor desacoplado; **Socket.IO** = sincronización; evolución con **bajo acoplamiento** y **escalabilidad progresiva**.

---

## Flujo obligatorio de trabajo (cada SPEC)

Cada SPEC nuevo debe nacer de un ciclo explícito:

1. **Analizar** el ecosistema completo (SPECS existentes, código, contratos, operación).
2. **Detectar** vacíos técnicos, riesgos o deuda arquitectónica.
3. **Explicar** el problema actual y su **impacto** (operación, seguridad, coste, UX, evolución).
4. **Proponer** solución técnica (límites del módulo, contratos, datos, eventos).
5. **Actualizar** la arquitectura conceptual (qué cambia en el sistema; qué no rompe).
6. **Crear** el SPEC con dependencias cruzadas y **continuidad** hacia el siguiente paso.
7. **Derivar** qué **nuevos problemas** puede introducir la solución (segunda orden).
8. **Recomendar** **próximos SPECS** explícitos (no dejar el grafo de documentación aislado).

**Regla:** no se crean SPECS aislados; cada uno enlaza módulos existentes, riesgos del sistema y evolución del producto.

---

## Spec-Driven Development (oficial)

Antes de implementar un cambio complejo:

1. SPEC creado o actualizado bajo `.kiro/specs/<nombre-modulo>/`.
2. Problema e impacto explicitados; solución y alcance acotados.
3. Reglas de negocio y contratos (REST, Socket.IO, datos).
4. Riesgos, seguridad, **rendimiento** y escalabilidad futura.
5. **Cambios arquitectónicos generados** y **problemas futuros derivados** documentados.
6. **Próximos SPECS recomendados** listados.
7. Checklist y, si aplica, `tasks.md`.
8. **Después**, implementación en rama desde `develop`.

**Prohibido** como práctica habitual: programar primero y documentar después.

---

## Estructura obligatoria de cada SPEC

Cada `requirements.md` (SPEC principal del módulo) debe incluir **en este orden** las secciones `##` indicadas, con `# [Nombre del módulo]` como título principal.

| Orden | Sección |
|-------|---------|
| Título | `# [Nombre del módulo]` |
| 1 | `## Objetivo` |
| 2 | `## Problema actual detectado` |
| 3 | `## Impacto del problema` |
| 4 | `## Solución propuesta` |
| 5 | `## Alcance` |
| 6 | `## Fuera de alcance` |
| 7 | `## Reglas de negocio` |
| 8 | `## Arquitectura` |
| 9 | `## Flujo técnico` |
| 10 | `## Componentes involucrados` |
| 11 | `## Backend` |
| 12 | `## Mobile` |
| 13 | `## WebSockets` |
| 14 | `## IA y automatización` |
| 15 | `## Modelo de datos` |
| 16 | `## API y contratos` |
| 17 | `## Eventos Socket.IO` |
| 18 | `## Validaciones` |
| 19 | `## Seguridad` |
| 20 | `## Rendimiento` |
| 21 | `## Escalabilidad futura` |
| 22 | `## Riesgos técnicos` |
| 23 | `## Dependencias` |
| 24 | `## Cambios arquitectónicos generados` |
| 25 | `## Posibles problemas futuros derivados` |
| 26 | `## Próximos SPECS recomendados` |
| 27 | `## Checklist técnico` |

**Nota:** `## Backend`, `## Mobile`, `## WebSockets` e `## IA y automatización` detallan responsabilidades por capa; `## Componentes involucrados` resume el mapa o matriz de acoplamiento (evitar contradicciones entre secciones).

### Secciones finales obligatorias (nivel `#`)

1. `# CONTEXTO PARA DESARROLLO` — exactamente **10** puntos numerados (ver abajo).
2. `# PREGUNTAS PARA CONTINUIDAD DEL PROYECTO` — preguntas **no genéricas** que impulsen *solucionar → escalar → documentar → continuar*.

#### Contenido obligatorio de `# CONTEXTO PARA DESARROLLO`

1. Qué se construyó conceptualmente.
2. Qué problema se resolvió.
3. Qué cambios arquitectónicos aparecieron.
4. Qué módulos se vieron afectados.
5. Qué nuevas dependencias surgieron.
6. Qué riesgos quedan pendientes.
7. Qué limitaciones existen.
8. Qué debe desarrollarse después.
9. Qué decisiones deben conservarse.
10. Qué debe entender otra IA o desarrollador para continuar correctamente.

**Estilo:** técnico, resumido, orientado a continuidad entre agentes y humanos.

#### Contenido obligatorio de `# PREGUNTAS PARA CONTINUIDAD DEL PROYECTO`

Preguntas de nivel **Software Architect / Tech Lead / Backend senior**: vacíos, riesgos, escalabilidad, consistencia temporal, IA, seguridad, datos, DevOps. Evitar preguntas de relleno.

---

## Gitflow oficial

| Rama | Uso |
|------|-----|
| `main` | Producción estable. Sin desarrollo directo. |
| `develop` | Integración general. |
| `feature/<nombre-feature>` | Nuevas capacidades; origen `develop`; SPEC asociado. |
| `fix/<nombre-fix>` | Correcciones técnicas. |
| `hotfix/<nombre-hotfix>` | Críticos de producción. |
| `release/<version>` | Preparación de versión (ej. `release/v1.0.0`). |

Convivencia con `feature/NN-tk-nombre` del `roadmap-desarrollo.md`: válido si nace de `develop` y referencia SPEC.

---

## Convenciones de commits

```text
tipo(alcance): descripción breve
```

**Tipos:** `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`.

**Ejemplos:** `feat(feed): add ai ranking service`, `fix(socket): prevent duplicated listeners`, `docs(spec): create realtime architecture`, `refactor(api): separate validation layer`.

---

## Principios de arquitectura (refuerzo)

- Sin lógica monolítica en controladores; servicios desacoplados; capas claras.
- Secretos y reglas críticas solo en **backend**.
- Cada decisión debe justificar **mantenibilidad** o **escalabilidad** (incluso si la respuesta es “no escalar aún, pero dejar interfaz lista”).

---

## Artefactos por módulo en `.kiro/specs/`

- `requirements.md` — SPEC principal (esta estructura).
- `design.md` — secuencias, diagramas, decisiones detalladas.
- `tasks.md` — desglose de implementación (recomendado).

---

## Referencias cruzadas

- Plantilla: `.kiro/templates/spec-template/requirements.md`
- Monorepo y eventos: `.kiro/steering/arquitectura-monorepo.md`
- Convenciones de código: `.kiro/steering/convenciones.md`
- Comportamiento de agentes: `.kiro/steering/comportamiento-kiro.md`
- Ramas y commits: `.kiro/steering/flujo-trabajo.md`
