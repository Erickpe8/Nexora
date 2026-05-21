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
| 1 | Bootstrap Backend | ✅ |
| 2 | UI Global (sistema de diseño) | ✅ |
| 3 | Navegación | ✅ |
| 4 | Autenticación | ✅ |
| 5 | Feed + IA | ✅ |
| 6 | Comentarios | ✅ |
| 7 | Notificaciones | ✅ |
| 8 | Perfil de Usuario | ✅ |
| 9 | Observabilidad | ✅ |
| 10 | Gestión de Configuración | ✅ |
| 11 | Pipeline IA (Fase B) | ✅ |
| 12 | Moderación y Confianza | ✅ |

---

## Variables de entorno

- Backend: ver `backend/.env.example`
- Mobile: ver `mobile/.env.example`

---

## Documentación técnica

- Arquitectura: `.kiro/steering/arquitectura-monorepo.md`
- Stack: `.kiro/steering/stack.md`
- Roadmap: `.kiro/steering/roadmap-desarrollo.md`
- Specs por módulo: `.kiro/specs/`
- API completa: `backend/README.md`
