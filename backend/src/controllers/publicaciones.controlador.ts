import { Request, Response, NextFunction } from 'express'
import { obtenerFeedPaginado, obtenerPublicacionPorId } from '../services/publicaciones.servicio'
import type { RequestAutenticado } from '../types'

export const controladorObtenerFeed = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pagina = Number(req.query.pagina ?? 1)
    const limite = Number(req.query.limite ?? 10)
    const buscar = (req.query.buscar as string | undefined) ?? ''
    const { id: usuarioId } = (req as RequestAutenticado).usuario
    const datos = await obtenerFeedPaginado(pagina, limite, usuarioId, buscar)
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}

export const controladorObtenerPublicacion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const publicacionId = Number(req.params.id)
    const { id: usuarioId } = (req as RequestAutenticado).usuario
    const datos = await obtenerPublicacionPorId(publicacionId, usuarioId)
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}
