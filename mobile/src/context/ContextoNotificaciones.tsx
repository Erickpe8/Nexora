import React, { createContext, useContext, useMemo, useState } from 'react'
import type { Notificacion } from '../types'

interface ContextoNotificacionesTipo {
  totalNoLeidas: number
  agregarNotificacion: (notificacion: Notificacion) => void
  establecerDesdeLista: (notificaciones: Notificacion[]) => void
  marcarLeidaLocal: (id: number) => void
  resetear: () => void
}

const ContextoNotificaciones = createContext<ContextoNotificacionesTipo>({
  totalNoLeidas: 0,
  agregarNotificacion: () => undefined,
  establecerDesdeLista: () => undefined,
  marcarLeidaLocal: () => undefined,
  resetear: () => undefined,
})

export const ProveedorNotificaciones = ({ children }: { children: React.ReactNode }) => {
  const [totalNoLeidas, setTotalNoLeidas] = useState(0)

  const valor = useMemo<ContextoNotificacionesTipo>(
    () => ({
      totalNoLeidas,
      agregarNotificacion: (notificacion: Notificacion) => {
        if (!notificacion.leida) {
          setTotalNoLeidas(prev => prev + 1)
        }
      },
      establecerDesdeLista: (notificaciones: Notificacion[]) => {
        const total = notificaciones.filter(notificacion => !notificacion.leida).length
        setTotalNoLeidas(total)
      },
      marcarLeidaLocal: (_id: number) => {
        setTotalNoLeidas(prev => Math.max(0, prev - 1))
      },
      resetear: () => setTotalNoLeidas(0),
    }),
    [totalNoLeidas]
  )

  return <ContextoNotificaciones.Provider value={valor}>{children}</ContextoNotificaciones.Provider>
}

export const useContextoNotificaciones = (): ContextoNotificacionesTipo => useContext(ContextoNotificaciones)
