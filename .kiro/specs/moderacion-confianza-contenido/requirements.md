# Moderación y confianza de contenido

## Objetivo

Introducir un **módulo transversal de confianza** que gobierne abuso y calidad percibida sobre **comentarios** (UGC permitido) y, excepcionalmente, **publicaciones generadas por IA**, sin romper la regla de producto: **los usuarios no crean publicaciones**; la IA **genera la conversación**; las personas **debaten** en hilos.

## Problema actual detectado

Existen SPECS de **comentarios** y **tiempo real**, pero no hay un **contrato unificado** para denuncias, visibilidad forzada, auditoría ni rol moderador. El crecimiento de la comunidad expone: brigading de denuncias, comentarios tóxicos sin flujo de revisión, y desalineación entre **REST** (fuente de verdad) y **Socket.IO** (vista eventualmente consistente).

## Impacto del problema

- **Producto:** pérdida de confianza, abandono de debates IA-driven.
- **Operación:** incidentes sin runbook ni modelo de datos de denuncias.
- **Legal/compliance:** retención y trazabilidad indefinidas si no se diseñan estados y acceso.
- **Ingeniería:** riesgo de parches ad hoc en controladores que mezclen moderación con CRUD de comentarios.

## Solución propuesta

Definir **entidad `denuncias`**, estados de **moderación en `comentarios`**, **API REST** acotada y **eventos Socket.IO** de visibilidad (`comentario_oculto` / `comentario_restaurado`), con servicios dedicados (`servicioDenuncias`, `servicioModeracion`) y autorización explícita para rol moderador (futuro inmediato). La fuente de verdad permanece en **MySQL**; los sockets solo notifican.

## Alcance

- Denuncia de comentarios por usuario autenticado.
- Estados de visibilidad y resolución de denuncias; preparación de PATCH moderador.
- Eventos en sala por `publicacionId`.
- Tabla e índices documentados; anti-duplicado y rate limit de denuncias.

## Fuera de alcance

- Clasificación automática de texto con LLM en v1.
- Panel web admin completo; CRM legal; eliminación física masiva de historial IA salvo política explícita futura.
- Cambiar el modelo “solo IA crea posts”.

## Reglas de negocio

1. Los usuarios **no publican posts**; moderación de publicación solo por **riesgo/calidad IA** o política editorial excepcional (contrato aparte si se activa).
2. Denuncia no implica culpabilidad: estados `pendiente` → revisión → resolución.
3. Respetar **soft-delete** y reglas del autor en `comentarios`; la moderación añade **ocultamiento** con auditoría, no reemplazar silenciosamente al autor sin criterio documentado.
4. IA: lotes inválidos se descartan antes de persistir (`ia-generacion`); moderación de comentarios no re-clasifica prompts.

## Arquitectura

```
Mobile → POST denuncia → API → MySQL (denuncias, comentarios)
                    ↓
              Transacción visibilidad
                    ↓
         Socket emit a sala publicacionId
```

Acoplamiento permitido: lectura de `comentarios` por FK lógica; no queries cruzadas en controladores — solo servicios.

## Flujo técnico

### Caso feliz

1. Usuario autenticado envía `POST /api/comentarios/:id/denuncias` con `motivo` y `detalle` opcional.
2. Validación JWT, existencia del comentario, anti-duplicado en ventana.
3. Inserción `denuncias` estado `pendiente`; respuesta 201.

### Moderación (humana o umbral futuro)

1. `PATCH` moderador actualiza `estado_moderacion` del comentario.
2. Commit + emisión `comentario_oculto` o `comentario_restaurado`.

### Errores y degradación

401/404/409 según tabla común; si el socket falla, el cliente **refetch** comentarios al recuperar foco.

## Componentes involucrados

| Subsistema | Papel |
|------------|--------|
| API REST | CRUD denuncias, PATCH moderación. |
| MySQL | Persistencia y estados. |
| Socket.IO | Sincronización de visibilidad por publicación. |
| Mobile | UX denuncia y listeners. |
| Auth | JWT usuario; rol moderador futuro. |

## Backend

- Rutas: `moderacion.rutas.ts`, anidamiento bajo `comentarios` para POST denuncia.
- Controladores: orquestación mínima.
- Servicios: `servicioDenuncias`, `servicioModeracion`; transacciones en ocultamiento.
- Middleware: `requiereRolModerador` (flag entorno en dev).

## Mobile

- `modal-denuncia-comentario` o equivalente; `useDenuncias`; `servicioModeracion`.
- Actualizar lista de comentarios ante eventos de ocultamiento; sin lógica de permisos moderador hasta exista rol en token o endpoint dedicado.

## WebSockets

- Salas por `publicacionId` ya alineadas con `tiempo-real` / `comentarios`.
- Nuevos eventos solo de visibilidad; no sustituir GET inicial.

## IA y automatización

**N/A** para clasificación de comentarios en v1. El cron de IA no se modifica salvo SPEC futuro de “retirada editorial de publicación IA”.

## Modelo de datos

**`denuncias`:** `id`, `tipo_objetivo` (enum: `comentario`, reservar `publicacion`), `objetivo_id`, `autor_id` (denunciante), `motivo`, `detalle` VARCHAR(500), `estado`, `creado_en`; índice `(tipo_objetivo, objetivo_id, creado_en)`.

**`comentarios` (extensión):** `estado_moderacion` (`visible`|`oculto`), `oculto_en`, `moderador_id` nullable, `nota_interna` nullable.

## API y contratos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/comentarios/:id/denuncias` | Crear denuncia. |
| `GET` | `/api/moderacion/denuncias` | Lista paginada (rol moderador). |
| `PATCH` | `/api/moderacion/comentarios/:id` | `visible` / `oculto`. |

