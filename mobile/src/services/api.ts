import axios, { type InternalAxiosRequestConfig } from 'axios'
import { Platform } from 'react-native'
import { obtenerTokenSesion } from '../modules/auth/sessionToken'
import { emitirSesionInvalidada } from '../modules/auth/services/authEvents'

const logApiHabilitado = typeof __DEV__ !== 'undefined' && __DEV__

/** Host del API apunta a red privada (típico EXPO_PUBLIC_API_URL para el móvil). */
const hostnameApiEsRedPrivada = (hostname: string): boolean =>
  /^192\.168\./.test(hostname) ||
  /^10\./.test(hostname) ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)

/**
 * En el navegador con origen localhost, pedir a la IP LAN de la misma máquina suele dar ERR_CONNECTION_TIMED_OUT.
 * Usamos localhost en el API manteniendo puerto y ruta; en nativo no hay window → se deja el .env tal cual (Expo Go).
 */
function resolverUrlBaseApi(): string {
  const raw = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4010/api').trim()
  if (typeof window === 'undefined' || !window.location?.hostname) return raw
  const origen = window.location.hostname
  if (origen !== 'localhost' && origen !== '127.0.0.1') return raw
  try {
    const u = new URL(raw)
    if (!hostnameApiEsRedPrivada(u.hostname)) return raw
    const hostAnterior = u.hostname
    u.hostname = 'localhost'
    let out = u.href
    if (out.endsWith('/')) out = out.slice(0, -1)
    if (logApiHabilitado && hostAnterior !== 'localhost') {
      console.info('[Nexora API] baseURL reescrita para web en localhost:', raw, '→', out)
    }
    return out
  } catch {
    return raw
  }
}

export const urlBaseApi = resolverUrlBaseApi()

const urlCompletaPeticion = (config: InternalAxiosRequestConfig | undefined): string => {
  if (!config) return '(sin config)'
  try {
    return axios.getUri(config)
  } catch {
    const b = config.baseURL ?? ''
    const u = config.url ?? ''
    return u.startsWith('http') ? u : `${b.replace(/\/$/, '')}/${u.replace(/^\//, '')}`
  }
}

const logPeticionApi = (config: InternalAxiosRequestConfig) => {
  if (!logApiHabilitado) return
  const path = config.url ?? ''
  if (!path.includes('/auth/')) return
  const url = urlCompletaPeticion(config)
  const origenWeb =
    Platform.OS === 'web' && typeof window !== 'undefined' ? window.location?.origin ?? '' : ''
  console.log('[Nexora API req]', config.method?.toUpperCase() ?? 'GET', url, {
    timeoutMs: config.timeout,
    plataforma: Platform.OS,
    ...(origenWeb ? { origenWeb } : {}),
  })
}

const logErrorApi = (error: unknown) => {
  if (!logApiHabilitado) return
  if (!axios.isAxiosError(error)) {
    console.warn('[Nexora API error]', error)
    return
  }
  const c = error.config
  const url = urlCompletaPeticion(c)
  const origenWeb =
    Platform.OS === 'web' && typeof window !== 'undefined'
      ? { hostname: window.location?.hostname, origin: window.location?.origin }
      : undefined
  console.warn('[Nexora API error]', {
    url,
    metodo: c?.method,
    mensaje: error.message,
    codigoAxios: error.code,
    statusHttp: error.response?.status,
    cuerpo: error.response?.data,
    timeoutPeticionMs: c?.timeout,
    plataforma: Platform.OS,
    ...(origenWeb ? { origenWeb } : {}),
  })
}

const logRespuestaOk = (status: number, config: InternalAxiosRequestConfig) => {
  if (!logApiHabilitado) return
  const path = config.url ?? ''
  if (!path.includes('/auth/')) return
  console.log('[Nexora API ok]', status, urlCompletaPeticion(config))
}

const tiempoLimiteMs = (() => {
  const raw = process.env.EXPO_PUBLIC_API_TIMEOUT_MS
  /** 60s por defecto: DevTools "Slow 4G" + preflight + POST pueden superar 30s sin fallo del servidor. */
  if (!raw) return 60000
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 3000) return 60000
  return Math.min(n, 120000)
})()

export const clienteApi = axios.create({
  baseURL: urlBaseApi,
  timeout: tiempoLimiteMs,
})

clienteApi.interceptors.request.use(config => {
  const token = obtenerTokenSesion()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  logPeticionApi(config)
  return config
})

clienteApi.interceptors.response.use(
  respuesta => {
    logRespuestaOk(respuesta.status, respuesta.config)
    return respuesta
  },
  error => {
    logErrorApi(error)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const conAuth = Boolean(error.config?.headers?.Authorization)
      if (conAuth) emitirSesionInvalidada()
    }
    return Promise.reject(error)
  }
)
export interface RespuestaDatos<T> {
  datos: T
}
