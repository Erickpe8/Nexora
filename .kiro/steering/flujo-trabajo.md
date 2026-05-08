# Flujo de Trabajo — Nexora

## Git Flow
Toda funcionalidad debe trabajarse en ramas feature con el formato:
```
feature/NN-tk-nombre-funcionalidad
```

Donde `NN` es el número de fase en dos dígitos según el roadmap:
- `01` Fase 1
- `02` Fase 2
- `03` Fase 3
- `04` Fase 4
- `05` Fase 5
- `06` Fase 6
- `07` Fase 7
- `08` Fase 8

Ejemplos:
- `feature/04-tk-autenticacion`
- `feature/05-tk-feed-ia`
- `feature/06-tk-comentarios`

## Commits

**Todos los commits deben estar escritos en español, sin excepción.**

### Formato obligatorio
```
tipo: descripción breve en español
```

### Tipos permitidos
| Tipo       | Cuándo usarlo                                      |
|------------|----------------------------------------------------|
| `feat`     | Nueva funcionalidad                                |
| `fix`      | Corrección de un bug                               |
| `docs`     | Cambios en documentación                           |
| `style`    | Cambios de formato, espaciado (sin lógica)         |
| `refactor` | Refactorización sin cambio de comportamiento       |
| `test`     | Agregar o corregir pruebas                         |
| `chore`    | Tareas de mantenimiento, dependencias, config      |

### Ejemplos correctos
```
feat: agregar pantalla de inicio de sesión
feat: implementar cron job de generación de publicaciones
fix: corregir validación de correo en el registro
fix: resolver error de reconexión en WebSocket
docs: actualizar spec de autenticación con nuevos endpoints
refactor: extraer lógica de feed a hook useFeed
chore: instalar dependencias de React Navigation
test: agregar pruebas al servicio de comentarios
style: aplicar espaciado consistente en TarjetaPublicacion
```

### Ejemplos incorrectos
```
add login screen          ❌ en inglés
fix bug                   ❌ demasiado vago
cambios varios            ❌ no describe qué cambió
feat: Add user profile    ❌ mezcla español e inglés
```

### Reglas adicionales
- La descripción va en minúsculas después del tipo
- Sin punto final en el mensaje
- Máximo 72 caracteres en la primera línea
- Si se necesita más detalle, agregar cuerpo del commit separado por línea en blanco

## Por cada nueva funcionalidad
1. Crear rama `feature/NN-tk-nombre` según el número de fase del roadmap
2. Actualizar documentación
3. Actualizar archivos `.kiro` si aplica
4. Mantener consistencia arquitectónica
5. Incluir pruebas cuando aplique

## Comportamiento esperado de Kiro
- Priorizar simplicidad y mantenibilidad
- Evitar sobreingeniería
- Preservar la estructura existente
- No modificar archivos innecesariamente
- Explicar decisiones técnicas importantes
- Mantener coherencia arquitectónica
- Generar código limpio y listo para producción
- Mantener diseño minimalista y moderno
- Pensar en escalabilidad progresiva
- Seguir estrictamente las convenciones definidas
- Mantener consistencia de nombres en español
- Respetar la separación de responsabilidades
- Generar soluciones aterrizadas y fáciles de mantener
