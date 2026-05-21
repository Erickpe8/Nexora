# Onboarding — Nexora

Guía de incorporación técnica para nuevos desarrolladores del proyecto.

---

## ¿Qué es Nexora?

Nexora es una red social tipo foro enfocada en tecnología, programación e innovación.

- Las publicaciones del feed son generadas automáticamente cada hora usando **DeepSeek API**.
- Los usuarios **no crean publicaciones**; solo interactúan mediante **comentarios y debate**.
- La app es **mobile-first**: todo se diseña y piensa primero para móvil.

---

## Antes de tocar código

Tu prioridad NO es crear algo nuevo. Tu prioridad es:

1. Entender cómo está construido Nexora.
2. Seguir su línea técnica y visual.
3. Continuar la estructura existente.
4. Mantener coherencia en cada cambio.

Pregúntate siempre: **"¿Esto realmente parece parte natural de Nexora?"**

---

## Acceso y repositorio

- Cuenta GitHub asignada: https://github.com/TIC0o
- Repositorio principal: https://github.com/Erickpe8/Nexora

```bash
git clone https://github.com/Erickpe8/Nexora.git
cd Nexora
```

---

## Herramientas necesarias

| Herramienta | URL | Verificar |
|-------------|-----|-----------|
| Node.js LTS | https://nodejs.org/ | `node -v` y `npm -v` |
| Git | https://git-scm.com/ | `git --version` |
| VSCode | https://code.visualstudio.com/ | — |
| Cursor (apoyo IA) | https://www.cursor.com/ | — |
| Kiro (metodología) | https://kiro.dev/ | — |

---

## Estructura del monorepo

```
Nexora/
├── mobile/           → React Native + Expo (cliente móvil)
├── backend/          → API REST + WebSockets + Cron Jobs
├── .kiro/            → Metodología, specs y steering
├── docs/             → Documentación general del proyecto
└── docker-compose.yml
```

`mobile/` y `backend/` son proyectos **completamente independientes**. Cada uno tiene su propio `package.json` y sus propias dependencias. Solo se comunican a través de la API REST y eventos WebSocket.

---

## Lo más importante: estudiar `.kiro/`

La carpeta más importante del proyecto es `.kiro/`. Debes estudiarla completamente antes de escribir una sola línea de código.

### Steering — dirección técnica

```
.kiro/steering/
├── arquitectura-monorepo.md      → estructura, separación mobile/backend, contratos
├── stack.md                      → tecnologías de cada capa
├── metodologia-documentacion-specs.md → SDD, estructura de SPECS, Gitflow, commits
├── comportamiento-kiro.md        → reglas para agentes IA
├── convenciones.md               → nomenclatura, idioma, estructura de carpetas
├── flujo-trabajo.md              → Gitflow, commits, flujo por funcionalidad
├── project.md                    → contexto del producto
└── roadmap-desarrollo.md         → fases de desarrollo y estado actual
```

### Specs — módulos reales del sistema

```
.kiro/specs/
├── feed-ia/
├── ui-global/
├── navegacion/
├── api-backend/
├── comentarios/
├── tiempo-real/
├── autenticacion/
├── ia-generacion/
├── notificaciones/
├── perfil-usuario/
├── moderacion-confianza-contenido/
├── observabilidad-plataforma/
├── gestion-configuracion-secretos/
└── pipeline-generacion-ia/
```

Cada spec contiene `requirements.md`, `design.md` y `tasks.md`. Son la fuente de verdad de cada módulo.

### Hooks — automatización del flujo

```
.kiro/hooks/
├── validar-typescript.md
├── validar-convenciones.md
├── validar-estructura.md
├── actualizar-specs.md
└── actualizar-documentacion.md
```

---

## Levantar el backend

```bash
cd backend
cp .env.example .env      # configurar variables de entorno
npm install
npm run tablas            # crear tablas (base de datos nueva)
npm run dev               # servidor en http://localhost:4010
```

### Verificar que funciona

```
GET /api/salud
GET /api/salud/listo
GET /api/salud/vivo
```

---

## Levantar el mobile

```bash
cd mobile
npm install
npm start
```

Abrir en Expo Go, Android Emulator o iOS Simulator.

> **Importante:** en `mobile/.env`, la variable `EXPO_PUBLIC_API_URL` debe apuntar a la IP LAN de tu máquina (no `localhost`) para que Expo Go en el celular alcance el backend.

---

## Variables de entorno

| Archivo | Propósito |
|---------|-----------|
| `backend/.env.example` | Variables del servidor (DB, JWT, DeepSeek, moderación) |
| `mobile/.env.example` | URL del API (`EXPO_PUBLIC_API_URL`) |

---

## MySQL con Docker (recomendado)

```bash
docker-compose up -d
docker-compose ps
```

Credenciales: usuario `nexora_user`, contraseña `nexora_pass`, base de datos `nexora`, puerto `3307`.

---

## Diseño de referencia

Revisar constantemente: https://nexora-ruddy-nine.vercel.app/

Mantener siempre:
- identidad visual del proyecto,
- línea UI/UX existente,
- estructura de componentes actual,
- consistencia en estilos y espaciado.

---

## Cómo trabajar correctamente

### Antes de programar
1. Revisar el spec del módulo relacionado en `.kiro/specs/`.
2. Revisar componentes y patrones existentes.
3. Entender cómo está hecha la funcionalidad actual.
4. Nunca improvisar una arquitectura nueva.

### Antes de subir cambios
1. Probar en el dispositivo/emulador.
2. Revisar errores de TypeScript.
3. Validar navegación y responsive.
4. Comprobar que no rompiste otras partes.

### Cómo usar IA correctamente
- Dividir tareas en partes pequeñas.
- Dar contexto claro y específico.
- Revisar TODO lo generado antes de aceptarlo.
- La IA no reemplaza criterio técnico.

---

## Buenas prácticas obligatorias

- Código limpio con nombres claros en **español**.
- Separación de responsabilidades (componentes solo UI, hooks para lógica, servicios para HTTP).
- Componentes reutilizables y modulares.
- Buen tipado TypeScript (sin `any` sin justificación).
- Sin código duplicado ni componentes gigantes.
- Sin estilos inconsistentes ni arquitectura improvisada.

---

## Referencias

- Arquitectura: `.kiro/steering/arquitectura-monorepo.md`
- Stack: `.kiro/steering/stack.md`
- Convenciones: `.kiro/steering/convenciones.md`
- Roadmap: `.kiro/steering/roadmap-desarrollo.md`
- API completa: `backend/README.md`
- Specs por módulo: `.kiro/specs/`
