import jwt from 'jsonwebtoken'
import { entorno } from '../shared/config/entorno'
import type { UsuarioToken } from '../types'

// Generar token JWT para un usuario autenticado
export const generarToken = (usuario: UsuarioToken): string => {
  return jwt.sign(usuario, entorno.jwt.secreto, {
    expiresIn: entorno.jwt.expiracion as jwt.SignOptions['expiresIn'],
  })
}

// Verificar y decodificar un token JWT
export const verificarToken = (token: string): UsuarioToken => {
  return jwt.verify(token, entorno.jwt.secreto) as UsuarioToken
}
