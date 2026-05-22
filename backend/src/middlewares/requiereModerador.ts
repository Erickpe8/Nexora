import { Request, Response, NextFunction } from 'express'
import type { RequestAutenticado } from '../types'
import { usuarioEsModerador } from '../utils/moderador'

/** Middleware de rol moderador (MODERADOR_IDS). */
export const requiereModerador = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = (req as RequestAutenticado).usuario
  if (!usuarioEsModerador(id)) {
    res.status(403).json({ error: 'Acceso restringido a moderadores', codigo: 403 })
    return
  }
  next()
}
