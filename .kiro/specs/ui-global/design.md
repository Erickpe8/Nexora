# Diseño Técnico — UI Global

## Paleta de colores (tema oscuro)

```typescript
// src/styles/colores.ts
export const colores = {
  // Fondos
  fondoPrincipal:   '#0F0F0F',  // fondo de pantallas
  fondoTarjeta:     '#1A1A1A',  // cards y contenedores
  fondoElevado:     '#242424',  // modales, inputs

  // Textos
  textoBase:        '#F0F0F0',  // texto principal
  textoSecundario:  '#9A9A9A',  // texto secundario, fechas
  textoDeshabilitado: '#555555',

  // Acento
  acento:           '#6C63FF',  // color principal de marca (violeta)
  acentoClaro:      '#8B85FF',  // hover / estados activos

  // Estados
  exito:            '#4CAF50',
  error:            '#F44336',
  advertencia:      '#FF9800',
  info:             '#2196F3',

  // Bordes
  borde:            '#2A2A2A',
  bordeFocus:       '#6C63FF',

  // Overlay
  overlay:          'rgba(0, 0, 0, 0.6)',
}
```

## Tipografía

```typescript
// src/styles/tipografia.ts
export const tipografia = {
  // Tamaños
  xs:   12,
  sm:   14,
  base: 16,
  lg:   18,
  xl:   20,
  xxl:  24,
  xxxl: 30,

  // Pesos
  normal:    '400',
  medio:     '500',
  semibold:  '600',
  bold:      '700',
}
```

## Espaciado

```typescript
// src/styles/espaciado.ts
export const espaciado = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  xxl:  32,
  xxxl: 48,
}
```

## Componentes base

### `Boton`
Props: `variante` (primario | secundario | fantasma | peligro), `tamaño` (sm | md | lg), `cargando`, `deshabilitado`, `onPress`, `children`

### `Entrada`
Props: `etiqueta`, `placeholder`, `error`, `tipo` (texto | contrasena | email), `valor`, `onChange`

### `Tarjeta`
Props: `children`, `relleno` (sm | md | lg), `onPress` (opcional para tarjetas tocables)

### `Texto`
Props: `variante` (titulo | subtitulo | cuerpo | caption | etiqueta), `color`, `centrado`, `children`

### `Cargador`
Props: `tamaño` (sm | md | lg), `color`

### `EsqueletoTarjeta`
Skeleton animado con el mismo layout que `TarjetaPublicacion`

### `EstadoVacio`
Props: `mensaje`, `icono` (opcional)

### `Divisor`
Línea horizontal con el color de borde del tema

### `Insignia`
Props: `texto`, `variante` (acento | exito | error | info)

### `Icono`
Componente central de iconografía (`mobile/src/components/Icono.tsx`).

- Fuente: **Ionicons outline** (`@expo/vector-icons`), estilo similar a Flowbite/Heroicons.
- API: `nombre` (`NombreIcono`), `tamano`, `color`, `enfocado` (opacidad en tabs).
- Export: `iconoPorReaccion(tipo)` para mapear reacciones del feed.
- **Prohibido** en UI de producto: emojis Unicode como sustituto de iconos.

Nombres habituales: `inicio`, `notificaciones`, `perfil`, `buscar`, `cerrar`, `corazon`, `corazon-vacio`, `me-gusta`, `fuego`, `increible`, `curioso`, `ojo`, `ojo-cerrado`, `alerta`, `confirmar`.

### Componentes de dominio (fuera del kit base)
`BarraBusqueda`, `BotonesReaccion`, `ModalDenuncia`, `TarjetaPublicacion`, etc. — usan `Icono` donde corresponda.

## Layout mobile-first

- Padding horizontal estándar de pantalla: `espaciado.lg` (16px)
- Altura de la barra de tabs: 60px
- Altura del header de navegación: 56px
- Área segura manejada con `SafeAreaView` en todas las pantallas
- Scroll siempre con `KeyboardAvoidingView` en pantallas con formularios

## Configuración NativeWind

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fondo: '#0F0F0F',
        tarjeta: '#1A1A1A',
        acento: '#6C63FF',
      },
    },
  },
}
```

## Animaciones
- Transiciones de opacidad: 150ms ease
- Skeletons: animación de pulso con `Animated` de React Native
- Feedback táctil: `activeOpacity: 0.7` en elementos tocables
