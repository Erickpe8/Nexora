import { Router } from 'express'
import { middlewareAuth } from '../middlewares/autenticacion'
import {
  controladorEliminarComentario,
  controladorCrearComentario,
  controladorObtenerComentarios,
} from '../controllers/comentarios.controlador'
import { controladorCrearDenuncia } from '../controllers/moderacion.controlador'
import { controladorDarLike, controladorQuitarLike } from '../controllers/likes.controlador'
import { controladorCompartirComentario } from '../controllers/engagement.controlador'
import { validar } from '../middlewares/validacion'
import rateLimit from 'express-rate-limit'

const rutasComentarios = Router()

const limitadorCompartir = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  message: { error: 'Límite de compartidos excedido', codigo: 429 },
  standardHeaders: true,
  legacyHeaders: false,
})

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

/** POST /api/comentarios/:id/compartir */
rutasComentarios.post('/:id/compartir', limitadorCompartir, controladorCompartirComentario)

export default rutasComentarios
