import { io, Socket } from 'socket.io-client'
import { urlBaseApi } from './api'
import { socketDisponibleEnEntorno } from '../utils/socketDisponible'

let socketInstancia: Socket | null = null

const obtenerUrlSocket = (): string => {
  return urlBaseApi.replace(/\/api$/, '')
}

export const servicioSocket = {
  conectar(token: string): Socket | null {
    if (!socketDisponibleEnEntorno()) {
      return null
    }
    if (socketInstancia?.connected) {
      return socketInstancia
    }
    if (socketInstancia) {
      socketInstancia.disconnect()
    }

    socketInstancia = io(obtenerUrlSocket(), {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 8,
      timeout: 15_000,
      transports: ['polling', 'websocket'],
    })
    return socketInstancia
  },

  desconectar(): void {
    if (socketInstancia) {
      socketInstancia.disconnect()
      socketInstancia = null
    }
  },

  obtenerSocket(): Socket | null {
    return socketInstancia
  },

  unirsePublicacion(id: number): void {
    socketInstancia?.emit('unirse_publicacion', id)
  },

  salirPublicacion(id: number): void {
    socketInstancia?.emit('salir_publicacion', id)
  },
}
