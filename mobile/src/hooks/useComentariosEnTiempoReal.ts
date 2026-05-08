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

export const useComentariosEnTiempoReal = (
  publicacionId: number,
  onNuevoComentario: (comentario: Comentario) => void,
  onComentarioEliminado: (id: number) => void
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

    socket.on('nuevo_comentario', escucharNuevo)
    socket.on('comentario_eliminado', escucharEliminado)

    return () => {
      socket.off('nuevo_comentario', escucharNuevo)
      socket.off('comentario_eliminado', escucharEliminado)
      servicioSocket.salirPublicacion(publicacionId)
    }
  }, [socket, publicacionId, onNuevoComentario, onComentarioEliminado])
}
