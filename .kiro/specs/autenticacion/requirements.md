# Requisitos — Autenticación

## Objetivo
Permitir que los usuarios se registren, inicien sesión y mantengan su sesión activa de forma segura dentro de Nexora.

## Funcionalidades

### Registro de usuario
- El usuario puede crear una cuenta con nombre de usuario, correo electrónico y contraseña
- El correo electrónico debe ser único en el sistema
- El nombre de usuario debe ser único y tener entre 3 y 30 caracteres
- La contraseña debe tener mínimo 8 caracteres
- Al registrarse exitosamente, el usuario recibe un JWT y queda autenticado

### Inicio de sesión
- El usuario puede iniciar sesión con correo electrónico y contraseña
- Al autenticarse correctamente, el servidor devuelve un JWT de acceso
- El token se almacena de forma segura en el dispositivo (AsyncStorage)
- Si las credenciales son incorrectas, se muestra un mensaje de error claro

### Cierre de sesión
- El usuario puede cerrar sesión desde su perfil
- Al cerrar sesión, el token se elimina del almacenamiento local
- El usuario es redirigido a la pantalla de inicio de sesión

### Persistencia de sesión
- Si el usuario ya tiene un token válido almacenado, se autentica automáticamente al abrir la app
- Si el token ha expirado, se redirige al usuario a la pantalla de inicio de sesión

## Comportamiento esperado
- Las pantallas de registro e inicio de sesión son accesibles sin autenticación
- Todas las demás pantallas requieren autenticación
- Los errores de validación se muestran en línea junto al campo correspondiente
- El flujo de autenticación debe ser rápido y sin fricciones

## Reglas de negocio
- No se permiten cuentas duplicadas con el mismo correo
- Las contraseñas se almacenan hasheadas en la base de datos (bcrypt)
- El JWT tiene una expiración de 7 días
- No se implementa recuperación de contraseña en esta versión
