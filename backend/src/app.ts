import express, { type Express } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { limitadorGeneral } from './middlewares/rateLimiting'
import { middlewareErrores, middlewareNoEncontrado } from './middlewares/errores'
import rutasAuth from './routes/auth.rutas'
import rutasPublicaciones from './routes/publicaciones.rutas'
import rutasComentarios from './routes/comentarios.rutas'
import rutasNotificaciones from './routes/notificaciones.rutas'
import rutasUsuarios from './routes/usuarios.rutas'
import rutasSalud from './routes/salud.rutas'

/**
 * Construye la aplicación HTTP sin efectos de lado de listen.
 * Las rutas siguen en `routes/` hasta migración por dominio (modules/*).
 */
export const crearAplicacion = (): Express => {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: '*' }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/api/salud', rutasSalud)
  app.use(limitadorGeneral)

  app.get('/', (_req, res) => {
    res.json({ mensaje: 'Nexora API funcionando', version: '1.0.0' })
  })

  app.use('/api/auth', rutasAuth)
  app.use('/api/publicaciones', rutasPublicaciones)
  app.use('/api/comentarios', rutasComentarios)
  app.use('/api/usuarios', rutasUsuarios)
  app.use('/api/notificaciones', rutasNotificaciones)

  app.use(middlewareNoEncontrado)
  app.use(middlewareErrores)

  return app
}
