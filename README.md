# Nexora

Red social tipo foro enfocada en tecnología, programación e innovación. Las publicaciones son generadas automáticamente por IA cada hora usando DeepSeek API. Los usuarios interactúan mediante comentarios y debate.

## Estructura del monorepo

```
nexora/
├── mobile/      — Aplicación React Native (Expo)
├── backend/     — API REST + WebSockets + Cron Jobs (Node.js)
├── .kiro/       — Documentación, specs y steering
├── docs/        — Documentación general
└── docker-compose.yml
```

---

## Arrancar el proyecto

### Opción A — MySQL con Docker (recomendado)

```bash
# Levantar MySQL en el puerto 3307
docker-compose up -d

# Verificar que está corriendo
docker-compose ps
```

Credenciales del contenedor: usuario `nexora_user`, contraseña `nexora_pass`, base de datos `nexora`, puerto `3307`.

### Backend

```bash
cd backend
cp .env.example .env        # configurar variables de entorno

npm install

# Base de datos nueva:
npm run tablas

# Base de datos ya existente (agrega columnas/tablas nuevas sin borrar datos):
npm run migrar

npm run dev                  # servidor en http://localhost:4010
```

### Mobile

```bash
cd mobile
npm install
npm start                    # abrir en Expo Go, Android Emulator o iOS Simulator
```

> **Importante:** en `mobile/.env`, `EXPO_PUBLIC_API_URL` debe apuntar a la IP LAN de tu máquina (no `localhost`) para que Expo Go en el celular alcance el backend. El backend imprime las IPs disponibles al arrancar.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Mobile | React Native + Expo + TypeScript + NativeWind |
| Backend | Node.js + Express + TypeScript + MySQL |
| Realtime | Socket.IO |
| IA | DeepSeek API + node-cron |
| Estilos | Tema oscuro con tokens de diseño propios |

---

## Módulos implementados

| Fase | Módulo | Estado |
|------|--------|--------|
| 1 | Bootstrap Backend | Completado |
| 2 | UI Global + iconos (`Icono`) | Completado |
| 3 | Navegación | Completado |
| 4 | Autenticación | Completado |
| 5 | Feed + IA | Completado |
| 6 | Comentarios + likes | Completado |
| 7 | Notificaciones | Completado |
| 8 | Perfil de Usuario | Completado |
| 9 | Observabilidad | Completado |
| 10 | Gestión de Configuración | Completado |
| 11 | Pipeline IA + cron Vercel | Completado |
| 12 | Moderación y Confianza | Completado |

---

## Variables de entorno

- Backend: ver `backend/.env.example`
- Mobile: ver `mobile/.env.example`

---

## Deploy en Vercel

Ver [docs/DEPLOY-VERCEL.md](docs/DEPLOY-VERCEL.md). Resumen: MySQL en Railway, `npm run vercel:finalizar`, redeploy. La IA publica **4 posts** al primer acceso tras deploy y **4 cada hora** con Vercel Cron.

## Documentación técnica

- Índice general: [docs/README.md](docs/README.md)
- Índice Kiro (specs + steering): [.kiro/README.md](.kiro/README.md)
- Onboarding: [docs/onboarding.md](docs/onboarding.md)
- Arquitectura: [docs/arquitectura.md](docs/arquitectura.md)
- API backend: `backend/README.md`
