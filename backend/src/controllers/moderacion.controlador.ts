import { Request, Response, NextFunction } from 'express'
import type { RequestAutenticado, NuevaDenuncia } from '../types'
import { crearDenuncia, obtenerDenunciasPaginadas } from '../services/denuncias.servicio'
import { moderarComentario } from '../services/moderacion.servicio'

/** POST /api/comentarios/:id/denuncias */
export const controladorCrearDenuncia = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: autorId } = (req as RequestAutenticado).usuario
    const objetivoId = Number(req.params.id)
    const datos: NuevaDenuncia = {
      tipoObjetivo: 'comentario',
      objetivoId,
      motivo: req.body.motivo,
      detalle: req.body.detalle,
    }
    const denuncia = await crearDenuncia(autorId, datos)
    res.status(201).json({ datos: denuncia })
  } catch (error) {
    next(error)
  }
}

/** GET /api/moderacion/denuncias */
export const controladorListarDenuncias = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pagina = Number(req.query.pagina ?? 1)
    const limite = Number(req.query.limite ?? 20)
    const estado = req.query.estado as string | undefined
    const datos = await obtenerDenunciasPaginadas(pagina, limite, estado)
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}

/** PATCH /api/moderacion/comentarios/:id */
export const controladorModerarComentario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: moderadorId } = (req as RequestAutenticado).usuario
    const comentarioId = Number(req.params.id)
    const accion = req.body.accion as 'oculto' | 'visible'
    const notaInterna = req.body.notaInterna as string | undefined

    if (accion !== 'oculto' && accion !== 'visible') {
      res.status(400).json({ error: 'Acción inválida. Use "oculto" o "visible"', codigo: 400 })
      return
    }

    const resultado = await moderarComentario(comentarioId, accion, moderadorId, notaInterna)
    res.status(200).json({ datos: resultado })
  } catch (error) {
    next(error)
  }
}
