import { Request, Response, NextFunction } from 'express'
import type { RequestAutenticado } from '../types'
import { marcarNotificacionLeida, marcarTodasLeidas, obtenerNotificacionesUsuario } from '../services/notificaciones.servicio'

export const controladorObtenerNotificaciones = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = (req as RequestAutenticado).usuario
    const datos = await obtenerNotificacionesUsuario(id)
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}

export const controladorMarcarLeida = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = (req as RequestAutenticado).usuario
    await marcarNotificacionLeida(id, Number(req.params.id))
    res.status(200).json({ datos: { ok: true } })
  } catch (error) {
    next(error)
  }
}

export const controladorMarcarTodasLeidas = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = (req as RequestAutenticado).usuario
    await marcarTodasLeidas(id)
    res.status(200).json({ datos: { ok: true } })
  } catch (error) {
    next(error)
  }
}
