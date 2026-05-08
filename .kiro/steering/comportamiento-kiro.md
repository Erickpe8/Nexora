# Comportamiento de Kiro — Nexora

## Principios generales
- Priorizar simplicidad y mantenibilidad sobre elegancia técnica
- Evitar sobreingeniería en todo momento
- Preservar la estructura existente del proyecto
- No modificar archivos que no sean necesarios para la tarea
- Explicar decisiones técnicas importantes antes de implementarlas
- Mantener coherencia arquitectónica en cada cambio

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
- Las respuestas al usuario pueden estar en español o en el idioma que el usuario use

## Arquitectura
- Respetar la estructura de carpetas definida en `convenciones.md`
- Mantener componentes pequeños y reutilizables
- Separar lógica de negocio de la UI en todo momento
- Mantener servicios API desacoplados de los componentes
- Evitar componentes gigantes o con múltiples responsabilidades

## Flujo de trabajo
- Cada nueva funcionalidad debe trabajarse en una rama `feature/tk-nombre`
- Actualizar documentación y archivos `.kiro` cuando aplique
- Incluir pruebas cuando la funcionalidad lo requiera
- Commits siempre en español, claros y descriptivos

## Restricciones
- No introducir dependencias nuevas sin justificación clara
- No romper la arquitectura existente
- No generar código que no sea necesario para la tarea actual
- No asumir decisiones de diseño sin consultarlas primero si son significativas
- No mezclar lógica de negocio con lógica de presentación

## Stack obligatorio
Respetar siempre el stack definido en `stack.md`:
- Frontend: React Native + Expo + TypeScript + NativeWind + Axios
- Backend: Node.js + TypeScript + JWT + WebSockets
- Base de datos: MySQL
- IA: DeepSeek API
