# Tareas de Implementación — Feed con IA

## Backend

- [ ] Crear tabla `publicaciones` en MySQL con los campos definidos en el diseño
- [ ] Instalar y configurar `node-cron` para el cron job horario
- [ ] Crear servicio `servicioDeepSeek` para comunicarse con la DeepSeek API
  - [ ] Construir el prompt de generación de noticias
  - [ ] Parsear y validar la respuesta JSON de DeepSeek
- [ ] Crear el cron job `generadorPublicaciones`
  - [ ] Ejecutar cada hora
  - [ ] Llamar a `servicioDeepSeek` para obtener publicaciones
  - [ ] Guardar cada publicación en MySQL
  - [ ] Emitir evento WebSocket `nuevas_publicaciones` al finalizar
- [ ] Crear endpoint `GET /api/publicaciones`
  - [ ] Soportar parámetros `pagina` y `limite`
  - [ ] Ordenar por `creado_en` descendente
  - [ ] Incluir `totalComentarios` en cada publicación
  - [ ] Devolver metadatos de paginación
- [ ] Crear endpoint `GET /api/publicaciones/:id`
  - [ ] Devolver publicación completa con `totalComentarios`
  - [ ] Retornar 404 si no existe
- [ ] Proteger ambos endpoints con middleware `verificarToken`

## Frontend

- [ ] Crear tipos `Publicacion` y `RespuestaFeed` en `src/types/`
- [ ] Crear `servicioPublicaciones` en `src/services/`
  - [ ] Método `obtenerFeed(pagina, limite)`
  - [ ] Método `obtenerDetalle(id)`
- [ ] Crear hook `useFeed` en `src/hooks/`
  - [ ] Estado: `publicaciones`, `cargando`, `error`, `pagina`, `hayMas`
  - [ ] Métodos: `cargar()`, `cargarMas()`, `refrescar()`
- [ ] Crear hook `usePublicacionesNuevas` en `src/hooks/`
  - [ ] Conectar al WebSocket al montar
  - [ ] Escuchar evento `nuevas_publicaciones`
  - [ ] Exponer estado `hayNuevas` y método `limpiar()`
- [ ] Crear componente `TarjetaPublicacion` en `src/components/`
  - [ ] Mostrar título, resumen truncado, pregunta, fecha y total de comentarios
  - [ ] Incluir `InsigniaIA` si `generadoPorIa` es true
  - [ ] Navegable al detalle al tocar
- [ ] Crear componente `InsigniaIA` en `src/components/`
- [ ] Crear componente `BannerNuevasPublicaciones` en `src/components/`
  - [ ] Mostrar cantidad de nuevas publicaciones
  - [ ] Al tocar, llamar a `useFeed.refrescar()`
- [ ] Crear componente `CargadorFeed` (skeleton) en `src/components/`
- [ ] Crear pantalla `PantallaFeed` en `src/screens/`
  - [ ] FlatList con `TarjetaPublicacion`
  - [ ] Scroll infinito con `onEndReached`
  - [ ] Pull-to-refresh
  - [ ] Mostrar `BannerNuevasPublicaciones` cuando corresponda
- [ ] Crear pantalla `PantallaDetalle` en `src/screens/`
  - [ ] Mostrar contenido completo de la publicación
  - [ ] Sección de comentarios (integrar con módulo de comentarios)

## Pruebas

- [ ] Verificar que el cron job genera publicaciones correctamente
- [ ] Verificar que el endpoint de feed devuelve publicaciones paginadas
- [ ] Verificar que el scroll infinito carga más publicaciones
- [ ] Verificar que el WebSocket notifica nuevas publicaciones en tiempo real
- [ ] Verificar que el banner aparece y recarga el feed correctamente
- [ ] Verificar manejo de error cuando la API de DeepSeek falla
