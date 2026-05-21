import { Request, Response, NextFunction } from 'express'
import type { RequestAutenticado } from '../types'

/**
 * Middleware de rol moderador.
 * En v1 usa la variable de entorno MODERADOR_IDS (lista de IDs separados por coma).
 * Evolución futura: claims de rol en JWT o tabla `usuarios_rol`.
 */
export const requiereModerador = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = (req as RequestAutenticado).usuario
  const idsRaw = process.env.MODERADOR_IDS ?? ''
  const idsModerador = idsRaw
    .split(',')
    .map(s => Number(s.trim()))
    .filter(n => !Number.isNaN(n) && n > 0)

  // En desarrollo, si no hay IDs configurados, permitir acceso para facilitar testing
  if (process.env.NODE_ENV !== 'production' && idsModerador.length === 0) {
    next()
    return
  }

  if (!idsModerador.includes(id)) {
    res.status(403).json({ error: 'Acceso restringido a moderadores', codigo: 403 })
    return
  }

  next()
}
