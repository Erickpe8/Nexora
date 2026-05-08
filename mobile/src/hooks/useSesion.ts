import { useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { servicioAutenticacion } from '../services/servicioAutenticacion'
import type { Usuario } from '../types'

const CLAVE_TOKEN = '@nexora_token'
const CLAVE_USUARIO = '@nexora_usuario'

interface ResultadoSesion {
  token: string | null
  usuario: Usuario | null
}

export const useSesion = () => {
  const guardarSesion = useCallback(async (token: string, usuario: Usuario): Promise<void> => {
    await AsyncStorage.setItem(CLAVE_TOKEN, token)
    await AsyncStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))
  }, [])

  const limpiarSesion = useCallback(async (): Promise<void> => {
    await AsyncStorage.removeItem(CLAVE_TOKEN)
    await AsyncStorage.removeItem(CLAVE_USUARIO)
  }, [])

  const verificarSesionAlIniciar = useCallback(async (): Promise<ResultadoSesion> => {
    const tokenGuardado = await AsyncStorage.getItem(CLAVE_TOKEN)

    if (!tokenGuardado) {
      return { token: null, usuario: null }
    }

    try {
      const usuario = await servicioAutenticacion.verificarSesion(tokenGuardado)
      await AsyncStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))
      return { token: tokenGuardado, usuario }
    } catch {
      await limpiarSesion()
      return { token: null, usuario: null }
    }
  }, [limpiarSesion])

  return {
    guardarSesion,
    limpiarSesion,
    verificarSesionAlIniciar,
  }
}
