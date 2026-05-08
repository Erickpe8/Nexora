import { useCallback, useState } from 'react'
import type { Notificacion } from '../types'
import { servicioNotificaciones } from '../services/servicioNotificaciones'
import { useContextoNotificaciones } from '../context/ContextoNotificaciones'

export const useNotificaciones = (token: string | null) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [cargando, setCargando] = useState(false)
  const { establecerDesdeLista, marcarLeidaLocal, resetear } = useContextoNotificaciones()

  const cargar = useCallback(async () => {
    if (!token) return
    setCargando(true)
    try {
      const lista = await servicioNotificaciones.obtener(token)
      setNotificaciones(lista)
      establecerDesdeLista(lista)
    } finally {
      setCargando(false)
    }
  }, [token, establecerDesdeLista])

  const marcarLeida = useCallback(
    async (id: number) => {
      if (!token) return
      await servicioNotificaciones.marcarLeida(token, id)
      setNotificaciones(prev => prev.map(notificacion => (notificacion.id === id ? { ...notificacion, leida: true } : notificacion)))
      marcarLeidaLocal(id)
    },
    [token, marcarLeidaLocal]
  )

  const marcarTodasLeidas = useCallback(async () => {
    if (!token) return
    await servicioNotificaciones.marcarTodasLeidas(token)
    setNotificaciones(prev => prev.map(notificacion => ({ ...notificacion, leida: true })))
    resetear()
  }, [token, resetear])

  return {
    notificaciones,
    cargando,
    cargar,
    marcarLeida,
    marcarTodasLeidas,
    agregarLocal: (notificacion: Notificacion) => setNotificaciones(prev => [notificacion, ...prev].slice(0, 50)),
  }
}
