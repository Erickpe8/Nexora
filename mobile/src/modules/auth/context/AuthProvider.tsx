import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import Toast from 'react-native-toast-message'
import type { Usuario } from '../../../types'
import { authApi } from '../services/authApi'
import { suscribirSesionInvalidada } from '../services/authEvents'
import {
  cargarTokenPersistido,
  guardarUsuarioEnCache,
  limpiarPersistenciaSesion,
  persistirSesion,
} from '../services/authStorage'
import { establecerTokenSesion, limpiarTokenSesion } from '../sessionToken'

interface EstadoAuth {
  usuario: Usuario | null
  token: string | null
  cargando: boolean
}

export interface OpcionesGuardarSesion {
  /** Por defecto true: token en SecureStore/AsyncStorage según plataforma. */
  recordar?: boolean
}

interface AccionesAuth {
  guardarSesion: (token: string, usuario: Usuario, opciones?: OpcionesGuardarSesion) => Promise<void>
  actualizarUsuario: (parcial: Partial<Usuario>) => Promise<void>
  cerrarSesion: () => Promise<void>
}

export type ContextoAuthTipo = EstadoAuth & AccionesAuth

const ContextoAuth = createContext<ContextoAuthTipo | null>(null)

export const ProveedorAutenticacion = ({ children }: { children: ReactNode }) => {
  const [estado, setEstado] = useState<EstadoAuth>({
    usuario: null,
    token: null,
    cargando: true,
  })

  useEffect(() => {
    const restaurar = async (): Promise<void> => {
      try {
        const tokenGuardado = await cargarTokenPersistido()
        if (!tokenGuardado) {
          limpiarTokenSesion()
          setEstado({ usuario: null, token: null, cargando: false })
          return
        }
        establecerTokenSesion(tokenGuardado)
        const usuario = await authApi.verificarSesionActual()
        await guardarUsuarioEnCache(usuario)
        setEstado({ token: tokenGuardado, usuario, cargando: false })
      } catch {
        await limpiarPersistenciaSesion()
        setEstado({ usuario: null, token: null, cargando: false })
      }
    }

    void restaurar()
  }, [])

  const guardarSesion = useCallback(async (token: string, usuario: Usuario, opciones?: OpcionesGuardarSesion) => {
    const recordar = opciones?.recordar !== false
    await persistirSesion(token, usuario, recordar)
    setEstado({ token, usuario, cargando: false })
  }, [])

  const actualizarUsuario = useCallback(async (parcial: Partial<Usuario>) => {
    setEstado(prev => {
      if (!prev.usuario || !prev.token) return prev
      const usuario = { ...prev.usuario, ...parcial }
      void guardarUsuarioEnCache(usuario)
      return { ...prev, usuario }
    })
  }, [])

  const cerrarSesion = useCallback(async () => {
    await limpiarPersistenciaSesion()
    setEstado({ usuario: null, token: null, cargando: false })
  }, [])

  useEffect(() => {
    const off = suscribirSesionInvalidada(() => {
      void (async () => {
        await cerrarSesion()
        Toast.show({
          type: 'info',
          text1: 'Sesión cerrada',
          text2: 'Tu sesión expiró o dejó de ser válida.',
        })
      })()
    })
    return off
  }, [cerrarSesion])

  const valor = useMemo<ContextoAuthTipo>(
    () => ({
      ...estado,
      guardarSesion,
      actualizarUsuario,
      cerrarSesion,
    }),
    [estado, guardarSesion, actualizarUsuario, cerrarSesion]
  )

  return <ContextoAuth.Provider value={valor}>{children}</ContextoAuth.Provider>
}

export const useContextoAuth = (): ContextoAuthTipo => {
  const ctx = useContext(ContextoAuth)
  if (!ctx) {
    throw new Error('useContextoAuth debe usarse dentro de ProveedorAutenticacion')
  }
  return ctx
}
