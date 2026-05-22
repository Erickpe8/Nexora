import type { Request, Response, NextFunction } from 'express'
import { sincronizarEsquema } from '../infrastructure/database/sincronizarEsquema'
import { registro } from '../shared/logger/registro'

const CONTEXTO = 'AutoMigrarEsquema'

let promesaSync: Promise<void> | null = null

const obtenerPromesaSync = (): Promise<void> => {
  if (!promesaSync) {
    promesaSync = sincronizarEsquema({ log: Boolean(process.env.VERCEL) }).catch(err => {
      promesaSync = null
      throw err
    })
  }
  return promesaSync
}

/**
 * En Vercel/producción aplica migraciones pendientes antes de atender la ruta.
 * El usuario no tiene que ejecutar `npm run migrar` manualmente.
 */
export const middlewareAutoMigrarEsquema = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const activo =
    process.env.VERCEL === '1' ||
    process.env.NODE_ENV === 'production' ||
    process.env.AUTO_MIGRAR_ESQUEMA === 'true'

  if (!activo) {
    next()
    return
  }

  void obtenerPromesaSync()
    .then(() => next())
    .catch(error => {
      registro.error(CONTEXTO, error)
      next(error)
    })
}
