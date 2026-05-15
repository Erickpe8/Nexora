# Nexora — Contexto del Proyecto

## ¿Qué es Nexora?
Nexora es una red social tipo foro enfocada en tecnología, programación e innovación.

La plataforma integra IA mediante DeepSeek API para generar automáticamente publicaciones cada hora con noticias tecnológicas actuales, resúmenes claros y preguntas controversiales que incentivan la participación de la comunidad.

Los usuarios únicamente interactúan mediante comentarios y debate. No pueden crear publicaciones propias.

## Arquitectura del proyecto
Nexora es un **monorepo** con dos proyectos completamente independientes:

- `mobile/` — aplicación React Native (cliente móvil)
- `backend/` — API REST + WebSockets + cron jobs (servidor Node.js)

Ambos proyectos tienen su propio `package.json` y sus propias dependencias. No comparten código fuente. Se comunican únicamente a través de la API REST y eventos WebSocket.

## Funcionalidades principales
- Publicaciones automáticas generadas por IA cada hora
- Resúmenes de noticias tecnológicas actuales
- Preguntas controversiales para incentivar el debate
- Comentarios y respuestas entre usuarios
- Feed dinámico impulsado por IA
- Interacción en tiempo real vía Socket.IO
- Notificaciones in-app en tiempo real
- Perfiles de usuario públicos

## Público objetivo
Estudiantes, desarrolladores y entusiastas de la tecnología que buscan conectarse, debatir y compartir conocimiento en tiempo real.

## Visión
Construir una red social moderna impulsada por IA donde la comunidad tecnológica pueda debatir noticias actuales, compartir conocimiento e interactuar en tiempo real. El proyecto debe sentirse como un producto real, moderno y escalable.

## Metodología de documentación

Flujo vivo **analizar → detectar → proponer → actualizar arquitectura → crear SPEC**; SPECS no aislados (dependencias + próximos SPECS); estructura completa de `requirements.md`, Gitflow y commits: **`.kiro/steering/metodologia-documentacion-specs.md`**.
