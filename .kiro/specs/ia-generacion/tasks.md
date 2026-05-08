# Tareas de Implementación — Generación Automática con IA

## Servicios y configuración

- [ ] Agregar `DEEPSEEK_API_KEY` al archivo `.env`
- [ ] Crear `servicioDeepSeek` en `backend/src/ia/`
  - [ ] Configurar cliente HTTP (axios) con base URL y timeout de 25 segundos
  - [ ] Método `generarPublicaciones(cantidad: number): Promise<PublicacionIA[]>`
  - [ ] Construir el prompt con la cantidad solicitada
  - [ ] Hacer POST a la API de DeepSeek con el modelo `deepseek-chat`
  - [ ] Parsear y devolver el array JSON de la respuesta
  - [ ] Manejar errores de red y respuestas malformadas

## Cron job

- [ ] Instalar `node-cron` en el backend
- [ ] Crear `cronGenerador` en `backend/src/ia/`
  - [ ] Configurar ejecución cada hora (`0 * * * *`)
  - [ ] Implementar lock simple con flag `enEjecucion` para evitar ejecuciones simultáneas
  - [ ] Llamar a `servicioDeepSeek.generarPublicaciones(4)`
  - [ ] Pasar resultado a `servicioPublicacionesIA.procesarLote()`
  - [ ] Emitir evento WebSocket `nuevas_publicaciones` al finalizar con éxito
  - [ ] Registrar resultado en `loggerGeneracion`
- [ ] Inicializar el cron job al arrancar el servidor

## Validación y sanitización

- [ ] Crear `servicioPublicacionesIA` en `backend/src/ia/`
  - [ ] Método `validar(publicacion)`: verificar campos requeridos y longitudes
  - [ ] Método `sanitizar(publicacion)`: limpiar HTML, normalizar espacios
  - [ ] Método `esDuplicado(titulo)`: buscar título exacto en MySQL
  - [ ] Método `procesarLote(publicaciones)`: iterar, validar, sanitizar, guardar
  - [ ] Devolver `ResultadoGeneracion` con conteos y errores

## Logs

- [ ] Crear `loggerGeneracion` en `backend/src/ia/`
  - [ ] Registrar cada ejecución con: timestamp, publicaciones guardadas, descartadas, errores, duración
  - [ ] Guardar logs en archivo `logs/generacion.log` con rotación diaria
  - [ ] Imprimir resumen en consola al finalizar cada ciclo

## Manejo de errores

- [ ] Capturar timeout de DeepSeek API y registrar sin romper el servidor
- [ ] Capturar error de parseo JSON y registrar con el contenido recibido
- [ ] Capturar errores de MySQL por publicación individual sin abortar el lote
- [ ] Enviar alerta en consola si 3 ciclos consecutivos fallan completamente

## Pruebas

- [ ] Verificar que el cron job genera publicaciones correctamente con respuesta válida de DeepSeek
- [ ] Verificar que publicaciones con campos inválidos se descartan sin romper el lote
- [ ] Verificar que títulos duplicados se detectan y descartan
- [ ] Verificar que el lock evita ejecuciones simultáneas
- [ ] Verificar que el WebSocket emite `nuevas_publicaciones` al finalizar
- [ ] Verificar que los logs registran correctamente cada ejecución
- [ ] Simular timeout de DeepSeek y verificar que el servidor no cae
