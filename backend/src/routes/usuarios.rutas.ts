import { Router } from 'express'
import { middlewareAuth } from '../middlewares/autenticacion'
import {
  controladorActualizarPerfil,
  controladorHistorialUsuario,
  controladorPerfilPropio,
  controladorPerfilPublico,
} from '../controllers/usuarios.controlador'

const rutasUsuarios = Router()

rutasUsuarios.use(middlewareAuth)
rutasUsuarios.get('/perfil', controladorPerfilPropio)
rutasUsuarios.patch('/perfil', controladorActualizarPerfil)
rutasUsuarios.get('/:id', controladorPerfilPublico)
rutasUsuarios.get('/:id/comentarios', controladorHistorialUsuario)

export default rutasUsuarios
