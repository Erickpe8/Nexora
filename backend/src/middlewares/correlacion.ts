import { Request, Response, NextFunction } from 'express'
import { generarCorrelacionId } from '../shared/logger/registro'

/**
 * Middleware de correlación y duración de peticiones HTTP.
 * Añade `X-Correlacion-Id` a la respuesta y registra duración al finalizar.
 */
export const middlewareCorrelacion = (req: Request, res: Response, next: NextFunction): void => {
  const correlacionId =
    (req.headers['x-correlacion-id'] as string | undefined) ?? generarCorrelacionId()

  res.setHeader('X-Correlacion-Id', correlacionId)
  ;(req as Request & { correlacionId: string }).correlacionId = correlacionId

  const inicio = Date.now()

  res.on('finish', () => {
    const duracionMs = Date.now() - inicio
    const nivel = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'advertencia' : 'info'

    // Evitar ruido en rutas de salud
    const esRutaSalud = req.path.startsWith('/api/salud')

    if (!esRutaSalud || res.statusCode >= 400) {
      const linea = JSON.stringify({
        timestamp: new Date().toISOString(),
        nivel,
        contexto: 'HTTP',
        mensaje: `${req.method} ${req.path} ${res.statusCode}`,
        correlacionId,
        duracionMs,
        metodo: req.method,
        ruta: req.path,
        status: res.statusCode,
      })

      if (nivel === 'error') {
        console.error(linea)
      } else if (nivel === 'advertencia') {
        console.warn(linea)
      } else {
        console.log(linea)
      }
    }
  })

  next()
}
