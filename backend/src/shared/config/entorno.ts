import dotenv from 'dotenv'

dotenv.config()

/** Placeholders conocidos que no deben usarse en producción. */
const PLACEHOLDERS_PROHIBIDOS = new Set([
  'cambia_este_secreto',
  'tu_api_key_aqui',
  'secreto_desarrollo',
  'changeme',
  'secret',
  'your_secret_here',
])

const esPlaceholder = (valor: string): boolean =>
  PLACEHOLDERS_PROHIBIDOS.has(valor.toLowerCase().trim())

/**
 * Valida que una variable de entorno exista y no sea placeholder en producción.
 * En desarrollo solo advierte; en producción lanza error y detiene el proceso.
 */
/** En Vercel serverless, nunca hacer process.exit al importar el módulo (tumba toda la función). */
const esServerlessVercel = Boolean(process.env.VERCEL)

const requerirEnProd = (nombre: string, valor: string | undefined): string => {
  if (!valor || valor.trim() === '') {
    const msg = `[Config] Variable de entorno requerida no definida: ${nombre}`
    if (process.env.NODE_ENV === 'production' && !esServerlessVercel) {
      console.error(msg)
      process.exit(1)
    }
    console.warn(msg)
    return ''
  }
  if (process.env.NODE_ENV === 'production' && esPlaceholder(valor)) {
    const msg = `[Config] Variable ${nombre} contiene un placeholder prohibido en producción`
    if (!esServerlessVercel) {
      console.error(msg)
      process.exit(1)
    }
    console.warn(msg)
  }
  return valor
}

const parsearMysqlUrl = (raw: string) => {
  const u = new URL(raw)
  return {
    host: u.hostname,
    puerto: Number(u.port) || 3306,
    nombre: u.pathname.replace(/^\//, '') || 'nexora',
    usuario: decodeURIComponent(u.username),
    contrasena: decodeURIComponent(u.password),
  }
}

const resolverDb = () => {
  const url = process.env.MYSQL_URL || process.env.DATABASE_URL
  if (url?.startsWith('mysql://')) {
    return parsearMysqlUrl(url)
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    puerto: Number(process.env.DB_PUERTO) || 3306,
    nombre: process.env.DB_NOMBRE || 'nexora',
    usuario: process.env.DB_USUARIO || 'root',
    contrasena: process.env.DB_CONTRASENA || '',
  }
}

/** Configuración validada en arranque (SPEC gestion-configuracion-secretos). */
export const entorno = {
  puerto: Number(process.env.PUERTO) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: resolverDb(),

  jwt: {
    secreto: requerirEnProd('JWT_SECRETO', process.env.JWT_SECRETO) || 'secreto_desarrollo',
    expiracion: process.env.JWT_EXPIRACION || '7d',
  },

  deepseek: {
    apiKey: requerirEnProd('DEEPSEEK_API_KEY', process.env.DEEPSEEK_API_KEY) || '',
    url: process.env.DEEPSEEK_URL || 'https://api.deepseek.com/v1/chat/completions',
  },

  /** API key interna para el endpoint /api/interno/ia/generar */
  interno: {
    apiKey: process.env.INTERNO_API_KEY || 'nexora_interno_dev',
  },

  /** Flag para habilitar moderación automática por umbral de denuncias */
  moderacion: {
    umbralAutoDenuncias: Number(process.env.MODERACION_UMBRAL_DENUNCIAS) || 5,
    habilitarAutoOcultar: process.env.MODERACION_AUTO_OCULTAR === 'true',
  },

  /** Cron externo (GitHub Actions, VPS, Railway, etc.) */
  cron: {
    secreto: process.env.CRON_SECRET || '',
    origenesPermitidos: (process.env.CRON_ORIGENES_PERMITIDOS ||
      'github-actions,manual,render,railway,vps,local')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
  },
} as const

export type ConfigNexora = typeof entorno
