import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CLAVE_TOKEN = '@nexora_token'

interface Usuario {
  id: number
  nombre: string
  correo: string
}

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
  const [estado, setEstado] = useState<EstadoAuth>({
    usuario: null,
    token: null,
    cargando: true,
  })

  // Verificar sesión persistida al iniciar la app
  useEffect(() => {
    const cargarSesion = async () => {
      try {
        const tokenGuardado = await AsyncStorage.getItem(CLAVE_TOKEN)
        const usuarioGuardado = await AsyncStorage.getItem('@nexora_usuario')

        if (tokenGuardado && usuarioGuardado) {
          setEstado({
            token: tokenGuardado,
            usuario: JSON.parse(usuarioGuardado) as Usuario,
            cargando: false,
          })
        } else {
          setEstado(prev => ({ ...prev, cargando: false }))
        }
      } catch {
        setEstado(prev => ({ ...prev, cargando: false }))
      }
    }

    cargarSesion()
  }, [])

  const guardarSesion = async (token: string, usuario: Usuario): Promise<void> => {
    await AsyncStorage.setItem(CLAVE_TOKEN, token)
    await AsyncStorage.setItem('@nexora_usuario', JSON.stringify(usuario))
    setEstado({ token, usuario, cargando: false })
  }

  const cerrarSesion = async (): Promise<void> => {
    await AsyncStorage.removeItem(CLAVE_TOKEN)
    await AsyncStorage.removeItem('@nexora_usuario')
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
