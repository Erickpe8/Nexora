import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { useContextoAuth } from './ContextoAutenticacion'
import { servicioSocket } from '../services/servicioSocket'
import { socketDisponibleEnEntorno } from '../utils/socketDisponible'

type EstadoConexion = 'conectado' | 'desconectado' | 'reconectando'

interface ContextoSocketTipo {
  socket: Socket | null
  estadoConexion: EstadoConexion
  /** false en Vercel/serverless: no se intenta socket y no se muestra aviso. */
  socketHabilitado: boolean
}

const ContextoSocket = createContext<ContextoSocketTipo>({
  socket: null,
  estadoConexion: 'desconectado',
  socketHabilitado: false,
})

export const ProveedorSocket = ({ children }: { children: React.ReactNode }) => {
  const { token } = useContextoAuth()
  const socketHabilitado = socketDisponibleEnEntorno()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [estadoConexion, setEstadoConexion] = useState<EstadoConexion>('desconectado')

  useEffect(() => {
    if (!token) {
      servicioSocket.desconectar()
      setSocket(null)
      setEstadoConexion('desconectado')
      return
    }

    if (!socketHabilitado) {
      servicioSocket.desconectar()
      setSocket(null)
      setEstadoConexion('desconectado')
      return
    }

    setEstadoConexion('reconectando')
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
    const alError = () => setEstadoConexion('desconectado')

    if (instancia.connected) {
      setEstadoConexion('conectado')
    }

    instancia.on('connect', alConectar)
    instancia.on('disconnect', alDesconectar)
    instancia.io.on('reconnect_attempt', alReintentar)
    instancia.on('connect_error', alError)

    return () => {
      instancia.off('connect', alConectar)
      instancia.off('disconnect', alDesconectar)
      instancia.io.off('reconnect_attempt', alReintentar)
      instancia.off('connect_error', alError)
    }
  }, [token, socketHabilitado])

  const valor = useMemo(
    () => ({
      socket,
      estadoConexion,
      socketHabilitado,
    }),
    [socket, estadoConexion, socketHabilitado]
  )

  return <ContextoSocket.Provider value={valor}>{children}</ContextoSocket.Provider>
}

export const useContextoSocket = (): ContextoSocketTipo => useContext(ContextoSocket)
