import { Server as ServidorHTTP } from 'http'
import { Server as ServidorSocket, Socket } from 'socket.io'
import { verificarToken } from '../../utils/jwt'
import type { UsuarioToken } from '../../types'

export let io: ServidorSocket

export const inicializarSocket = (servidorHttp: ServidorHTTP): ServidorSocket => {
  io = new ServidorSocket(servidorHttp, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

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

  io.on('connection', (socket: Socket) => {
    const usuario = socket.data.usuario as UsuarioToken
    console.log(`🔌 Usuario conectado: ${usuario.nombre} (socket: ${socket.id})`)

    socket.join(`usuario:${usuario.id}`)
    socket.join('feed_global')

    socket.on('unirse_publicacion', (publicacionId: number) => {
      socket.join(`comentarios:${publicacionId}`)
    })

    socket.on('salir_publicacion', (publicacionId: number) => {
      socket.leave(`comentarios:${publicacionId}`)
    })

    socket.on('disconnect', () => {
      console.log(`🔌 Usuario desconectado: ${usuario.nombre}`)
    })
  })

  return io
}
