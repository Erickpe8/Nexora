import { Router } from 'express'
import { middlewareAuth } from '../middlewares/autenticacion'
import { middlewareSubidaAvatar } from '../middlewares/subidaAvatar'
import {
  controladorActualizarPerfil,
  controladorHistorialUsuario,
  controladorPerfilPropio,
  controladorPerfilPublico,
  controladorSubirFotoPerfil,
} from '../controllers/usuarios.controlador'
import { controladorFeedGuardados } from '../controllers/engagement.controlador'

const rutasUsuarios = Router()

rutasUsuarios.use(middlewareAuth)
rutasUsuarios.get('/perfil', controladorPerfilPropio)
rutasUsuarios.get('/perfil/guardados', controladorFeedGuardados)
rutasUsuarios.patch('/perfil', controladorActualizarPerfil)
rutasUsuarios.post('/perfil/foto', (req, res, next) => {
  middlewareSubidaAvatar(req, res, err => {
    if (err) {
      next(err)
      return
    }
    void controladorSubirFotoPerfil(req, res, next)
  })
})
rutasUsuarios.get('/:id', controladorPerfilPublico)
rutasUsuarios.get('/:id/comentarios', controladorHistorialUsuario)

export default rutasUsuarios
