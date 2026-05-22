# Stack Tecnológico — Nexora

## `mobile/` — Aplicación React Native

| Tecnología          | Uso                                      |
|---------------------|------------------------------------------|
| React Native        | Framework de UI móvil                    |
| Expo Go             | Entorno de desarrollo y distribución     |
| TypeScript          | Tipado estático                          |
| Axios               | Llamadas HTTP a la API del backend       |
| Socket.IO Client    | Conexión WebSocket para tiempo real      |
| NativeWind          | Estilos con clases TailwindCSS           |
| React Navigation    | Navegación entre pantallas               |
| AsyncStorage / SecureStore | Persistencia del token JWT        |
| @expo/vector-icons (Ionicons) | Iconografía UI (`Icono.tsx`)   |

## `backend/` — Servidor Node.js

| Tecnología          | Uso                                      |
|---------------------|------------------------------------------|
| Node.js             | Runtime del servidor                     |
| TypeScript          | Tipado estático                          |
| Express             | Framework HTTP                           |
| MySQL + mysql2      | Base de datos relacional                 |
| jsonwebtoken        | Generación y verificación de JWT         |
| bcrypt              | Hasheo de contraseñas                    |
| Socket.IO           | Servidor WebSocket para tiempo real      |
| node-cron           | Cron jobs automáticos cada hora          |
| Axios               | Llamadas a DeepSeek API                  |
| helmet              | Headers de seguridad HTTP                |
| cors                | Control de origen cruzado                |
| express-rate-limit  | Límite de peticiones por IP              |
| dotenv              | Variables de entorno                     |

## Inteligencia Artificial

| Tecnología          | Uso                                      |
|---------------------|------------------------------------------|
| DeepSeek API        | Generación de publicaciones automáticas  |
| node-cron           | Ejecución horaria del generador          |

## Infraestructura

| Tecnología          | Uso                                      |
|---------------------|------------------------------------------|
| MySQL               | Base de datos (local Docker o Railway)   |
| docker-compose      | MySQL local en puerto 3307               |
| Vercel              | Hosting web estático + API serverless    |
| Railway (u otro)    | MySQL remoto (`MYSQL_URL`) en producción |

## Separación estricta de dependencias

Las dependencias de `mobile/` y `backend/` son completamente independientes.

**`mobile/` nunca instala:** express, mysql2, jsonwebtoken, bcrypt, node-cron, helmet

**`backend/` nunca instala:** react-native, expo, nativewind, react-navigation, AsyncStorage
