import { Request, Response, NextFunction } from 'express'
import { ejecutarCicloOrquestadorGeneracionIA } from '../services/orquestadorGeneracionIA.servicio'
import { registro } from '../shared/logger/registro'

const CONTEXTO = 'InternoControlador'

/**
 * POST /api/interno/ia/generar
 * Dispara manualmente un ciclo de generación IA.
 * Protegido por API key interna — solo para desarrollo/testing.
 */
export const controladorGenerarIA = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    registro.info(CONTEXTO, 'Disparo manual de generación IA solicitado')
    const resultado = await ejecutarCicloOrquestadorGeneracionIA()
    res.status(200).json({ datos: resultado })
  } catch (error) {
    next(error)
  }
}
