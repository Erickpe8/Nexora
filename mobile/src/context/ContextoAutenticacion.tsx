import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSesion } from '../hooks/useSesion'
import type { Usuario } from '../types'

interface EstadoAuth {
  usuario: Usuario | null
  token: string | null
  cargando: boolean
}

interface AccionesAuth {
  guardarSesion: (token: string, usuario: Usuario) => Promise<void>
  cerrarSesion: () => Promise<void>
}

type ContextoAuthTipo = EstadoAuth & AccionesAuth

const ContextoAuth = createContext<ContextoAuthTipo | null>(null)

export const ProveedorAutenticacion = ({ children }: { children: ReactNode }) => {
  const { guardarSesion: guardarSesionStorage, limpiarSesion, verificarSesionAlIniciar } = useSesion()
  const [estado, setEstado] = useState<EstadoAuth>({
    usuario: null,
    token: null,
    cargando: true,
  })

  useEffect(() => {
    const cargarSesion = async () => {
      try {
        const sesion = await verificarSesionAlIniciar()
        setEstado({ token: sesion.token, usuario: sesion.usuario, cargando: false })
      } catch {
        setEstado(prev => ({ ...prev, cargando: false }))
      }
    }

    cargarSesion()
  }, [verificarSesionAlIniciar])

  const guardarSesion = async (token: string, usuario: Usuario): Promise<void> => {
    await guardarSesionStorage(token, usuario)
    setEstado({ token, usuario, cargando: false })
  }

  const cerrarSesion = async (): Promise<void> => {
    await limpiarSesion()
    setEstado({ token: null, usuario: null, cargando: false })
  }

  return (
    <ContextoAuth.Provider value={{ ...estado, guardarSesion, cerrarSesion }}>
      {children}
    </ContextoAuth.Provider>
  )
}

// Hook para consumir el contexto de autenticación
export const useContextoAuth = (): ContextoAuthTipo => {
  const contexto = useContext(ContextoAuth)
  if (!contexto) {
    throw new Error('useContextoAuth debe usarse dentro de ProveedorAutenticacion')
  }
  return contexto
}
