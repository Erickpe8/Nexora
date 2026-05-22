import express, { type Express } from 'express'
import path from 'path'
import helmet from 'helmet'
import { middlewareCors, middlewarePreflightVercel } from './middlewares/corsConfig'
import { limitadorGeneral } from './middlewares/rateLimiting'
import { middlewareErrores, middlewareNoEncontrado } from './middlewares/errores'
import { middlewareCorrelacion } from './middlewares/correlacion'
import { middlewareSemillaDespliegue } from './middlewares/semillaDespliegue'
import rutasCron from './routes/cron.rutas'
import rutasCronInterno from './routes/internalCron.rutas'
import rutasAuth from './routes/auth.rutas'
import rutasPublicaciones from './routes/publicaciones.rutas'
import rutasComentarios from './routes/comentarios.rutas'
import rutasNotificaciones from './routes/notificaciones.rutas'
import rutasUsuarios from './routes/usuarios.rutas'
import rutasSalud from './routes/salud.rutas'
import rutasModeracion from './routes/moderacion.rutas'
import rutasInterno from './routes/interno.rutas'

/**
 * Construye la aplicación HTTP sin efectos de lado de listen.
 * Las rutas siguen en `routes/` hasta migración por dominio (modules/*).
 */
export const crearAplicacion = (): Express => {
  const app = express()

  /**
   * Vercel (y otros reverse proxies) envían X-Forwarded-For.
   * Sin esto, express-rate-limit lanza ERR_ERL_UNEXPECTED_X_FORWARDED_FOR → 500 en /api/auth/*.
   */
  if (process.env.VERCEL) {
    app.set('trust proxy', 1)
  }

  /** Preflight primero: responde OPTIONS antes de helmet/rutas (crítico en Vercel). */
  app.use(middlewarePreflightVercel)
  app.use(middlewareCors)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  )
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(middlewareCorrelacion)
  app.use(middlewareSemillaDespliegue)
  app.use('/api/salud', rutasSalud)
  /** Cron externo (GitHub Actions, VPS, etc.) — sin limitador general */
  app.use('/api/internal/cron', rutasCronInterno)
  /** Legacy: redirige mentalmente a /api/internal/cron/generate-news */
  app.use('/api/cron', rutasCron)
  app.use(limitadorGeneral)

  app.get('/', (_req, res) => {
    res.json({ mensaje: 'Nexora API funcionando', version: '1.0.0' })
  })

  app.use('/api/auth', rutasAuth)
  app.use('/api/publicaciones', rutasPublicaciones)
  app.use('/api/comentarios', rutasComentarios)
  app.use('/api/usuarios', rutasUsuarios)
  app.use('/api/notificaciones', rutasNotificaciones)
  app.use('/api/moderacion', rutasModeracion)
  app.use('/api/interno', rutasInterno)

  if (!process.env.VERCEL) {
    app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
  }

  app.use(middlewareNoEncontrado)
  app.use(middlewareErrores)

  return app
}
