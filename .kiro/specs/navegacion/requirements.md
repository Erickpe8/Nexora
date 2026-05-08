# Requisitos — Navegación

## Objetivo
Proveer una estructura de navegación clara, fluida y bien organizada que conecte todas las pantallas de Nexora respetando el flujo de autenticación y la experiencia mobile-first.

## Funcionalidades

### Navegación principal con tabs
- Los usuarios autenticados ven una barra de tabs en la parte inferior con las secciones principales
- Los tabs incluyen: Feed, Notificaciones y Perfil
- El tab activo se destaca visualmente
- El badge de notificaciones se muestra sobre el ícono del tab correspondiente

### Stack navigation
- Dentro de cada tab existe un stack navigator para la navegación en profundidad
- Desde el Feed se puede navegar al detalle de una publicación
- Desde el detalle se puede navegar al perfil público de un autor
- Cada stack tiene su propio historial de navegación independiente

### Protección de rutas
- Las pantallas de tabs solo son accesibles para usuarios autenticados
- Si el usuario no está autenticado, se redirige automáticamente al stack de autenticación
- Al autenticarse, se redirige automáticamente al feed principal
- Al cerrar sesión, se redirige al login y se limpia el historial de navegación

### Flujo de autenticación
- El stack de autenticación contiene: Login y Registro
- No hay tabs ni barra inferior en las pantallas de autenticación
- La navegación entre Login y Registro es bidireccional

## Comportamiento esperado
- Las transiciones entre pantallas son nativas y fluidas
- El botón de retroceso del dispositivo funciona correctamente en todos los stacks
- Al volver al feed desde el detalle, la posición de scroll se conserva
- La navegación no genera re-renders innecesarios en pantallas no activas

## Reglas de negocio
- React Navigation es la librería de navegación obligatoria
- No se implementa deep linking en esta versión (se deja preparado para el futuro)
- La navegación es modular: cada módulo define sus propias rutas
- Los nombres de rutas se definen en un archivo de constantes centralizado
- No se permite navegar a pantallas protegidas sin autenticación bajo ninguna circunstancia
