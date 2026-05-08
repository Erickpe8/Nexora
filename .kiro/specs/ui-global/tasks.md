# Tareas de Implementación — UI Global

## Sistema de tokens

- [ ] Crear `src/styles/colores.ts` con toda la paleta de colores del tema oscuro
- [ ] Crear `src/styles/tipografia.ts` con tamaños y pesos tipográficos
- [ ] Crear `src/styles/espaciado.ts` con la escala de espaciado
- [ ] Crear `src/styles/index.ts` que exporta todo desde un solo punto
- [ ] Configurar `tailwind.config.js` con los colores personalizados de NativeWind

## Componentes base

- [ ] Crear componente `Boton` en `src/components/`
  - [ ] Variantes: primario, secundario, fantasma, peligro
  - [ ] Tamaños: sm, md, lg
  - [ ] Estado de carga con `Cargador` interno
  - [ ] Estado deshabilitado con opacidad reducida
  - [ ] Feedback táctil con `activeOpacity`
- [ ] Crear componente `Entrada` en `src/components/`
  - [ ] Etiqueta superior opcional
  - [ ] Mensaje de error inferior
  - [ ] Tipos: texto, contraseña (con toggle de visibilidad), email
  - [ ] Estilos de foco con `bordeFocus`
- [ ] Crear componente `Tarjeta` en `src/components/`
  - [ ] Variantes de relleno: sm, md, lg
  - [ ] Versión tocable (con `TouchableOpacity`) y no tocable
- [ ] Crear componente `Texto` en `src/components/`
  - [ ] Variantes: titulo, subtitulo, cuerpo, caption, etiqueta
  - [ ] Props: color, centrado, numberOfLines
- [ ] Crear componente `Cargador` en `src/components/`
  - [ ] Tamaños: sm, md, lg
  - [ ] Color configurable (por defecto: acento)
- [ ] Crear componente `EsqueletoTarjeta` en `src/components/`
  - [ ] Animación de pulso con `Animated`
  - [ ] Layout que imita `TarjetaPublicacion`
- [ ] Crear componente `EstadoVacio` en `src/components/`
  - [ ] Ícono opcional
  - [ ] Mensaje principal y secundario
- [ ] Crear componente `Divisor` en `src/components/`
  - [ ] Línea horizontal con color `borde`
  - [ ] Margen vertical configurable
- [ ] Crear componente `Insignia` en `src/components/`
  - [ ] Variantes: acento, exito, error, info
  - [ ] Texto corto (máx. 20 caracteres)

## Layout y estructura

- [ ] Verificar que `SafeAreaView` se usa en todas las pantallas
- [ ] Verificar que `KeyboardAvoidingView` se usa en pantallas con formularios
- [ ] Aplicar padding horizontal estándar (`espaciado.lg`) en todas las pantallas
- [ ] Configurar el tema de React Navigation con los colores del sistema de diseño

## Pruebas visuales

- [ ] Verificar que todos los componentes se renderizan correctamente en iOS y Android
- [ ] Verificar que el tema oscuro es consistente en todas las pantallas
- [ ] Verificar que los estados de carga (skeletons) tienen la animación correcta
- [ ] Verificar que los estados vacíos se muestran cuando no hay datos
- [ ] Verificar que los botones tienen feedback táctil visible
- [ ] Verificar que los inputs muestran errores correctamente
