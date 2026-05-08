# Tareas de Implementación — API Backend

## Bootstrap inicial

- [ ] Crear carpeta `backend/` en la raíz del proyecto
- [ ] Inicializar proyecto Node.js con TypeScript (`npm init`, `tsconfig.json`)
- [ ] Instalar dependencias base:
  - [ ] `express`, `@types/express`
  - [ ] `typescript`, `ts-node`, `nodemon`
  - [ ] `mysql2`
  - [ ] `jsonwebtoken`, `@types/jsonwebtoken`
  - [ ] `bcrypt`, `@types/bcrypt`
  - [ ] `socket.io`
  - [ ] `cors`, `helmet`
  - [ ] `express-rate-limit`
  - [ ] `node-cron`
  - [ ] `axios`
  - [ ] `dotenv`
- [ ] Crear estructura de carpetas según el diseño (`modulos/`, `middlewares/`, `config/`, `ia/`, `socket/`, `types/`)
- [ ] Crear archivo `.env` con todas las variables definidas en el diseño
- [ ] Crear `servidor.ts` como punto de entrada con Express + Socket.IO

## Conexión MySQL

- [ ] Crear `config/baseDatos.ts` con pool de conexiones mysql2
- [ ] Configurar pool con máximo 10 conexiones
- [ ] Crear script `scripts/crearTablas.ts` que ejecuta el DDL de todas las tablas
- [ ] Verificar conexión al arrancar el servidor y loguear resultado

## Middlewares

- [ ] Crear `middlewares/autenticacion.ts`
  - [ ] Extraer token del header `Authorization: Bearer <token>`
  - [ ] Verificar y decodificar JWT
  - [ ] Adjuntar `req.usuario` con los datos del token
  - [ ] Devolver 401 si el token falta o es inválido
- [ ] Crear `middlewares/validacion.ts`
  - [ ] Recibir schema de validación como parámetro
  - [ ] Validar `req.body` y devolver 400 con errores si falla
- [ ] Crear `middlewares/errores.ts`
  - [ ] Capturar todos los errores no controlados
  - [ ] Clasificar y devolver respuesta estructurada `{ error, codigo }`
  - [ ] Loguear errores 500 en consola
- [ ] Crear `middlewares/rateLimiting.ts`
  - [ ] 100 peticiones por IP cada 15 minutos
  - [ ] Devolver 429 con mensaje claro al superar el límite

## Seguridad

- [ ] Configurar `helmet()` en el servidor principal
- [ ] Configurar `cors()` con origen permitido del cliente
- [ ] Extender el tipo `Request` de Express con `usuario?: UsuarioToken`
- [ ] Verificar que ningún endpoint expone contraseñas o tokens en la respuesta

## JWT

- [ ] Crear utilidad `generarToken(usuario)` que firma el JWT con `JWT_SECRET`
- [ ] Crear utilidad `verificarToken(token)` que decodifica y valida el JWT
- [ ] Configurar expiración de 7 días en todos los tokens generados

## Documentación de la API

- [ ] Crear `README.md` en `backend/` con:
  - [ ] Instrucciones de instalación y arranque
  - [ ] Lista de todos los endpoints con método, ruta, auth requerida y descripción
  - [ ] Formato de request y response para cada endpoint
  - [ ] Variables de entorno requeridas

## Pruebas

- [ ] Verificar que el servidor arranca correctamente y se conecta a MySQL
- [ ] Verificar que rutas protegidas devuelven 401 sin token
- [ ] Verificar que el rate limiting devuelve 429 al superar el límite
- [ ] Verificar que errores no controlados devuelven 500 con formato correcto
- [ ] Verificar que el middleware de validación rechaza bodies inválidos con 400
