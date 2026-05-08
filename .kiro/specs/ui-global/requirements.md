# Requisitos — UI Global

## Objetivo
Establecer un sistema de diseño consistente, minimalista y moderno que unifique la experiencia visual de toda la app Nexora, con tema oscuro como base.

## Funcionalidades

### Diseño minimalista
- La interfaz prioriza el contenido sobre la decoración
- Se usan espacios en blanco generosamente para dar respiro visual
- Los elementos de UI son simples, sin sombras excesivas ni gradientes complejos
- Cada pantalla tiene un propósito claro y sin distracciones

### Tema oscuro
- La app usa tema oscuro como único tema en esta versión
- El fondo principal es un negro/gris muy oscuro (no puro negro)
- Los textos usan blanco y grises claros con jerarquía visual clara
- Los colores de acento son vibrantes para destacar sobre el fondo oscuro

### Componentes reutilizables
- Todos los elementos de UI se construyen como componentes reutilizables
- Los componentes aceptan props para variantes (tamaño, color, estado)
- No se repite código de estilos entre pantallas
- Los componentes son accesibles y tienen estados de interacción definidos

### Consistencia visual
- Todos los textos usan la misma familia tipográfica
- Los espaciados siguen una escala definida (4, 8, 12, 16, 24, 32px)
- Los bordes redondeados son consistentes en toda la app
- Los colores de estado (error, éxito, advertencia) son uniformes

## Comportamiento esperado
- Los componentes responden visualmente al toque (feedback táctil)
- Los estados de carga usan skeletons en lugar de spinners cuando es posible
- Los estados vacíos tienen ilustraciones o mensajes amigables
- Las transiciones entre pantallas son suaves y rápidas

## Reglas de negocio
- NativeWind (TailwindCSS) es la herramienta de estilos obligatoria
- No se usan StyleSheet de React Native directamente salvo casos excepcionales
- Los colores se definen en un archivo de tokens centralizado
- La tipografía usa la fuente del sistema por defecto del dispositivo
- El diseño debe verse bien en pantallas de 5" a 7" (móviles estándar)
