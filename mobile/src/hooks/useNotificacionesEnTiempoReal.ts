import { useEffect } from 'react'
import type { Notificacion } from '../types'
import { useSocket } from './useSocket'
import { useContextoNotificaciones } from '../context/ContextoNotificaciones'

export const useNotificacionesEnTiempoReal = (onNueva: (notificacion: Notificacion) => void) => {
  const { socket } = useSocket()
  const { agregarNotificacion } = useContextoNotificaciones()

  useEffect(() => {
    if (!socket) return
    const alRecibir = (notificacion: Notificacion) => {
      agregarNotificacion(notificacion)
      onNueva(notificacion)
    }
    socket.on('nueva_notificacion', alRecibir)
    return () => {
      socket.off('nueva_notificacion', alRecibir)
    }
  }, [socket, agregarNotificacion, onNueva])
}
