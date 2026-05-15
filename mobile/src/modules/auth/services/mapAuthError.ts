import axios from 'axios'
import { Platform } from 'react-native'
import { urlBaseApi } from '../../../services/api'

type CuerpoErrorApi = {
  error?: unknown
  mensaje?: unknown
}

/** La app web se abre en localhost pero el API apunta a la IP LAN (típico timeout en el mismo PC). */
const origenWebLocalPeroApiPorIpLan = (): boolean => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false
  const h = window.location.hostname
  const origenEsLocal = h === 'localhost' || h === '127.0.0.1'
  if (!origenEsLocal) return false
  try {
    const u = new URL(urlBaseApi)
    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') return false
    return (
      /^192\.168\./.test(u.hostname) ||
      /^10\./.test(u.hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(u.hostname)
    )
  } catch {
    return false
  }
}

const urlLocalhostMismaApi = (): string => {
  try {
    const u = new URL(urlBaseApi)
    const puerto = u.port || (u.protocol === 'https:' ? '443' : '80')
    return `http://localhost:${puerto}${u.pathname.endsWith('/') ? u.pathname.slice(0, -1) : u.pathname}`
  } catch {
    return 'http://localhost:4010/api'
  }
}

const textoDesdeCuerpo = (data: CuerpoErrorApi | undefined): string | null => {
  if (!data) return null
  if (typeof data.error === 'string' && data.error.trim()) return data.error
  if (typeof data.mensaje === 'string' && data.mensaje.trim()) return data.mensaje
  return null
}

/** Mensaje listo para mostrar al usuario (toast / banner). */
export const mapearErrorAuth = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return 'Ocurrió un error inesperado. Intenta de nuevo.'
  }

  const delServidor = textoDesdeCuerpo(error.response?.data as CuerpoErrorApi)
  if (delServidor) return delServidor

  if (!error.response) {
    if (origenWebLocalPeroApiPorIpLan()) {
      const sugerida = urlLocalhostMismaApi()
      return `Web en este PC: usa EXPO_PUBLIC_API_URL=${sugerida} (no la IP LAN). Reinicia Expo.`
    }
    if (error.code === 'ECONNABORTED') {
      return 'El servidor tardó demasiado en responder. Si usas Chrome con red simulada (p. ej. "Slow 4G"), prueba "Sin limitaciones" o sube EXPO_PUBLIC_API_TIMEOUT_MS. Comprueba también que el backend esté activo.'
    }
    const msg = (error.message ?? '').toLowerCase()
    const pareceTimeoutTcp =
      msg.includes('timeout') ||
      msg.includes('timed out') ||
      error.code === 'ETIMEDOUT' ||
      msg.includes('err_connection_timed_out')
    if (pareceTimeoutTcp) {
      return `Timeout hacia ${urlBaseApi}. ¿Backend activo? En web en este PC prueba localhost en .env.`
    }
    if (msg.includes('network') || error.code === 'ERR_NETWORK') {
      return `Sin conexión con la API (${urlBaseApi}). Comprueba "npm run dev" en el PC, misma Wi‑Fi, firewall (entrada al puerto) y EXPO_PUBLIC_API_URL; si usas build nativa, vuelve a generar Android/iOS tras cambios en app.json.`
    }
    return `No hubo respuesta del servidor (${urlBaseApi}).`
  }

  const codigo = error.response.status
  if (codigo === 429) return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
  if (codigo >= 500) return 'El servidor tuvo un problema. Intenta más tarde.'

  return 'No se pudo completar la solicitud.'
}
