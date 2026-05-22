import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { middlewareAutenticacionCron } from '../middlewares/autenticacionCron'
import {
  controladorCleanupCache,
  controladorGenerateNews,
  controladorGenerateNewsEnqueue,
  controladorHistorialCron,
  controladorProcessQueue,
  controladorProcessRecommendations,
  controladorRetrainTrends,
  controladorReviewReported,
  controladorUpdateMetrics,
  controladorUpdateTrends,
} from '../controllers/internalCron.controlador'

const rutasCronInterno = Router()

const limitadorCron = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 120,
  message: { error: 'Límite de cron excedido', codigo: 429 },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: req => `cron:${req.ip ?? 'unknown'}`,
})

rutasCronInterno.use(limitadorCron)
rutasCronInterno.use(middlewareAutenticacionCron)

/** Generación IA — POST modo=ejecutar (síncrono) o modo=encolar (202) */
rutasCronInterno.post('/generate-news', controladorGenerateNews)
rutasCronInterno.post('/generate-news/enqueue', controladorGenerateNewsEnqueue)

rutasCronInterno.post('/update-trends', controladorUpdateTrends)
rutasCronInterno.post('/cleanup-cache', controladorCleanupCache)
rutasCronInterno.post('/update-metrics', controladorUpdateMetrics)
rutasCronInterno.post('/process-recommendations', controladorProcessRecommendations)
rutasCronInterno.post('/retrain-trends', controladorRetrainTrends)
rutasCronInterno.post('/review-reported-content', controladorReviewReported)

/** Drenar cola de trabajos — recomendado cada 5 min */
rutasCronInterno.post('/process-queue', controladorProcessQueue)

/** Historial de ejecuciones — GET para diagnóstico */
rutasCronInterno.get('/executions', controladorHistorialCron)

export default rutasCronInterno
