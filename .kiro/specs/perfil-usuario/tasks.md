# Tareas de Implementación — Perfil de Usuario

## Backend

- [ ] Crear endpoint `GET /api/usuarios/perfil`
  - [ ] Devolver datos del usuario autenticado (id, nombre, correo, creadoEn)
  - [ ] Incluir `totalComentarios` calculado desde la tabla de comentarios
  - [ ] Proteger con middleware `verificarToken`
- [ ] Crear endpoint `PATCH /api/usuarios/perfil`
  - [ ] Validar que el nuevo nombre tenga entre 3 y 30 caracteres
  - [ ] Verificar que el nombre no esté en uso por otro usuario
  - [ ] Actualizar el nombre en MySQL
  - [ ] Devolver el perfil actualizado
  - [ ] Proteger con middleware `verificarToken`
- [ ] Crear endpoint `GET /api/usuarios/:id`
  - [ ] Devolver datos públicos (id, nombre, creadoEn, totalComentarios)
  - [ ] No incluir correo electrónico
  - [ ] Retornar 404 si el usuario no existe
  - [ ] Proteger con middleware `verificarToken`
- [ ] Crear endpoint `GET /api/usuarios/:id/comentarios`
  - [ ] Devolver los últimos 20 comentarios del usuario
  - [ ] Incluir el título de la publicación en cada comentario
  - [ ] Excluir comentarios marcados como eliminados
  - [ ] Proteger con middleware `verificarToken`

## Frontend

- [ ] Crear tipos `PerfilUsuario`, `PerfilPublico`, `ItemHistorial`, `ActualizarPerfil` en `src/types/`
- [ ] Crear `servicioPerfil` en `src/services/`
  - [ ] Método `obtenerPerfil()`
  - [ ] Método `actualizarNombre(nombre)`
  - [ ] Método `obtenerPerfilPublico(id)`
  - [ ] Método `obtenerHistorial(id)`
- [ ] Crear hook `usePerfil` en `src/hooks/`
  - [ ] Estado: `perfil`, `cargando`, `guardando`, `error`
  - [ ] Métodos: `cargar()`, `actualizarNombre()`
- [ ] Crear hook `useHistorialComentarios` en `src/hooks/`
  - [ ] Estado: `historial`, `cargando`
  - [ ] Método: `cargar(usuarioId)`
- [ ] Crear componente `CabeceraPerfil` en `src/components/`
  - [ ] Avatar con iniciales y color determinístico
  - [ ] Nombre de usuario y fecha de registro
  - [ ] Botón de edición del nombre (solo en perfil propio)
- [ ] Crear componente `EstadisticasPerfil` en `src/components/`
  - [ ] Tarjeta con total de comentarios
- [ ] Crear componente `FormularioEditarNombre` en `src/components/`
  - [ ] Campo de texto con validación de longitud
  - [ ] Botones de confirmar y cancelar
  - [ ] Estado de carga mientras se guarda
- [ ] Crear componente `TarjetaHistorial` en `src/components/`
  - [ ] Mostrar contenido truncado del comentario
  - [ ] Mostrar título de la publicación
  - [ ] Navegable a la publicación al tocar
- [ ] Crear componente `HistorialComentarios` en `src/components/`
  - [ ] Lista de `TarjetaHistorial`
  - [ ] Mensaje si no hay comentarios
- [ ] Crear pantalla `PantallaPerfil` en `src/screens/`
  - [ ] Integrar `CabeceraPerfil`, `EstadisticasPerfil`, `HistorialComentarios`
  - [ ] Botón de cerrar sesión con confirmación
- [ ] Crear pantalla `PantallaPerfilPublico` en `src/screens/`
  - [ ] Recibir `usuarioId` como parámetro de navegación
  - [ ] Mostrar `CabeceraPerfil`, `EstadisticasPerfil`, `HistorialComentarios` en modo lectura
- [ ] Agregar navegación al perfil desde la barra de navegación principal
- [ ] Agregar navegación al perfil público al tocar el nombre de un autor en comentarios

## Pruebas

- [ ] Verificar que el perfil propio carga correctamente con estadísticas
- [ ] Verificar que editar el nombre con un valor válido actualiza el perfil
- [ ] Verificar que editar con un nombre ya en uso devuelve error
- [ ] Verificar que el perfil público no expone el correo electrónico
- [ ] Verificar que el historial muestra los comentarios recientes correctamente
- [ ] Verificar que cerrar sesión elimina el token y redirige al login
