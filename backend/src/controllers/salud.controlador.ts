import type { Request, Response } from 'express'
import { obtenerListo, obtenerVivo, obtenerSaludCompleta } from '../services/salud.servicio'

const versionApi = '1.0.0'

export const controladorListo = (_req: Request, res: Response): void => {
  res.json({ datos: obtenerListo() })
}

export const controladorVivo = async (_req: Request, res: Response): Promise<void> => {
  const { vivo, mysql } = await obtenerVivo()
  if (!vivo) {
    res.status(503).json({
      error: 'MySQL no responde; servicio no listo para tráfico',
      codigo: 503,
      datos: { vivo: false, mysql },
    })
    return
  }
  res.json({ datos: { vivo: true, mysql } })
}

export const controladorSalud = async (_req: Request, res: Response): Promise<void> => {
  const estado = await obtenerSaludCompleta(versionApi)
  res.json({ datos: estado })
}
