import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { middlewareAuth } from '../middlewares/autenticacion'
import { controladorObtenerFeed, controladorObtenerPublicacion } from '../controllers/publicaciones.controlador'
import {
  controladorActualizarGuardado,
  controladorCompartirPublicacion,
  controladorPublicacionPorSlug,
  controladorToggleGuardado,
} from '../controllers/engagement.controlador'
import { controladorCrearComentario, controladorObtenerComentarios } from '../controllers/comentarios.controlador'
import { controladorReaccionar, controladorQuitarReaccion, controladorObtenerReacciones } from '../controllers/reacciones.controlador'

const rutasPublicaciones = Router()

const limitadorCompartir = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  message: { error: 'Límite de compartidos excedido', codigo: 429 },
  standardHeaders: true,
  legacyHeaders: false,
})

rutasPublicaciones.use(middlewareAuth)
rutasPublicaciones.get('/', controladorObtenerFeed)
rutasPublicaciones.get('/slug/:slug', controladorPublicacionPorSlug)
rutasPublicaciones.post('/:id/guardar', controladorToggleGuardado)
rutasPublicaciones.patch('/:id/guardar', controladorActualizarGuardado)
rutasPublicaciones.post('/:id/compartir', limitadorCompartir, controladorCompartirPublicacion)
rutasPublicaciones.get('/:id', controladorObtenerPublicacion)
rutasPublicaciones.get('/:id/comentarios', controladorObtenerComentarios)
rutasPublicaciones.post('/:id/comentarios', controladorCrearComentario)
rutasPublicaciones.get('/:id/reacciones', controladorObtenerReacciones)
rutasPublicaciones.post('/:id/reacciones', controladorReaccionar)
rutasPublicaciones.delete('/:id/reacciones', controladorQuitarReaccion)

export default rutasPublicaciones
