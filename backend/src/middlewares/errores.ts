import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { ErrorHttp } from '../shared/errors/errorHttp'
import { registro } from '../shared/logger/registro'

export { ErrorHttp }

export const middlewareErrores = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error.message === 'CORS no permitido') {
    res.status(403).json({ error: 'Origen no permitido por CORS', codigo: 403 })
    return
  }

  if (error instanceof multer.MulterError) {
    registro.advertencia('HTTP', 'Error Multer', {
      ruta: req.path,
      codigo: error.code,
      mensaje: error.message,
    })
    res.status(400).json({
      error: error.message,
      codigo: 400,
      detalle: error.code,
    })
    return
  }

  if (
    error.message === 'Formato de imagen no permitido' ||
    error.message.includes('Unexpected field')
  ) {
    res.status(400).json({ error: error.message, codigo: 400 })
    return
  }

  const codigoRateLimit =
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name?: string }).name === 'ValidationError' &&
    'code' in error &&
    String((error as { code?: string }).code).startsWith('ERR_ERL')

  if (codigoRateLimit) {
    registro.error('HTTP', error, { ruta: req.path, metodo: req.method, status: 503 })
    res.status(503).json({
      error: 'Límite de peticiones mal configurado en el servidor (proxy). Reintenta en unos minutos.',
      codigo: 503,
    })
    return
  }

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

  const msg = error.message ?? ''
  const esEsquemaDesactualizado =
    msg.includes('Unknown column') ||
    msg.includes("doesn't exist") ||
    (typeof (error as { code?: string }).code === 'string' &&
      (error as { code: string }).code === 'ER_BAD_FIELD_ERROR')

  if (esEsquemaDesactualizado) {
    registro.error('HTTP', error, { ruta: req.path, metodo: req.method, status: 503 })
    res.status(503).json({
      error:
        'Base de datos desactualizada (falta columna o tabla). Ejecuta en Railway: npm run migrar --prefix backend',
      codigo: 503,
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
