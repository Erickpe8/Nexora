import express from 'express'
import { createServer } from 'http'
import helmet from 'helmet'
import cors from 'cors'
import { entorno } from './config/entorno'
import { verificarConexion } from './config/baseDatos'
import { inicializarSocket } from './sockets/socket'
import { limitadorGeneral } from './middlewares/rateLimiting'
import { middlewareErrores, middlewareNoEncontrado } from './middlewares/errores'
import rutasAuth from './routes/auth.rutas'
import rutasPublicaciones from './routes/publicaciones.rutas'
import rutasComentarios from './routes/comentarios.rutas'
import rutasNotificaciones from './routes/notificaciones.rutas'
import rutasUsuarios from './routes/usuarios.rutas'
import { iniciarCronGenerador } from './cron/cronGenerador'

const app = express()
const servidorHttp = createServer(app)

// ── Middlewares globales ──────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(limitadorGeneral)

// ── Ruta de salud ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ mensaje: 'Nexora API funcionando', version: '1.0.0' })
})

// ── Rutas de la API ───────────────────────────────────────────────────────────
app.use('/api/auth', rutasAuth)
app.use('/api/publicaciones', rutasPublicaciones)
app.use('/api/comentarios', rutasComentarios)
app.use('/api/usuarios', rutasUsuarios)
app.use('/api/notificaciones', rutasNotificaciones)

// ── Manejo de errores (siempre al final) ──────────────────────────────────────
app.use(middlewareNoEncontrado)
app.use(middlewareErrores)

// ── Iniciar servidor ──────────────────────────────────────────────────────────
const iniciar = async (): Promise<void> => {
  // Verificar conexión a MySQL antes de arrancar
  await verificarConexion()

  // Inicializar Socket.IO
  inicializarSocket(servidorHttp)
  iniciarCronGenerador()

  servidorHttp.listen(entorno.puerto, () => {
    console.log(`🚀 Servidor Nexora corriendo en http://localhost:${entorno.puerto}`)
    console.log(`🌍 Entorno: ${entorno.nodeEnv}`)
  })
}

iniciar()
