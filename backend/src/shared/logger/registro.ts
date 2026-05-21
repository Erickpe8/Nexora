import { randomUUID } from 'crypto'

export type NivelLog = 'info' | 'advertencia' | 'error' | 'debug'

export interface EntradaLog {
  nivel: NivelLog
  contexto: string
  mensaje: string
  correlacionId?: string
  duracionMs?: number
  [clave: string]: unknown
}

/** Lista de campos que NUNCA deben aparecer en logs (secretos). */
const CAMPOS_DENEGADOS = new Set([
  'contrasena',
  'password',
  'token',
  'jwt',
  'secreto',
  'apiKey',
  'api_key',
  'DEEPSEEK_API_KEY',
  'JWT_SECRETO',
  'authorization',
])

const sanitizarCampos = (obj: Record<string, unknown>): Record<string, unknown> => {
  const resultado: Record<string, unknown> = {}
  for (const [clave, valor] of Object.entries(obj)) {
    if (CAMPOS_DENEGADOS.has(clave.toLowerCase()) || CAMPOS_DENEGADOS.has(clave)) {
      resultado[clave] = '[REDACTADO]'
    } else {
      resultado[clave] = valor
    }
  }
  return resultado
}

const emitir = (entrada: EntradaLog): void => {
  const { nivel, contexto, mensaje, correlacionId, duracionMs, ...extra } = entrada
  const linea: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    nivel,
    contexto,
    mensaje,
    ...(correlacionId ? { correlacionId } : {}),
    ...(duracionMs !== undefined ? { duracionMs } : {}),
    ...sanitizarCampos(extra),
  }

  const serializado = JSON.stringify(linea)

  if (nivel === 'error') {
    console.error(serializado)
  } else if (nivel === 'advertencia') {
    console.warn(serializado)
  } else {
    console.log(serializado)
  }
}

export const registro = {
  info: (contexto: string, mensaje: string, extra?: Record<string, unknown>): void => {
    emitir({ nivel: 'info', contexto, mensaje, ...extra })
  },
  advertencia: (contexto: string, mensaje: string, extra?: Record<string, unknown>): void => {
    emitir({ nivel: 'advertencia', contexto, mensaje, ...extra })
  },
  error: (contexto: string, error: unknown, extra?: Record<string, unknown>): void => {
    const mensaje = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    emitir({ nivel: 'error', contexto, mensaje, ...(stack ? { stack } : {}), ...extra })
  },
  debug: (contexto: string, mensaje: string, extra?: Record<string, unknown>): void => {
    if (process.env.NODE_ENV === 'production') return
    emitir({ nivel: 'debug', contexto, mensaje, ...extra })
  },
}

/** Genera un ID de correlación único para una petición o ejecución. */
export const generarCorrelacionId = (): string => randomUUID()
