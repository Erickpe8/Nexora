import { Request, Response, NextFunction } from 'express'
import { obtenerFeedPaginado, obtenerPublicacionPorId } from '../services/publicaciones.servicio'

export const controladorObtenerFeed = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pagina = Number(req.query.pagina ?? 1)
    const limite = Number(req.query.limite ?? 10)
    const datos = await obtenerFeedPaginado(pagina, limite)
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
    const datos = await obtenerPublicacionPorId(publicacionId)
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}
