# Requisitos — Perfil de Usuario

## Objetivo
Permitir que los usuarios vean y editen su información de perfil, y que puedan ver el historial de su actividad en la plataforma.

## Funcionalidades

### Ver perfil propio
- El usuario autenticado puede acceder a su pantalla de perfil desde la navegación principal
- El perfil muestra: nombre de usuario, correo, fecha de registro y estadísticas de actividad
- Las estadísticas incluyen: total de comentarios realizados

### Editar perfil
- El usuario puede editar su nombre de usuario
- El nuevo nombre de usuario debe ser único y tener entre 3 y 30 caracteres
- Los cambios se guardan al confirmar y se reflejan inmediatamente en la UI
- Se muestra un mensaje de éxito o error según el resultado

### Ver perfil de otro usuario
- Al tocar el nombre de un autor en un comentario, el usuario navega al perfil público de ese autor
- El perfil público muestra: nombre de usuario, fecha de registro y total de comentarios
- No se muestra el correo electrónico en perfiles públicos

### Historial de comentarios
- El perfil propio muestra los últimos comentarios realizados por el usuario
- Cada entrada del historial muestra el contenido del comentario y la publicación a la que pertenece
- Al tocar una entrada, navega a la publicación correspondiente

### Cerrar sesión
- El botón de cerrar sesión está disponible en la pantalla de perfil propio
- Al confirmar, se elimina el token y se redirige al login

## Comportamiento esperado
- La pantalla de perfil carga rápidamente con los datos del usuario en caché
- Los cambios de nombre de usuario se validan en el cliente antes de enviar al servidor
- Si el nombre de usuario ya está en uso, se muestra un error claro
- El historial de comentarios muestra un máximo de 20 entradas recientes

## Reglas de negocio
- El correo electrónico no se puede cambiar en esta versión
- La contraseña no se puede cambiar en esta versión
- El nombre de usuario debe ser único en todo el sistema
- No se puede eliminar la cuenta en esta versión
- Los perfiles son públicos (cualquier usuario autenticado puede ver el perfil de otro)
