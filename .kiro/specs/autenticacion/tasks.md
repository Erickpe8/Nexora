# Tareas de Implementación — Autenticación

## Backend

- [ ] Crear tabla `usuarios` en MySQL con los campos definidos en el diseño
- [ ] Instalar y configurar `bcrypt` para hasheo de contraseñas
- [ ] Instalar y configurar `jsonwebtoken` para emisión y verificación de tokens
- [ ] Crear endpoint `POST /api/auth/registro`
  - [ ] Validar campos requeridos (nombre, correo, contraseña)
  - [ ] Verificar que el correo no esté registrado
  - [ ] Hashear la contraseña con bcrypt
  - [ ] Guardar usuario en MySQL
  - [ ] Devolver token JWT y datos del usuario
- [ ] Crear endpoint `POST /api/auth/login`
  - [ ] Validar campos requeridos
  - [ ] Buscar usuario por correo
  - [ ] Comparar contraseña con bcrypt
  - [ ] Devolver token JWT y datos del usuario
- [ ] Crear endpoint `GET /api/auth/verificar`
  - [ ] Extraer token del header Authorization
  - [ ] Verificar y decodificar el JWT
  - [ ] Devolver datos del usuario si es válido
- [ ] Crear middleware `verificarToken` para proteger rutas privadas

## Frontend

- [ ] Crear tipo `Usuario`, `RespuestaAuth`, `CredencialesLogin`, `DatosRegistro` en `src/types/`
- [ ] Crear `servicioAutenticacion` en `src/services/`
  - [ ] Método `login(credenciales)`
  - [ ] Método `registrar(datos)`
  - [ ] Método `verificarSesion()`
- [ ] Crear hook `useAutenticacion` en `src/hooks/`
  - [ ] Estado: `usuario`, `cargando`, `error`
  - [ ] Métodos: `iniciarSesion()`, `registrar()`, `cerrarSesion()`
- [ ] Crear hook `useSesion` para verificar token al iniciar la app
- [ ] Crear pantalla `PantallaLogin` en `src/screens/`
  - [ ] Formulario con campos correo y contraseña
  - [ ] Validación de campos en el cliente
  - [ ] Manejo de errores con mensaje visible
  - [ ] Enlace a pantalla de registro
- [ ] Crear pantalla `PantallaRegistro` en `src/screens/`
  - [ ] Formulario con campos nombre, correo y contraseña
  - [ ] Validación de campos en el cliente
  - [ ] Manejo de errores con mensaje visible
  - [ ] Enlace a pantalla de login
- [ ] Crear `NavegadorAutenticacion` en `src/navigation/`
- [ ] Crear componente `RutaProtegida` que redirige si no hay sesión
- [ ] Integrar verificación de sesión en el punto de entrada de la app (`App.tsx`)

## Pruebas

- [ ] Verificar que el registro con datos válidos crea el usuario y devuelve token
- [ ] Verificar que el registro con correo duplicado devuelve error
- [ ] Verificar que el login con credenciales correctas devuelve token
- [ ] Verificar que el login con contraseña incorrecta devuelve error 401
- [ ] Verificar que rutas protegidas sin token devuelven error 401
- [ ] Verificar que la sesión persiste al reabrir la app con token válido
