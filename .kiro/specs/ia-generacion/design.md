# Diseño Técnico — Generación Automática con IA

## Arquitectura general

El módulo de generación IA vive completamente en el backend. Un cron job orquesta el proceso: consulta DeepSeek API, valida la respuesta, sanitiza el contenido, previene duplicados y persiste las publicaciones en MySQL. Al finalizar, notifica al feed vía WebSocket.

## Estructura del backend

### Módulos
- `cronGenerador` — orquesta el proceso completo cada hora
- `servicioDeepSeek` — comunicación con la API de DeepSeek
- `servicioPublicacionesIA` — validación, sanitización y persistencia
- `loggerGeneracion` — registro de cada ejecución con resultado y errores

## Flujo de generación

```
cronGenerador (cada hora)
  └── servicioDeepSeek.generarPublicaciones()
        └── Construir prompt
        └── POST a DeepSeek API
        └── Parsear respuesta JSON
  └── servicioPublicacionesIA.procesarLote(publicaciones)
        └── Validar cada publicación
        └── Sanitizar contenido
        └── Verificar duplicados
        └── Guardar en MySQL
  └── Emitir WebSocket 'nuevas_publicaciones'
  └── loggerGeneracion.registrar(resultado)
```

## Integración con DeepSeek API

### Configuración
- Endpoint: `https://api.deepseek.com/v1/chat/completions`
- Modelo: `deepseek-chat`
- Timeout: 25 segundos
- API key en variable de entorno `DEEPSEEK_API_KEY`

### Prompt de generación
```
Eres un editor de noticias tecnológicas. Genera exactamente {n} publicaciones 
sobre noticias tecnológicas actuales y relevantes de las últimas 24 horas.

Para cada publicación incluye:
- titulo: título claro, informativo y atractivo (máx. 100 caracteres)
- resumen: resumen objetivo de máximo 300 palabras
- pregunta: pregunta controversial que invite al debate técnico
- etiquetas: array de 2-3 categorías (ej: "IA", "programación", "hardware", "startups", "ciberseguridad")

Responde ÚNICAMENTE con un array JSON válido, sin texto adicional.
Ejemplo: [{"titulo":"...","resumen":"...","pregunta":"...","etiquetas":["IA"]}]
```

### Manejo de respuesta
1. Parsear el JSON de la respuesta
2. Si el parseo falla, registrar error y abortar el ciclo
3. Iterar sobre cada publicación del array

## Validaciones

Por cada publicación generada:
- `titulo`: requerido, string, máx. 100 caracteres
- `resumen`: requerido, string, máx. 300 palabras (≈ 2000 caracteres)
- `pregunta`: requerido, string, no vacío
- `etiquetas`: array de strings, mínimo 1, máximo 3

## Sanitización
- Eliminar caracteres de control y HTML
- Normalizar espacios en blanco
- Truncar campos que superen el límite máximo

## Prevención de duplicados
```typescript
// Verificar por similitud de título (búsqueda exacta)
const existe = await buscarPorTitulo(publicacion.titulo)
if (existe) {
  logger.warn(`Duplicado detectado: "${publicacion.titulo}"`)
  continue
}
```

## Manejo de errores y reintentos

| Escenario                        | Comportamiento                                      |
|----------------------------------|-----------------------------------------------------|
| DeepSeek no responde (timeout)   | Registrar error, esperar al siguiente ciclo         |
| Respuesta JSON inválida          | Registrar error, esperar al siguiente ciclo         |
| Publicación con datos inválidos  | Descartar esa publicación, continuar con las demás  |
| Error de base de datos           | Registrar error, continuar con la siguiente         |
| Cron ya en ejecución             | Ignorar nueva ejecución (lock simple con flag)      |

## Estructura de logs

```typescript
interface LogGeneracion {
  timestamp: string
  publicacionesIntentadas: number
  publicacionesGuardadas: number
  publicacionesDescartadas: number
  errores: string[]
  duracionMs: number
}
```

## Tipos TypeScript

```typescript
interface PublicacionIA {
  titulo: string
  resumen: string
  pregunta: string
  etiquetas: string[]
}

interface ResultadoGeneracion {
  guardadas: number
  descartadas: number
  errores: string[]
}
```
