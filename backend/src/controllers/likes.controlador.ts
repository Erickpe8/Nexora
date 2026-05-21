import { Request, Response, NextFunction } from 'express'
import type { RequestAutenticado } from '../types'
import { darLike, quitarLike } from '../services/likes.servicio'

export const controladorDarLike = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comentarioId = Number(req.params.id)
    const { id: usuarioId } = (req as RequestAutenticado).usuario
    const resumen = await darLike(comentarioId, usuarioId)
    res.status(200).json({ datos: resumen })
  } catch (error) {
    next(error)
  }
}

export const controladorQuitarLike = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comentarioId = Number(req.params.id)
    const { id: usuarioId } = (req as RequestAutenticado).usuario
    const resumen = await quitarLike(comentarioId, usuarioId)
    res.status(200).json({ datos: resumen })
  } catch (error) {
    next(error)
  }
}
