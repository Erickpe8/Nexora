import { Router } from 'express'
import { controladorGenerateNews } from '../controllers/internalCron.controlador'
import { middlewareAutenticacionCron } from '../middlewares/autenticacionCron'

const rutasCron = Router()

/**
 * Rutas legacy (antes usadas por Vercel Cron).
 * Preferir POST /api/internal/cron/generate-news
 */
const avisoLegacy = (
  _req: import('express').Request,
  res: import('express').Response,
  next: import('express').NextFunction
): void => {
  res.setHeader('Deprecation', 'true')
  res.setHeader('Link', '</api/internal/cron/generate-news>; rel="successor-version"')
  next()
}

rutasCron.use(avisoLegacy)
rutasCron.use(middlewareAutenticacionCron)

rutasCron.get('/generar-ia', controladorGenerateNews)
rutasCron.post('/generar-ia', controladorGenerateNews)

export default rutasCron