Body POST: `{ "motivo": "spam|...", "detalle": "opcional≤500" }`. Errores: `{ error, codigo }`.

## Eventos Socket.IO

| Evento | Dirección | Payload | Cuándo |
|--------|-----------|---------|--------|
| `comentario_oculto` | backend → mobile | `{ comentarioId, publicacionId }` | Tras ocultar. |
| `comentario_restaurado` | backend → mobile | `{ comentarioId, publicacionId }` | Tras restaurar. |

## Validaciones

Motivo enumerado; rate limit por usuario e IP; deduplicación ventana configurable; `PATCH` solo moderador.

## Seguridad

JWT obligatorio; sin filtrar `nota_interna` al cliente; sanitizar `detalle`; auditoría de lecturas moderador (futuro SPEC gobernanza).

## Rendimiento

Listados de denuncias paginados (`limite` ≤ convención global API); índices para evitar full scan; emisión socket acotada a una sala por publicación (no broadcast global).

## Escalabilidad futura

Cola de revisión; Redis para contadores; microservicio moderación si CPU del API monolito es cuello; analytics de motivos y SLA de revisión.

## Riesgos técnicos

| Riesgo | Mitigación |
|--------|------------|
| Desincronización socket/REST | Refetch al foco; versión opcional de lista. |
| Abuso de denuncias | Rate limit + umbral conservador si auto-oculta. |
| Privilegio moderador mal usado | Doble control, logs de auditoría, RBAC explícito. |

## Dependencias

| SPEC | Relación |
|------|----------|
| `comentarios` | Entidad y soft-delete. |
| `tiempo-real` | Salas y reconexión. |
| `api-backend` | JWT, errores, paginación. |
| `ia-generacion` | Calidad de salida IA; incidentes cruzados. |
| `autenticacion` | Identidades. |
| `gestion-configuracion-secretos` | Flags entorno moderador. |

## Cambios arquitectónicos generados

- Nueva **frontera de dominio** “confianza” que cruza comentarios y sockets sin duplicar CRUD.
- Expectativa de **rol moderador** en el modelo de seguridad del API (aunque v1 pueda operar con script interno + SQL controlado).

## Posibles problemas futuros derivados

- Complejidad de **RBAC** (usuario / moderador / admin).
- **Consenso legal** sobre retención de `detalle` de denuncias.
- **Auto-moderación** por umbral que genere falsos positivos y presión en soporte.

## Próximos SPECS recomendados

1. **`gobierno-acceso-moderador-auditoria`** — quién puede PATCH, logs de lectura, retención y exportación.
2. **`calidad-editorial-publicaciones-ia`** — retirada suave del feed, versioning de prompts (si aplica) y trazabilidad de lote; enlaza `ia-generacion` + `feed-ia`.
3. **`metricas-interaccion-analytics`** — señales de toxicidad agregadas sin identificar usuarios en raw export (opcional y coherente con privacidad).

## Checklist técnico

- [ ] DDL + migración columnas moderación.
- [ ] POST denuncia + tests integración.
- [ ] PATCH moderador + middleware rol.
- [ ] Eventos socket + pruebas con cliente de sala.
- [ ] UI móvil denuncia + manejo errores red.
- [ ] Actualizar tabla de eventos en `arquitectura-monorepo.md` al implementar nombres finales.

# CONTEXTO PARA DESARROLLO

1. Se construyó conceptualmente el **módulo de moderación y denuncias** enlazado a comentarios y tiempo real.
2. Se resolvió el vacío de **governanza de UGC** (comentarios) sin tocar el núcleo “solo IA crea posts”.
3. Aparecieron **nuevas rutas**, **tabla `denuncias`**, **eventos socket** y la necesidad futura de **RBAC moderador**.
4. Afectados: `comentarios`, `tiempo-real`, `api-backend`, eventualmente `autenticacion` para claims de rol.
5. Nuevas dependencias NPM: ninguna obligatoria en v1; opcional Redis/cola en fases posteriores.
6. Riesgos pendientes: auditoría incompleta, desalineación socket, abuso de denuncias.
7. Limitaciones: sin panel admin; sin ML moderador; umbrales automáticos no fijados numéricamente aquí.
8. Desarrollar después: SPEC gobierno moderador; implementación DDL y middleware.
9. Conservar: MySQL como fuente de verdad; no mezclar lógica moderación en controlador de comentarios sin servicio dedicado.
10. Toda IA/dev debe leer `comentarios` y `tiempo-real` antes de implementar ocultamiento para no romper contratos existentes.

# PREGUNTAS PARA CONTINUIDAD DEL PROYECTO

- ¿El token JWT incluirá **`roles: string[]`** o un servicio aparte validará moderador por tabla `usuarios_rol`?
- ¿Las denuncias **anónimas** frente al denunciado son obligatorias o el moderador ve identidad completa del denunciante?
- ¿Se requiere **cadena de custodia** (hash de snapshot del comentario al momento de denuncia) para disputas legales?
- ¿El umbral automático de ocultamiento usará **solo conteo** o también velocidad de llegada de denuncias (detección de brigada)?
- ¿Los comentarios **ocultos** siguen contando para métricas de engagement del post IA o se excluyen explícitamente del KPI?
- ¿Habrá **apelación** por parte del autor del comentario y segundo flujo de estado?
- ¿Debe el evento socket incluir **`motivoAgregado`** o mantenerse mínimo por privacidad?
- ¿Cómo se versionará la API si `PATCH` moderación requiere **idempotency-key** para retries de panel futuro?
