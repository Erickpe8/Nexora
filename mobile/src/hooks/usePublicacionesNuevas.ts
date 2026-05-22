import { useCallback, useEffect, useState } from 'react'
import type { Publicacion } from '../types'
import { servicioPublicaciones } from '../services/servicioPublicaciones'
import { socketDisponibleEnEntorno } from '../utils/socketDisponible'
import { useSocket } from './useSocket'

interface EventoNuevasPublicaciones {
  cantidad: number
  publicaciones: Publicacion[]
}

export const usePublicacionesNuevas = (
  token: string | null,
  primeraPublicacionId?: number,
  busquedaActiva = false
) => {
  const { socket } = useSocket()
  const [hayNuevas, setHayNuevas] = useState(false)
  const [cantidad, setCantidad] = useState(0)
  const sinSocket = !socketDisponibleEnEntorno()

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

  const revisarNuevasPorApi = useCallback(async () => {
    if (!token || !primeraPublicacionId || busquedaActiva) return
    try {
      const feed = await servicioPublicaciones.obtenerFeed(token, 1, 1)
      const topId = feed.datos[0]?.id
      if (topId && topId > primeraPublicacionId) {
        setHayNuevas(true)
        setCantidad(Math.max(1, topId - primeraPublicacionId))
      }
    } catch {
      /* ignorar en polling */
    }
  }, [token, primeraPublicacionId, busquedaActiva])

  useEffect(() => {
    if (!sinSocket || !token || !primeraPublicacionId || busquedaActiva) return
    void revisarNuevasPorApi()
    const id = setInterval(() => void revisarNuevasPorApi(), 45_000)
    return () => clearInterval(id)
  }, [sinSocket, token, primeraPublicacionId, busquedaActiva, revisarNuevasPorApi])

  return {
    hayNuevas,
    cantidad,
    limpiar: () => {
      setHayNuevas(false)
      setCantidad(0)
    },
    revisarNuevasPorApi,
  }
}
