import { Router } from 'express'
import { middlewareAuth } from '../middlewares/autenticacion'
import { requiereModerador } from '../middlewares/requiereModerador'
import { controladorListarDenuncias, controladorModerarComentario } from '../controllers/moderacion.controlador'
import { validar } from '../middlewares/validacion'

const rutasModeracion = Router()

rutasModeracion.use(middlewareAuth)

/** GET /api/moderacion/denuncias — solo moderadores */
rutasModeracion.get('/denuncias', requiereModerador, controladorListarDenuncias)

/** PATCH /api/moderacion/comentarios/:id — solo moderadores */
rutasModeracion.patch(
  '/comentarios/:id',
  requiereModerador,
  validar({
    accion: { tipo: 'string', requerido: true },
  }),
  controladorModerarComentario
)

export default rutasModeracion
