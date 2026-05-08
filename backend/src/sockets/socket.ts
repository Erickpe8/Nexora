import { Server as ServidorHTTP } from 'http'
import { Server as ServidorSocket, Socket } from 'socket.io'
import { verificarToken } from '../utils/jwt'
import type { UsuarioToken } from '../types'

// Instancia global de Socket.IO para usar en otros módulos
export let io: ServidorSocket

// Inicializar Socket.IO sobre el servidor HTTP
export const inicializarSocket = (servidorHttp: ServidorHTTP): ServidorSocket => {
  io = new ServidorSocket(servidorHttp, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  // Middleware de autenticación para WebSocket
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined

    if (!token) {
      return next(new Error('Token de autenticación requerido'))
    }

    try {
      const usuario = verificarToken(token)
      socket.data.usuario = usuario as UsuarioToken
      next()
    } catch {
      next(new Error('Token inválido o expirado'))
    }
  })

  // Manejar conexiones entrantes
  io.on('connection', (socket: Socket) => {
    const usuario = socket.data.usuario as UsuarioToken
    console.log(`🔌 Usuario conectado: ${usuario.nombre} (socket: ${socket.id})`)

    // Unir al usuario a su sala privada para notificaciones
    socket.join(`usuario:${usuario.id}`)

    // Unir al usuario a la sala global del feed
    socket.join('feed_global')

    // Manejar suscripción a comentarios de una publicación
    socket.on('unirse_publicacion', (publicacionId: number) => {
      socket.join(`comentarios:${publicacionId}`)
    })

    // Manejar desuscripción de comentarios de una publicación
    socket.on('salir_publicacion', (publicacionId: number) => {
      socket.leave(`comentarios:${publicacionId}`)
    })

    socket.on('disconnect', () => {
      console.log(`🔌 Usuario desconectado: ${usuario.nombre}`)
    })
  })

  return io
}
