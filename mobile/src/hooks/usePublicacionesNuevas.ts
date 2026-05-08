import { useEffect, useState } from 'react'
import type { Publicacion } from '../types'
import { useSocket } from './useSocket'

interface EventoNuevasPublicaciones {
  cantidad: number
  publicaciones: Publicacion[]
}

export const usePublicacionesNuevas = () => {
  const { socket } = useSocket()
  const [hayNuevas, setHayNuevas] = useState(false)
  const [cantidad, setCantidad] = useState(0)

  useEffect(() => {
    if (!socket) return
    const alRecibir = (evento: EventoNuevasPublicaciones) => {
      setHayNuevas(true)
      setCantidad(evento.cantidad)
    }
    socket.on('nuevas_publicaciones', alRecibir)
    return () => {
      socket.off('nuevas_publicaciones', alRecibir)
    }
  }, [socket])

  return {
    hayNuevas,
    cantidad,
    limpiar: () => {
      setHayNuevas(false)
      setCantidad(0)
    },
  }
}
