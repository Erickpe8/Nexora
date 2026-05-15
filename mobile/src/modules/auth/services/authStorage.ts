import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import type { Usuario } from '../../../types'
import { establecerTokenSesion, limpiarTokenSesion } from '../sessionToken'

const CLAVE_USUARIO = '@nexora_usuario'
/** Historial: token solo en AsyncStorage (antes del refactor). */
const LEGACY_TOKEN_ASYNC = '@nexora_token'
const CLAVE_RECORDAR = '@nexora_recordar_sesion'
const SECURE_TOKEN = 'nexora_access_token'

const esWeb = Platform.OS === 'web'

async function leerTokenPersistido(): Promise<string | null> {
  if (esWeb) {
    const t = await AsyncStorage.getItem(SECURE_TOKEN)
    if (t) return t
    return AsyncStorage.getItem(LEGACY_TOKEN_ASYNC)
  }
  const seguro = await SecureStore.getItemAsync(SECURE_TOKEN)
  if (seguro) return seguro
  const legado = await AsyncStorage.getItem(LEGACY_TOKEN_ASYNC)
  if (legado) {
    try {
      await SecureStore.setItemAsync(SECURE_TOKEN, legado)
    } catch {
      /* ignorar */
    }
    await AsyncStorage.removeItem(LEGACY_TOKEN_ASYNC)
    return legado
  }
  return null
}

async function escribirTokenPersistido(token: string): Promise<void> {
  if (esWeb) {
    await AsyncStorage.setItem(SECURE_TOKEN, token)
    await AsyncStorage.removeItem(LEGACY_TOKEN_ASYNC)
    return
  }
  await SecureStore.setItemAsync(SECURE_TOKEN, token)
  await AsyncStorage.removeItem(LEGACY_TOKEN_ASYNC)
}

async function borrarTokenPersistido(): Promise<void> {
  await AsyncStorage.multiRemove([SECURE_TOKEN, LEGACY_TOKEN_ASYNC])
  if (!esWeb) {
    await SecureStore.deleteItemAsync(SECURE_TOKEN).catch(() => undefined)
  }
}

export const leerPreferenciaRecordar = async (): Promise<boolean> => {
  const v = await AsyncStorage.getItem(CLAVE_RECORDAR)
  if (v === '0') return false
  return true
}

export const guardarPreferenciaRecordar = async (recordar: boolean): Promise<void> => {
  await AsyncStorage.setItem(CLAVE_RECORDAR, recordar ? '1' : '0')
}

/**
 * Persiste sesión en disco si `recordar` es true (SecureStore en nativo, AsyncStorage en web).
 * Si es false, solo memoria (token vía sessionToken); se limpia disco.
 */
export const persistirSesion = async (
  token: string,
  usuario: Usuario,
  recordar: boolean
): Promise<void> => {
  establecerTokenSesion(token)
  await guardarPreferenciaRecordar(recordar)
  if (recordar) {
    await escribirTokenPersistido(token)
    await AsyncStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))
  } else {
    await borrarTokenPersistido()
    await AsyncStorage.removeItem(CLAVE_USUARIO)
  }
}

export const limpiarPersistenciaSesion = async (): Promise<void> => {
  limpiarTokenSesion()
  await borrarTokenPersistido()
  await AsyncStorage.multiRemove([CLAVE_USUARIO, CLAVE_RECORDAR])
}

/** Carga token desde disco si el usuario eligió recordar sesión. */
export const cargarTokenPersistido = async (): Promise<string | null> => {
  const recordar = await leerPreferenciaRecordar()
  if (!recordar) {
    await borrarTokenPersistido()
    return null
  }
  return leerTokenPersistido()
}

export const guardarUsuarioEnCache = async (usuario: Usuario): Promise<void> => {
  await AsyncStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))
}

export const leerUsuarioEnCache = async (): Promise<Usuario | null> => {
  const raw = await AsyncStorage.getItem(CLAVE_USUARIO)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Usuario
  } catch {
    return null
  }
}
