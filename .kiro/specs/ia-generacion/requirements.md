# Requisitos — Generación Automática con IA

## Objetivo
Generar automáticamente publicaciones de calidad cada hora usando DeepSeek API, con noticias tecnológicas actuales, resúmenes claros y preguntas controversiales que incentiven el debate.

## Funcionalidades

### Generación automática de publicaciones
- El sistema genera entre 3 y 5 publicaciones nuevas cada hora de forma automática
- Cada publicación contiene: título, resumen (máx. 300 palabras), pregunta controversial y etiquetas
- Las publicaciones se guardan en la base de datos y se distribuyen al feed en tiempo real

### Selección de noticias
- La IA selecciona noticias tecnológicas actuales y relevantes
- Las categorías cubiertas incluyen: inteligencia artificial, programación, hardware, startups, ciberseguridad e innovación
- Se prioriza contenido reciente (últimas 24 horas) sobre contenido antiguo

### Frecuencia del cron
- El cron job se ejecuta exactamente cada hora (ej: 00:00, 01:00, 02:00...)
- Si una ejecución falla, se registra el error y se reintenta en el siguiente ciclo
- No se ejecutan dos instancias del cron simultáneamente

### Validaciones de la IA
- La respuesta de DeepSeek se valida antes de guardar en la base de datos
- Se verifica que cada publicación tenga todos los campos requeridos
- Se verifica que el resumen no supere 300 palabras
- Se verifica que la pregunta no esté vacía
- Las publicaciones con datos inválidos se descartan con registro de error

### Prevención de duplicados
- Antes de guardar, se verifica que el título no exista ya en la base de datos
- Si se detecta un duplicado, se descarta la publicación y se registra en el log
- El sistema tolera duplicados parciales (mismo tema, diferente redacción)

## Comportamiento esperado
- El proceso de generación completo no debe tardar más de 30 segundos
- Si DeepSeek API no responde, el cron registra el error y continúa en el siguiente ciclo
- Los logs de cada ejecución quedan registrados con timestamp, resultado y errores
- El sistema funciona de forma autónoma sin intervención manual

## Reglas de negocio
- Solo el sistema puede crear publicaciones, no los usuarios
- Todas las publicaciones generadas se marcan con `generadoPorIa: true`
- El contenido debe ser apropiado para una audiencia técnica profesional
- No se generan publicaciones sobre temas no relacionados con tecnología
- Las publicaciones generadas no se editan ni eliminan automáticamente
