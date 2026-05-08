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

### README
- ¿Los endpoints nuevos están documentados?
- ¿Las variables de entorno nuevas están listadas?

## Checklist rápido
- [ ] Spec del módulo actualizada
- [ ] Tasks marcadas como completadas
- [ ] README del backend actualizado si aplica
- [ ] Steering actualizado si se introdujo algo nuevo

## Regla
Ningún commit debe incluir código nuevo sin la documentación correspondiente actualizada.
