import { Request, Response, NextFunction } from 'express'
import { ErrorHttp } from '../shared/errors/errorHttp'

export { ErrorHttp }

export const middlewareErrores = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ErrorHttp) {
    res.status(error.codigo).json({
      error: error.mensaje,
      codigo: error.codigo,
    })
    return
  }

  console.error('❌ Error no controlado:', error)

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
