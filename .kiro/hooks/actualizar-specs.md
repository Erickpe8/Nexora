# Hook — Actualizar Specs

## Propósito
Asegurar que los archivos de spec (`requirements.md`, `design.md`, `tasks.md`) se mantienen sincronizados con la implementación real del proyecto.

## Cuándo se activa
- Al iniciar una nueva rama `feature/tk-*`
- Al completar una tarea del `tasks.md`
- Al cambiar la arquitectura de un módulo
- Al agregar nuevos tipos TypeScript o endpoints

## Qué verificar en cada archivo

### `requirements.md`
- Los requisitos describen el comportamiento actual, no el planeado
- Las reglas de negocio están vigentes
- No hay funcionalidades documentadas que no existan en el código

### `design.md`
- Los tipos TypeScript coinciden con los definidos en `src/types/`
- Los endpoints documentados coinciden con las rutas del backend
- Los componentes listados existen en `src/components/` o `src/screens/`
- Los hooks documentados existen en `src/hooks/`
- El esquema MySQL coincide con las tablas reales

### `tasks.md`
- Las tareas completadas están marcadas con `[x]`
- Las tareas pendientes reflejan trabajo real por hacer
- No hay tareas duplicadas o contradictorias

## Proceso recomendado
1. Al iniciar una feature: revisar el `tasks.md` del módulo correspondiente
2. Durante la implementación: marcar tareas completadas progresivamente
3. Al hacer PR: verificar que el spec refleja lo implementado

## Regla
El spec es la fuente de verdad del módulo. Si el código y el spec difieren, el spec debe actualizarse.
