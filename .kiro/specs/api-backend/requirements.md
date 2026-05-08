# Requisitos — API Backend

## Objetivo
Proveer una API REST robusta, segura y bien estructurada que sirva como capa de comunicación entre el frontend de Nexora y la base de datos MySQL.

## Funcionalidades

### Arquitectura API REST
- La API sigue convenciones REST estándar con rutas claras y verbos HTTP correctos
- Todas las respuestas usan formato JSON consistente
- Los errores devuelven códigos HTTP apropiados con mensajes descriptivos en español
- La API está versionada bajo el prefijo `/api`

### Autenticación JWT
- Todas las rutas privadas requieren un token JWT válido en el header `Authorization: Bearer <token>`
- Los tokens tienen expiración de 7 días
- Las rutas públicas (login, registro) no requieren token
- Los tokens inválidos o expirados devuelven error 401

### Middlewares
- **Autenticación**: verifica el JWT en rutas protegidas
- **Validación**: valida el body de cada request antes de procesarlo
- **Manejo de errores**: captura errores no controlados y devuelve respuesta estructurada
- **CORS**: configurado para permitir peticiones desde el cliente móvil
- **Rate limiting**: limita peticiones por IP para prevenir abuso

### Validaciones
- Todos los inputs del usuario se validan antes de procesarse
- Los campos requeridos se verifican en cada endpoint
- Los tipos de datos se validan (string, number, email, etc.)
- Las longitudes máximas y mínimas se respetan

### Manejo de errores
- Los errores se clasifican: validación (400), autenticación (401), autorización (403), no encontrado (404), servidor (500)
- Todos los errores devuelven `{ error: string, codigo: number }`
- Los errores internos se registran en logs sin exponer detalles al cliente
- No se exponen stack traces en producción

## Comportamiento esperado
- La API responde en menos de 500ms para operaciones simples
- Las respuestas exitosas siguen el formato `{ datos: any }` o `{ mensaje: string }`
- Los errores de base de datos se manejan graciosamente sin caídas del servidor
- La API es stateless: cada request contiene toda la información necesaria

## Reglas de negocio
- No se expone información sensible (contraseñas, tokens internos) en las respuestas
- Los IDs de recursos son numéricos y secuenciales (auto-increment MySQL)
- La paginación usa parámetros `pagina` y `limite` con valores por defecto
- El límite máximo de items por página es 50
