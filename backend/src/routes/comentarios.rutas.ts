import { Router } from 'express'
import { middlewareAuth } from '../middlewares/autenticacion'
import { controladorEliminarComentario } from '../controllers/comentarios.controlador'

const rutasComentarios = Router()

rutasComentarios.use(middlewareAuth)
rutasComentarios.delete('/:id', controladorEliminarComentario)

export default rutasComentarios
