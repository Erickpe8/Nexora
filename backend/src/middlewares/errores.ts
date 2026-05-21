import { Request, Response, NextFunction } from 'express'
import { ErrorHttp } from '../shared/errors/errorHttp'
import { registro } from '../shared/logger/registro'

export { ErrorHttp }

export const middlewareErrores = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ErrorHttp) {
    // Errores de dominio esperados — solo loguear si son 5xx
    if (error.codigo >= 500) {
      registro.error('HTTP', error, { ruta: req.path, metodo: req.method, status: error.codigo })
    }
    res.status(error.codigo).json({
      error: error.mensaje,
      codigo: error.codigo,
    })
    return
  }

  // Error no controlado — siempre loguear
  registro.error('HTTP', error, { ruta: req.path, metodo: req.method, status: 500 })

  res.status(500).json({
    error: 'Error interno del servidor',
    codigo: 500,
  })
}

export const middlewareNoEncontrado = (req: Request, res: Response): void => {
  res.status(404).json({
    error: `Ruta '${req.method} ${req.path}' no encontrada`,
    codigo: 404,
  })
}
