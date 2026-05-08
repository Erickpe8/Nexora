import { Router } from 'express'
import { controladorLogin, controladorRegistro, controladorVerificarSesion } from '../controllers/auth.controlador'
import { validar } from '../middlewares/validacion'
import { middlewareAuth } from '../middlewares/autenticacion'

const rutasAuth = Router()

rutasAuth.post(
  '/registro',
  validar({
    nombre: { tipo: 'string', requerido: true, minLongitud: 3, maxLongitud: 30 },
    correo: { tipo: 'email', requerido: true },
    contrasena: { tipo: 'string', requerido: true, minLongitud: 8 },
  }),
  controladorRegistro
)

rutasAuth.post(
  '/login',
  validar({
    correo: { tipo: 'email', requerido: true },
    contrasena: { tipo: 'string', requerido: true, minLongitud: 8 },
  }),
  controladorLogin
)

rutasAuth.get('/verificar', middlewareAuth, controladorVerificarSesion)

export default rutasAuth
