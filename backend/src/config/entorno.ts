import dotenv from 'dotenv'

dotenv.config()

export const entorno = {
  puerto: Number(process.env.PUERTO) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST || 'localhost',
    puerto: Number(process.env.DB_PUERTO) || 3306,
    nombre: process.env.DB_NOMBRE || 'nexora',
    usuario: process.env.DB_USUARIO || 'root',
    contrasena: process.env.DB_CONTRASENA || '',
  },

  jwt: {
    secreto: process.env.JWT_SECRETO || 'secreto_desarrollo',
    expiracion: process.env.JWT_EXPIRACION || '7d',
  },

  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    url: process.env.DEEPSEEK_URL || 'https://api.deepseek.com/v1/chat/completions',
  },
}
