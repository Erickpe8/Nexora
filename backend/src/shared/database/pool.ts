import mysql from 'mysql2/promise'
import { entorno } from '../config/entorno'

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
