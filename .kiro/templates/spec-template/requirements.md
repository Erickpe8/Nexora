# [Nombre del módulo]

## Objetivo

[Qué persigue el módulo, alineado a Nexora: IA genera conversación; usuarios comentan y debaten.]

## Problema actual detectado

[Vacío técnico, riesgo o deuda detectada tras analizar el ecosistema — no marketing.]

## Impacto del problema

[Operación, seguridad, coste, UX, tiempo de diagnóstico, evolución del producto bloqueada, etc.]

## Solución propuesta

[Enfoque técnico: límites del módulo, contratos, patrones; qué se introduce y qué se mantiene estable.]

## Alcance

[Capacidades y capas incluidas.]

## Fuera de alcance

[Límites explícitos para evitar deriva.]

## Reglas de negocio

1. [Reglas del dominio Nexora y del módulo.]

## Arquitectura

[Límites del módulo; relación mobile ↔ API ↔ MySQL ↔ Socket.IO ↔ IA/cron; acoplamientos permitidos.]

## Flujo técnico

### Caso feliz

1. [Pasos.]

### Errores y degradación

- [Comportamiento ante fallos.]

## Componentes involucrados

[Resumen / matriz: qué subsistemas toca el módulo y cómo se relacionan.]

## Backend

[Rutas, controladores delgados, servicios, middlewares, cron si aplica.]

## Mobile

[Pantallas, hooks, servicios; sin secretos ni lógica crítica de negocio.]

## WebSockets

[Salas, eventos emitidos/recibidos, autenticación del handshake.]

## IA y automatización

[DeepSeek, cron, idempotencia, o **N/A** justificado.]

## Modelo de datos

[Tablas, campos, índices, estados, migraciones.]

## API y contratos

| Método | Ruta | Descripción |
|--------|------|-------------|

Errores estándar Nexora: `{ error: string, codigo: number }` salvo extensión acordada.

## Eventos Socket.IO

| Evento | Dirección | Payload | Cuándo |
|--------|-----------|---------|--------|

## Validaciones

[Entrada, límites, duplicados, idempotencia.]

## Seguridad

[AuthZ, rate limit, sanitización, secretos, auditoría.]

## Rendimiento

[Presupuestos de latencia, volumen, I/O, queries, fan-out de sockets si aplica.]

## Escalabilidad futura

[Colas, cache, workers, sharding, microservicios — lo pertinente al módulo.]

## Riesgos técnicos

| Riesgo | Mitigación |
|--------|------------|

## Dependencias

| SPEC / módulo | Relación |
|---------------|----------|

## Cambios arquitectónicos generados

[Qué cambia en el diagrama mental del sistema al adoptar este SPEC.]

## Posibles problemas futuros derivados

[Segunda orden: qué puede empeorar o qué deuda introduce la solución.]

## Próximos SPECS recomendados

1. [Nombre carpeta / tema — por qué engancha.]
2. […]

## Checklist técnico

- [ ] [Tarea accionable.]

# CONTEXTO PARA DESARROLLO

1. …
2. …
3. …
4. …
5. …
6. …
7. …
8. …
9. …
10. …

# PREGUNTAS PARA CONTINUIDAD DEL PROYECTO

- [Pregunta concreta que cierre vacíos o abra el siguiente ciclo de SPEC.]
