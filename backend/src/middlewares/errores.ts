import { Request, Response, NextFunction } from 'express'

// Clase de error personalizada con código HTTP
export class ErrorHttp extends Error {
  constructor(
    public mensaje: string,
    public codigo: number = 500
  ) {
    super(mensaje)
    this.name = 'ErrorHttp'
  }
}

// Middleware global de manejo de errores (4 parámetros obligatorios en Express)
export const middlewareErrores = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Error controlado con código HTTP
  if (error instanceof ErrorHttp) {
    res.status(error.codigo).json({
      error: error.mensaje,
      codigo: error.codigo,
    })
    return
  }

  // Error no controlado — loguear sin exponer detalles al cliente
  console.error('❌ Error no controlado:', error)

  res.status(500).json({
    error: 'Error interno del servidor',
    codigo: 500,
  })
}

// Middleware para rutas no encontradas (404)
export const middlewareNoEncontrado = (
  req: Request,
  res: Response
): void => {
  res.status(404).json({
    error: `Ruta '${req.method} ${req.path}' no encontrada`,
    codigo: 404,
  })
}
