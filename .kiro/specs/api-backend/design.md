# Diseño Técnico — API Backend

## Arquitectura general

El backend sigue una arquitectura en capas: rutas → controladores → servicios → base de datos. Cada módulo es independiente y se registra en el servidor principal. Socket.IO corre sobre el mismo servidor HTTP.

## Estructura de carpetas del backend

```
backend/
├── src/
│   ├── config/
│   │   ├── baseDatos.ts       -- conexión MySQL
│   │   └── entorno.ts         -- variables de entorno
│   ├── middlewares/
│   │   ├── autenticacion.ts   -- verificar JWT
│   │   ├── validacion.ts      -- validar body
│   │   ├── errores.ts         -- manejo global de errores
│   │   └── rateLimiting.ts    -- límite de peticiones
│   ├── modulos/
│   │   ├── auth/
│   │   │   ├── auth.rutas.ts
│   │   │   ├── auth.controlador.ts
│   │   │   └── auth.servicio.ts
│   │   ├── publicaciones/
│   │   │   ├── publicaciones.rutas.ts
│   │   │   ├── publicaciones.controlador.ts
│   │   │   └── publicaciones.servicio.ts
│   │   ├── comentarios/
│   │   │   ├── comentarios.rutas.ts
│   │   │   ├── comentarios.controlador.ts
│   │   │   └── comentarios.servicio.ts
│   │   ├── usuarios/
│   │   │   ├── usuarios.rutas.ts
│   │   │   ├── usuarios.controlador.ts
│   │   │   └── usuarios.servicio.ts
│   │   └── notificaciones/
│   │       ├── notificaciones.rutas.ts
│   │       ├── notificaciones.controlador.ts
│   │       └── notificaciones.servicio.ts
│   ├── ia/
│   │   ├── cronGenerador.ts
│   │   ├── servicioDeepSeek.ts
│   │   └── loggerGeneracion.ts
│   ├── socket/
│   │   ├── socket.ts          -- configuración Socket.IO
│   │   └── socket.middleware.ts
│   ├── types/
│   │   └── index.ts           -- tipos compartidos
│   └── servidor.ts            -- punto de entrada
├── .env
├── package.json
└── tsconfig.json
```

## Middlewares

### `autenticacion.ts`
```typescript
// Extrae y verifica el JWT del header Authorization
// Adjunta el usuario decodificado a req.usuario
// Devuelve 401 si el token es inválido o falta
```

### `validacion.ts`
```typescript
// Recibe un schema de validación (zod o joi)
// Valida req.body contra el schema
// Devuelve 400 con errores detallados si falla
```

### `errores.ts`
```typescript
// Middleware de 4 parámetros (err, req, res, next)
// Clasifica el error y devuelve respuesta estructurada
// Registra errores 500 en logs sin exponer detalles
```

### `rateLimiting.ts`
```typescript
// Límite: 100 peticiones por IP cada 15 minutos
// Devuelve 429 al superar el límite
```

## Formato de respuestas

### Éxito
```json
{ "datos": { ... } }
{ "mensaje": "Operación exitosa" }
```

### Error
```json
{ "error": "Descripción del error", "codigo": 400 }
```

### Paginación
```json
{
  "datos": [...],
  "pagina": 1,
  "totalPaginas": 5,
  "total": 48
}
```

## Conexión MySQL

```typescript
// Usar mysql2 con pool de conexiones
// Pool de 10 conexiones máximo
// Reconexión automática en caso de pérdida
// Queries con parámetros preparados (prevenir SQL injection)
```

## Seguridad

- JWT firmado con `JWT_SECRET` en `.env`
- Contraseñas hasheadas con bcrypt (salt: 10)
- Queries parametrizadas en todas las operaciones de base de datos
- CORS configurado para el origen del cliente
- Headers de seguridad con `helmet`
- Variables sensibles solo en `.env`, nunca en código

## Variables de entorno

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NOMBRE=nexora
DB_USUARIO=root
DB_CONTRASENA=
JWT_SECRET=
DEEPSEEK_API_KEY=
```

## Tipos compartidos

```typescript
interface UsuarioToken {
  id: number
  nombre: string
  correo: string
}

// Extender Request de Express
declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioToken
    }
  }
}
```
