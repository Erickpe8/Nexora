import { Server as ServidorHTTP } from 'http'
import { Server as ServidorSocket, Socket } from 'socket.io'
import { verificarToken } from '../../utils/jwt'
import { registro } from '../../shared/logger/registro'
import type { UsuarioToken } from '../../types'

const CONTEXTO = 'Socket'

export let io: ServidorSocket
let socketsConectados = 0

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
      registro.advertencia(CONTEXTO, 'Handshake rechazado: token ausente', { socketId: socket.id })
      return next(new Error('Token de autenticación requerido'))
    }

    try {
      const usuario = verificarToken(token)
      socket.data.usuario = usuario as UsuarioToken
      next()
    } catch (error) {
      registro.advertencia(CONTEXTO, 'Handshake rechazado: token inválido', {
        socketId: socket.id,
        motivo: (error as Error).message,
      })
      next(new Error('Token inválido o expirado'))
    }
  })

  io.on('connection', (socket: Socket) => {
    const usuario = socket.data.usuario as UsuarioToken
    socketsConectados += 1

    registro.info(CONTEXTO, 'Usuario conectado', {
      socketId: socket.id,
      usuarioId: usuario.id,
      nombre: usuario.nombre,
      totalConectados: socketsConectados,
    })

    socket.join(`usuario:${usuario.id}`)
    socket.join('feed_global')

    socket.on('unirse_publicacion', (publicacionId: number) => {
      socket.join(`comentarios:${publicacionId}`)
    })

    socket.on('salir_publicacion', (publicacionId: number) => {
      socket.leave(`comentarios:${publicacionId}`)
    })

    socket.on('disconnect', () => {
      socketsConectados = Math.max(0, socketsConectados - 1)
      registro.info(CONTEXTO, 'Usuario desconectado', {
        socketId: socket.id,
        usuarioId: usuario.id,
        totalConectados: socketsConectados,
      })
    })
  })

  return io
}

/** Retorna el número de sockets actualmente conectados. */
export const obtenerSocketsConectados = (): number => socketsConectados
