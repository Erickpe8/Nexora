# Requisitos — Comentarios

## Objetivo
Permitir que los usuarios autenticados participen en el debate de cada publicación mediante comentarios y respuestas anidadas.

## Funcionalidades

### Ver comentarios
- El usuario puede ver todos los comentarios de una publicación en la pantalla de detalle
- Los comentarios se muestran ordenados por fecha de creación (más antiguos primero)
- Cada comentario muestra: nombre del autor, contenido, fecha y número de respuestas
- Los comentarios soportan un nivel de anidación (respuestas a comentarios)

### Crear comentario
- El usuario autenticado puede escribir y enviar un comentario en cualquier publicación
- El comentario debe tener entre 1 y 500 caracteres
- Al enviar, el comentario aparece inmediatamente en la lista sin recargar la pantalla
- Se muestra un indicador de envío mientras se procesa

### Responder a un comentario
- El usuario puede responder directamente a un comentario existente
- Las respuestas se muestran anidadas bajo el comentario padre
- El flujo de respuesta es igual al de crear un comentario

### Eliminar comentario
- El usuario solo puede eliminar sus propios comentarios
- Al eliminar, el comentario desaparece de la lista
- Si el comentario tiene respuestas, se muestra como "[comentario eliminado]" en lugar de borrarse físicamente

## Comportamiento esperado
- Los comentarios se actualizan en tiempo real para todos los usuarios en la misma publicación
- Si el usuario no está autenticado, se le invita a iniciar sesión para comentar
- Los errores de envío se muestran con opción de reintentar
- El campo de texto se limpia automáticamente al enviar exitosamente

## Reglas de negocio
- Solo usuarios autenticados pueden crear o eliminar comentarios
- Un usuario solo puede eliminar sus propios comentarios
- No se permite editar comentarios una vez publicados
- El máximo de anidación es de un nivel (comentario → respuesta, no respuesta → respuesta)
- Los comentarios no pueden estar vacíos ni superar 500 caracteres
