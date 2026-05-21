import { Request, Response, NextFunction } from 'express'
import { entorno } from '../shared/config/entorno'

/**
 * Middleware de autenticación para rutas internas del sistema.
 * Verifica el header `X-Interno-Api-Key` contra la variable de entorno INTERNO_API_KEY.
 * Solo disponible en desarrollo o con clave explícita configurada.
 */
export const middlewareApiKeyInterna = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-interno-api-key'] as string | undefined

  if (!apiKey || apiKey !== entorno.interno.apiKey) {
    res.status(401).json({ error: 'API key interna requerida o inválida', codigo: 401 })
    return
  }

  next()
}
