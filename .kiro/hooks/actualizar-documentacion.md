# Hook — Actualizar Documentación

## Propósito
Recordar al desarrollador que debe actualizar la documentación relevante cada vez que se implementa o modifica una funcionalidad.

## Cuándo se activa
- Al completar la implementación de una nueva funcionalidad
- Al modificar un endpoint existente
- Al cambiar la estructura de un componente, hook o servicio
- Al agregar o eliminar dependencias del proyecto

## Qué debe verificarse

### Specs
- ¿El `requirements.md` del módulo afectado refleja el comportamiento actual?
- ¿El `design.md` describe la arquitectura y tipos actualizados?
- ¿El `tasks.md` tiene las tareas completadas marcadas con `[x]`?

### Steering
- ¿Se introdujo alguna convención nueva que deba documentarse en `convenciones.md`?
- ¿Cambió el stack tecnológico? Actualizar `stack.md`
- ¿Cambió el flujo de trabajo? Actualizar `flujo-trabajo.md`

### README y docs/
- ¿Los endpoints nuevos están documentados?
- ¿Las variables de entorno nuevas están listadas?
- ¿`docs/DEPLOY-VERCEL.md` o `docs/arquitectura.md` reflejan deploy y cron?
- ¿`.kiro/README.md` y `docs/README.md` siguen siendo índices válidos?

## Checklist rápido
- [ ] Spec del módulo actualizada (`requirements.md`, `design.md`)
- [ ] Tasks alineadas o nota de “implementado en código”
- [ ] README raíz y `docs/` si cambió operación o arquitectura
- [ ] Steering (`arquitectura-monorepo`, `stack`, `convenciones`) si hay convención nueva
- [ ] Sin emojis en documentación de producto salvo ejemplos explícitos de “no usar”

## Regla
Ningún commit debe incluir código nuevo sin la documentación correspondiente actualizada.
