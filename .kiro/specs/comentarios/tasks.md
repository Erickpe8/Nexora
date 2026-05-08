# Tareas de Implementación — Comentarios

## Backend

- [ ] Crear tabla `comentarios` en MySQL con los campos definidos en el diseño
- [ ] Crear endpoint `GET /api/publicaciones/:id/comentarios`
  - [ ] Obtener comentarios raíz de la publicación
  - [ ] Incluir respuestas anidadas en cada comentario
  - [ ] Incluir nombre del autor en cada comentario
  - [ ] Excluir contenido de comentarios eliminados (mostrar placeholder)
- [ ] Crear endpoint `POST /api/publicaciones/:id/comentarios`
  - [ ] Validar que el contenido no esté vacío y no supere 500 caracteres
  - [ ] Validar que `comentarioPadreId` exista si se proporciona
  - [ ] Validar que el padre no sea ya una respuesta (máximo un nivel)
  - [ ] Guardar comentario en MySQL
  - [ ] Emitir evento WebSocket `nuevo_comentario` al canal correspondiente
- [ ] Crear endpoint `DELETE /api/comentarios/:id`
  - [ ] Verificar que el comentario pertenece al usuario autenticado
  - [ ] Si tiene respuestas: marcar como eliminado (soft delete)
  - [ ] Si no tiene respuestas: eliminar físicamente
  - [ ] Emitir evento WebSocket `comentario_eliminado`
- [ ] Proteger todos los endpoints con middleware `verificarToken`

## Frontend

- [ ] Crear tipos `Comentario` y `NuevoComentario` en `src/types/`
- [ ] Crear `servicioComentarios` en `src/services/`
  - [ ] Método `obtener(publicacionId)`
  - [ ] Método `crear(publicacionId, datos)`
  - [ ] Método `eliminar(comentarioId)`
- [ ] Crear hook `useComentarios` en `src/hooks/`
  - [ ] Estado: `comentarios`, `cargando`, `enviando`, `error`
  - [ ] Métodos: `cargar()`, `crear()`, `eliminar()`
  - [ ] Actualización optimista al crear
- [ ] Crear hook `useComentariosEnTiempoReal` en `src/hooks/`
  - [ ] Suscribirse al canal `comentarios:{publicacionId}`
  - [ ] Manejar eventos `nuevo_comentario` y `comentario_eliminado`
- [ ] Crear componente `FormularioComentario` en `src/components/`
  - [ ] Campo de texto con límite de 500 caracteres
  - [ ] Contador de caracteres visible
  - [ ] Botón de envío con estado de carga
  - [ ] Limpiar campo al enviar exitosamente
- [ ] Crear componente `TarjetaComentario` en `src/components/`
  - [ ] Mostrar nombre del autor, contenido y fecha
  - [ ] Botón "Responder" visible para usuarios autenticados
  - [ ] Botón "Eliminar" visible solo para el autor del comentario
  - [ ] Mostrar "[comentario eliminado]" si `eliminado` es true
- [ ] Crear componente `RespuestasComentario` en `src/components/`
  - [ ] Lista de respuestas anidadas bajo el comentario padre
  - [ ] Colapsable si hay más de 3 respuestas
- [ ] Crear componente `ListaComentarios` en `src/components/`
  - [ ] Renderizar lista de `TarjetaComentario` con sus `RespuestasComentario`
  - [ ] Mostrar `FormularioComentario` al final
- [ ] Integrar `ListaComentarios` en `PantallaDetalle`

## Pruebas

- [ ] Verificar que los comentarios se cargan correctamente para una publicación
- [ ] Verificar que crear un comentario lo agrega a la lista
- [ ] Verificar que responder a un comentario lo anida correctamente
- [ ] Verificar que no se puede anidar más de un nivel
- [ ] Verificar que eliminar un comentario propio funciona
- [ ] Verificar que no se puede eliminar un comentario ajeno (error 403)
- [ ] Verificar que los comentarios nuevos aparecen en tiempo real
