import { Router } from 'express'
import { middlewareAuth } from '../middlewares/autenticacion'
import {
  controladorEliminarComentario,
  controladorCrearComentario,
  controladorObtenerComentarios,
} from '../controllers/comentarios.controlador'
import { controladorCrearDenuncia } from '../controllers/moderacion.controlador'
import { controladorDarLike, controladorQuitarLike } from '../controllers/likes.controlador'
import { validar } from '../middlewares/validacion'

const rutasComentarios = Router()

rutasComentarios.use(middlewareAuth)

/** DELETE /api/comentarios/:id */
rutasComentarios.delete('/:id', controladorEliminarComentario)

/** POST /api/comentarios/:id/denuncias */
rutasComentarios.post(
  '/:id/denuncias',
  validar({
    motivo: { tipo: 'string', requerido: true },
  }),
  controladorCrearDenuncia
)

/** POST /api/comentarios/:id/likes */
rutasComentarios.post('/:id/likes', controladorDarLike)

/** DELETE /api/comentarios/:id/likes */
rutasComentarios.delete('/:id/likes', controladorQuitarLike)

export default rutasComentarios
