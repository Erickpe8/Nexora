# Comportamiento de Kiro — Nexora

Metodología oficial de SPECS, SDD, Gitflow y commits: **`.kiro/steering/metodologia-documentacion-specs.md`**.

## Principios generales
- Priorizar simplicidad y mantenibilidad sobre elegancia técnica
- Evitar sobreingeniería en todo momento
- Preservar la estructura existente del proyecto
- No modificar archivos que no sean necesarios para la tarea
- Explicar decisiones técnicas importantes antes de implementarlas
- Mantener coherencia arquitectónica en cada cambio

## Regla principal — Separación monorepo

**Antes de generar cualquier código, identificar claramente:**
- ¿Este código pertenece a `mobile/` o a `backend/`?
- ¿Las rutas de archivos usan el prefijo correcto (`mobile/src/...` o `backend/src/...`)?
- ¿Las dependencias que se usan corresponden al proyecto correcto?

**Nunca mezclar:**
- Imports de React Native en archivos de `backend/`
- Imports de Express, mysql2 o node-cron en archivos de `mobile/`
- Lógica de servidor (cron, DB, IA) dentro de `mobile/`
- Lógica de UI o navegación dentro de `backend/`

## Generación de código

- Generar código limpio, legible y listo para producción
- Mantener diseño minimalista y moderno
- Pensar en escalabilidad progresiva, no prematura
- Seguir estrictamente las convenciones definidas en `convenciones.md`
- Mantener consistencia de nombres en español
- Respetar la separación de responsabilidades
- Generar soluciones aterrizadas y fáciles de mantener

## Idioma
- Todo el código, comentarios, variables, funciones, interfaces y archivos deben estar en español
- Las respuestas al usuario pueden estar en el idioma que el usuario use

## Arquitectura mobile (`mobile/src/`)
- Componentes: solo UI, sin lógica de negocio
- Hooks: encapsulan toda la lógica con estado
- Servicios: encapsulan todas las llamadas HTTP y WebSocket
- Pantallas: orquestan hooks y componentes
- Nunca llamar a `axios` directamente desde un componente o pantalla

## Arquitectura backend (`backend/src/`)
- Controladores: reciben request → llaman servicio → devuelven respuesta
- Servicios: contienen lógica de negocio y queries SQL
- Rutas: solo definen path, método HTTP y middlewares
- Middlewares: funciones puras y reutilizables
- Nunca poner queries SQL en controladores ni en rutas

## Flujo de trabajo
- Seguir el orden de fases definido en `roadmap-desarrollo.md` cuando aplique
- **Spec-Driven Development:** antes de implementación compleja, crear o actualizar el SPEC según `.kiro/steering/metodologia-documentacion-specs.md` y la plantilla `.kiro/templates/spec-template/requirements.md`
- Cada funcionalidad en rama desde `develop`: `feature/<nombre-feature>` o, si el roadmap lo exige, `feature/NN-tk-nombre`
- Actualizar documentación y archivos `.kiro` cuando aplique
- Commits con el formato definido en `flujo-trabajo.md` (Conventional Commits con `tipo(alcance): descripción`)

## Restricciones
- No introducir dependencias nuevas sin justificación clara
- No romper la arquitectura monorepo existente
- No generar código que no sea necesario para la tarea actual
- No asumir decisiones de diseño significativas sin consultarlas
- No mezclar lógica de negocio con lógica de presentación

## Stack obligatorio

### `mobile/`
React Native + Expo + TypeScript + NativeWind + Axios + Socket.IO Client + React Navigation

### `backend/`
Node.js + Express + TypeScript + MySQL + JWT + Socket.IO + node-cron + Axios (DeepSeek)
