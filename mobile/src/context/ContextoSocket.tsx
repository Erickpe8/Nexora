import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { useContextoAuth } from './ContextoAutenticacion'
import { servicioSocket } from '../services/servicioSocket'

type EstadoConexion = 'conectado' | 'desconectado' | 'reconectando'

interface ContextoSocketTipo {
  socket: Socket | null
  estadoConexion: EstadoConexion
}

const ContextoSocket = createContext<ContextoSocketTipo>({
  socket: null,
  estadoConexion: 'desconectado',
})

export const ProveedorSocket = ({ children }: { children: React.ReactNode }) => {
  const { token } = useContextoAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [estadoConexion, setEstadoConexion] = useState<EstadoConexion>('desconectado')

  useEffect(() => {
    if (!token) {
      servicioSocket.desconectar()
      setSocket(null)
      setEstadoConexion('desconectado')
      return
    }

    const instancia = servicioSocket.conectar(token)
    if (!instancia) {
      setSocket(null)
      setEstadoConexion('desconectado')
      return
    }

    setSocket(instancia)

    const alConectar = () => setEstadoConexion('conectado')
    const alDesconectar = () => setEstadoConexion('desconectado')
    const alReintentar = () => setEstadoConexion('reconectando')

    instancia.on('connect', alConectar)
    instancia.on('disconnect', alDesconectar)
    instancia.io.on('reconnect_attempt', alReintentar)

    return () => {
      instancia.off('connect', alConectar)
      instancia.off('disconnect', alDesconectar)
      instancia.io.off('reconnect_attempt', alReintentar)
    }
  }, [token])

  const valor = useMemo(
    () => ({
      socket,
      estadoConexion,
    }),
    [socket, estadoConexion]
  )

  return <ContextoSocket.Provider value={valor}>{children}</ContextoSocket.Provider>
}

export const useContextoSocket = (): ContextoSocketTipo => useContext(ContextoSocket)
