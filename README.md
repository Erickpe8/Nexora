# Nexora

Red social tipo foro enfocada en tecnología, programación e innovación. Las publicaciones son generadas automáticamente por IA cada hora usando DeepSeek API. Los usuarios interactúan mediante comentarios y debate.

## Estructura del monorepo

```
nexora/
├── mobile/      -- Aplicación React Native (Expo)
├── backend/     -- API REST + WebSockets + Cron Jobs (Node.js)
├── .kiro/       -- Documentación, specs y steering
├── docs/        -- Documentación general
└── docker-compose.yml
```

## Arrancar el proyecto

### Backend
```bash
cd backend
cp .env.example .env   # configurar variables de entorno
npm install
npm run tablas         # crear tablas en MySQL
npm run dev            # servidor en http://localhost:3000
```

### Mobile
```bash
cd mobile
npm install
npm start              # abrir en Expo Go
```

## Stack

| Capa     | Tecnología                                      |
|----------|-------------------------------------------------|
| Mobile   | React Native + Expo + TypeScript + NativeWind   |
| Backend  | Node.js + Express + TypeScript + MySQL          |
| Realtime | Socket.IO                                       |
| IA       | DeepSeek API + node-cron                        |

## Variables de entorno

Ver `backend/.env.example` para la configuración requerida del backend.
Para mobile, usar `mobile/.env.example` y definir `EXPO_PUBLIC_API_URL`.
