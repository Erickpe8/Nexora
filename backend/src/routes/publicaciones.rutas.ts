import { Router } from 'express'
import { middlewareAuth } from '../middlewares/autenticacion'
import { controladorObtenerFeed, controladorObtenerPublicacion } from '../controllers/publicaciones.controlador'
import { controladorCrearComentario, controladorObtenerComentarios } from '../controllers/comentarios.controlador'
import { controladorReaccionar, controladorQuitarReaccion, controladorObtenerReacciones } from '../controllers/reacciones.controlador'

const rutasPublicaciones = Router()

rutasPublicaciones.use(middlewareAuth)
rutasPublicaciones.get('/', controladorObtenerFeed)
rutasPublicaciones.get('/:id', controladorObtenerPublicacion)
rutasPublicaciones.get('/:id/comentarios', controladorObtenerComentarios)
rutasPublicaciones.post('/:id/comentarios', controladorCrearComentario)
rutasPublicaciones.get('/:id/reacciones', controladorObtenerReacciones)
rutasPublicaciones.post('/:id/reacciones', controladorReaccionar)
rutasPublicaciones.delete('/:id/reacciones', controladorQuitarReaccion)

export default rutasPublicaciones
