import { Request, Response, NextFunction } from 'express'

/**
 * Permite disparar generación IA desde:
 * - Vercel Cron (`x-vercel-cron: 1`)
 * - Script post-deploy (`Authorization: Bearer CRON_SECRET`)
 * - Desarrollo (`X-Interno-Api-Key`)
 */
export const middlewareAutorizarCronGeneracion = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const cronVercel = req.headers['x-vercel-cron'] === '1'
  const secretoCron = process.env.CRON_SECRET
  const bearer =
    typeof req.headers.authorization === 'string' &&
    secretoCron &&
    req.headers.authorization === `Bearer ${secretoCron}`
  const apiInterna = req.headers['x-interno-api-key'] as string | undefined
  const apiInternaOk =
    apiInterna &&
    apiInterna === (process.env.INTERNO_API_KEY || 'nexora_interno_dev')

  if (cronVercel || bearer || apiInternaOk) {
    next()
    return
  }

  res.status(401).json({ error: 'No autorizado para ejecutar generación programada', codigo: 401 })
}
