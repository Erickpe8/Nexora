import { Router } from 'express'
import { controladorLogin, controladorRegistro, controladorVerificarSesion } from '../controllers/auth.controlador'
import { validar } from '../middlewares/validacion'
import { middlewareAuth } from '../middlewares/autenticacion'
import { limitadorAuth } from '../middlewares/rateLimiting'

const rutasAuth = Router()

rutasAuth.post(
  '/registro',
  limitadorAuth,
  validar({
    nombre: { tipo: 'string', requerido: true, minLongitud: 3, maxLongitud: 30 },
    correo: { tipo: 'email', requerido: true },
    contrasena: { tipo: 'string', requerido: true, minLongitud: 8 },
  }),
  controladorRegistro
)

rutasAuth.post(
  '/login',
  limitadorAuth,
  validar({
    correo: { tipo: 'email', requerido: true },
    contrasena: { tipo: 'string', requerido: true, minLongitud: 8 },
  }),
  controladorLogin
)

rutasAuth.get('/verificar', middlewareAuth, controladorVerificarSesion)

export default rutasAuth
