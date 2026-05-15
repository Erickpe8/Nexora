# Diseño técnico — Pipeline de generación IA

## Referencia

El contrato funcional y evolutivo está en `requirements.md`. Este archivo resume **secuencia** y **puntos de extensión**.

## Secuencia (estado objetivo)

```mermaid
sequenceDiagram
  participant Cron
  participant Orq as Orquestador
  participant Gen as GeneradorIA
  participant Val as Validacion
  participant DB as MySQL
  participant IO as SocketIO

  Cron->>Orq: iniciar(ejecucionId)
  Orq->>Gen: solicitarLote(N)
  Gen-->>Orq: items parseados
  loop por item
    Orq->>Val: validar(item)
    Val-->>Orq: ok o error
    Orq->>DB: INSERT publicaciones
    DB-->>Orq: id
  end
  Orq->>IO: emit nuevas_publicaciones
```

## Estado actual (código)

Hoy: `cronGenerador.ts` orquesta de facto y llama `procesarLotePublicacionesIA`; emite `nuevas_publicaciones` tras resultado. La extracción a `orquestadorGeneracionIA.servicio.ts` es refactor mecánico + invariantes de orden.

## Puntos de extensión

- Mutex de job: variable en módulo o `redis lock` en fase distribuida.
- Emisión parcial: lista de ids insertados en la misma ejecución.
