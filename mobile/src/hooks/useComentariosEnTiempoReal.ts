import { useEffect } from 'react'
import type { Comentario } from '../types'
import { useSocket } from './useSocket'
import { servicioSocket } from '../services/servicioSocket'

interface EventoNuevoComentario {
  comentario: Comentario
  socketId: string | null
}

interface EventoComentarioEliminado {
  id: number
  socketId: string | null
}

interface EventoVisibilidadComentario {
  comentarioId: number
  publicacionId: number
}

export const useComentariosEnTiempoReal = (
  publicacionId: number,
  onNuevoComentario: (comentario: Comentario) => void,
  onComentarioEliminado: (id: number) => void,
  onComentarioOculto?: (comentarioId: number) => void,
  onComentarioRestaurado?: (comentarioId: number) => void
) => {
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return
    servicioSocket.unirsePublicacion(publicacionId)

    const escucharNuevo = (evento: EventoNuevoComentario) => {
      if (evento.socketId && evento.socketId === socket.id) return
      onNuevoComentario(evento.comentario)
    }

    const escucharEliminado = (evento: EventoComentarioEliminado) => {
      if (evento.socketId && evento.socketId === socket.id) return
      onComentarioEliminado(evento.id)
    }

    const escucharOculto = (evento: EventoVisibilidadComentario) => {
      onComentarioOculto?.(evento.comentarioId)
    }

    const escucharRestaurado = (evento: EventoVisibilidadComentario) => {
      onComentarioRestaurado?.(evento.comentarioId)
    }

    socket.on('nuevo_comentario', escucharNuevo)
    socket.on('comentario_eliminado', escucharEliminado)
    socket.on('comentario_oculto', escucharOculto)
    socket.on('comentario_restaurado', escucharRestaurado)

    return () => {
      socket.off('nuevo_comentario', escucharNuevo)
      socket.off('comentario_eliminado', escucharEliminado)
      socket.off('comentario_oculto', escucharOculto)
      socket.off('comentario_restaurado', escucharRestaurado)
      servicioSocket.salirPublicacion(publicacionId)
    }
  }, [socket, publicacionId, onNuevoComentario, onComentarioEliminado, onComentarioOculto, onComentarioRestaurado])
}
