import mysql from 'mysql2/promise'
import { entorno } from '../config/entorno'

const usarSsl =
  process.env.DB_SSL === 'true' ||
  process.env.DB_SSL === '1' ||
  process.env.MYSQL_URL?.includes('ssl-mode=REQUIRED') ||
  process.env.DATABASE_URL?.includes('ssl-mode=REQUIRED')

/** Railway y otros proxies suelen usar certificado intermedio; relax solo si DB_SSL_RELAX=true */
const sslRelajado = process.env.DB_SSL_RELAX === 'true' || process.env.DB_SSL_RELAX === '1'

export const pool = mysql.createPool({
  host: entorno.db.host,
  port: entorno.db.puerto,
  database: entorno.db.nombre,
  user: entorno.db.usuario,
  password: entorno.db.contrasena,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  timezone: '+00:00',
  ...(usarSsl
    ? { ssl: { rejectUnauthorized: !sslRelajado } }
    : {}),
})

export const verificarConexion = async (): Promise<void> => {
  try {
    const conexion = await pool.getConnection()
    console.log('✅ Conexión a MySQL establecida correctamente')
    conexion.release()
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error)
    process.exit(1)
  }
}
