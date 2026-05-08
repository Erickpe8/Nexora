import { Router } from 'express'
import { middlewareAuth } from '../middlewares/autenticacion'
import { controladorObtenerFeed, controladorObtenerPublicacion } from '../controllers/publicaciones.controlador'
import { controladorCrearComentario, controladorObtenerComentarios } from '../controllers/comentarios.controlador'

const rutasPublicaciones = Router()

rutasPublicaciones.use(middlewareAuth)
rutasPublicaciones.get('/', controladorObtenerFeed)
rutasPublicaciones.get('/:id', controladorObtenerPublicacion)
rutasPublicaciones.get('/:id/comentarios', controladorObtenerComentarios)
rutasPublicaciones.post('/:id/comentarios', controladorCrearComentario)

export default rutasPublicaciones
