# Diseño Técnico — Autenticación

## Arquitectura general

El módulo de autenticación sigue una arquitectura cliente-servidor estándar:
- El frontend (React Native) maneja las pantallas y el almacenamiento del token
- El backend (Node.js) valida credenciales y emite JWTs
- MySQL almacena los usuarios con contraseñas hasheadas

## Componentes frontend

### Pantallas
- `PantallaLogin` — formulario de inicio de sesión
- `PantallaRegistro` — formulario de registro de nuevo usuario

### Hooks
- `useAutenticacion` — maneja el estado de autenticación, login, registro y logout
- `useSesion` — verifica si hay un token válido al iniciar la app

### Servicios
- `servicioAutenticacion` — encapsula las llamadas HTTP a la API de autenticación

### Navegación
- `NavegadorAutenticacion` — stack navigator para las pantallas de auth
- `NavegadorPrincipal` — stack navigator para pantallas protegidas
- `RutaProtegida` — componente que redirige si no hay sesión activa

## Flujo técnico

### Registro
1. Usuario completa el formulario en `PantallaRegistro`
2. `useAutenticacion.registrar()` llama a `servicioAutenticacion.registrar(datos)`
3. El servicio hace POST a `/api/auth/registro`
4. El backend valida, hashea la contraseña y guarda el usuario en MySQL
5. El backend devuelve `{ token, usuario }`
6. El hook guarda el token en AsyncStorage y actualiza el estado global
7. La navegación redirige al feed principal

### Inicio de sesión
1. Usuario completa el formulario en `PantallaLogin`
2. `useAutenticacion.iniciarSesion()` llama a `servicioAutenticacion.login(credenciales)`
3. El servicio hace POST a `/api/auth/login`
4. El backend valida credenciales y devuelve `{ token, usuario }`
5. El hook guarda el token y actualiza el estado global
6. La navegación redirige al feed principal

### Verificación de sesión al iniciar
1. `useSesion` lee el token de AsyncStorage al montar la app
2. Si existe, hace GET a `/api/auth/verificar` con el token en el header
3. Si es válido, carga el usuario y muestra el feed
4. Si no es válido o no existe, muestra la pantalla de login

## Endpoints del backend

| Método | Ruta                  | Descripción                        |
|--------|-----------------------|------------------------------------|
| POST   | `/api/auth/registro`  | Registrar nuevo usuario            |
| POST   | `/api/auth/login`     | Iniciar sesión                     |
| GET    | `/api/auth/verificar` | Verificar validez del token actual |

## Estructura de datos

### Tabla `usuarios` (MySQL)
```sql
id           INT AUTO_INCREMENT PRIMARY KEY
nombre       VARCHAR(30) NOT NULL
correo       VARCHAR(255) UNIQUE NOT NULL
contrasena   VARCHAR(255) NOT NULL  -- bcrypt hash
creado_en    DATETIME DEFAULT NOW()
```

### Tipos TypeScript
```typescript
interface Usuario {
  id: number
  nombre: string
  correo: string
  creadoEn: string
}

interface RespuestaAuth {
  token: string
  usuario: Usuario
}

interface CredencialesLogin {
  correo: string
  contrasena: string
}

interface DatosRegistro {
  nombre: string
  correo: string
  contrasena: string
}
```

## Seguridad
- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- JWT firmado con secret en variable de entorno
- Token enviado en header `Authorization: Bearer <token>`
- Validación de inputs en backend antes de procesar
