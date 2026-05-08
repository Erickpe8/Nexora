import { Request, Response, NextFunction } from 'express'
import { verificarToken } from '../utils/jwt'
import type { RequestAutenticado } from '../types'

// Middleware que verifica el JWT en el header Authorization
// Adjunta req.usuario con los datos del token si es válido
export const middlewareAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticación requerido', codigo: 401 })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const usuario = verificarToken(token)
    ;(req as RequestAutenticado).usuario = usuario
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado', codigo: 401 })
  }
}
