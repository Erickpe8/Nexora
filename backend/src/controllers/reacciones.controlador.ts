import { Request, Response, NextFunction } from 'express'
import type { RequestAutenticado, TipoReaccion } from '../types'
import { reaccionar, quitarReaccion, obtenerResumenReacciones } from '../services/reacciones.servicio'

export const controladorReaccionar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const publicacionId = Number(req.params.id)
    const { id: usuarioId } = (req as RequestAutenticado).usuario
    const { tipo } = req.body as { tipo: TipoReaccion }
    const resumen = await reaccionar(publicacionId, usuarioId, tipo)
    res.status(200).json({ datos: resumen })
  } catch (error) {
    next(error)
  }
}

export const controladorQuitarReaccion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const publicacionId = Number(req.params.id)
    const { id: usuarioId } = (req as RequestAutenticado).usuario
    const resumen = await quitarReaccion(publicacionId, usuarioId)
    res.status(200).json({ datos: resumen })
  } catch (error) {
    next(error)
  }
}

export const controladorObtenerReacciones = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const publicacionId = Number(req.params.id)
    const { id: usuarioId } = (req as RequestAutenticado).usuario
    const resumen = await obtenerResumenReacciones(publicacionId, usuarioId)
    res.status(200).json({ datos: resumen })
  } catch (error) {
    next(error)
  }
}
