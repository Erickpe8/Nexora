# Hook — Validar Convenciones

## Propósito
Verificar que el código generado o modificado cumple con las convenciones definidas en `convenciones.md` antes de hacer commit.

## Convenciones a validar

### Idioma
- [ ] Variables en español y camelCase (`const nombreUsuario`, no `const userName`)
- [ ] Funciones en español y camelCase (`function obtenerPerfil()`, no `function getProfile()`)
- [ ] Interfaces y types en español y PascalCase (`interface PerfilUsuario`, no `interface UserProfile`)
- [ ] Componentes en español y PascalCase (`TarjetaPublicacion`, no `PostCard`)
- [ ] Archivos en español y kebab-case (`tarjeta-publicacion.tsx`, no `PostCard.tsx`)
- [ ] Carpetas en español y kebab-case

### Estructura
- [ ] Un componente por archivo
- [ ] Componentes en `src/components/` o `src/screens/`
- [ ] Hooks en `src/hooks/` con prefijo `use` (`useAutenticacion`)
- [ ] Servicios en `src/services/` con sufijo `servicio` (`servicioAuth`)
- [ ] Tipos en `src/types/`
- [ ] Utilidades en `src/utils/`

### Código
- [ ] No hay `any` sin justificación
- [ ] Todas las funciones tienen tipos de retorno explícitos cuando no son obvios
- [ ] No hay lógica de negocio dentro de componentes de UI
- [ ] No hay llamadas directas a la API desde componentes (usar servicios)
- [ ] No hay estilos inline con `StyleSheet` (usar NativeWind)

### Comentarios
- [ ] Solo hay comentarios donde aportan valor real
- [ ] No hay código comentado sin explicación
- [ ] Los comentarios están en español

## Señales de alerta
- Nombres en inglés en variables, funciones o archivos
- Componentes con más de 150 líneas (posible violación de responsabilidad única)
- Lógica de negocio mezclada con JSX
- Llamadas a `axios` directamente desde un componente
- Uso de `StyleSheet.create` en lugar de clases NativeWind
