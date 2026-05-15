# Diseño Técnico — Moderación y Confianza de Contenido

## Alcance del diseño

La especificación funcional y de contratos vive en `requirements.md` (formato extendido). Este archivo resume **decisiones de diseño** y **acoplamientos** para implementación.

## Modelo de datos (resumen)

- **Denuncia**: referencia polimórfica lógica (`tipoObjetivo`: `comentario` | `publicacion`, `objetivoId`), `autorId`, `motivo`, `detalle`, `estado`, timestamps.
- **Comentario**: extensión con `estadoModeracion` sin alterar la semántica de soft-delete definida en comentarios.

## Secuencia: denuncia + tiempo real

1. Cliente `POST` denuncia → 201.
2. Si política de umbral actualiza visibilidad → transacción DB → emisión `comentario_oculto`.
3. Clientes en sala de `publicacionId` actualizan estado local o refetch segmentado.

## Decisiones

- **Fuente de verdad**: MySQL; sockets son notificación.
- **Sin posts UGC**: la moderación de publicaciones es **excepcional** (calidad/riesgo IA), no flujo cotidiano del usuario.

## Dependencias

Ver tabla de dependencias en `requirements.md` (secciones Arquitectura y API).
