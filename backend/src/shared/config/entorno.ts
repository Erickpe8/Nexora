import dotenv from 'dotenv'

dotenv.config()

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

/** Configuración validada en arranque (ver SPEC gestion-configuracion-secretos). */
export const entorno = {
  puerto: Number(process.env.PUERTO) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: resolverDb(),

  jwt: {
    secreto: process.env.JWT_SECRETO || 'secreto_desarrollo',
    expiracion: process.env.JWT_EXPIRACION || '7d',
  },

  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    url: process.env.DEEPSEEK_URL || 'https://api.deepseek.com/v1/chat/completions',
  },
}
