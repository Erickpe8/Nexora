import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import { tablaExiste } from '../shared/database/esquema'
import { ErrorHttp } from '../shared/errors/errorHttp'
import { obtenerPublicacionPorId } from './publicaciones.servicio'

interface GuardadoFila extends RowDataPacket {
  id: number
  leer_despues: number
}

export const toggleGuardado = async (
  usuarioId: number,
  publicacionId: number
): Promise<{ guardado: boolean; leerDespues: boolean }> => {
  if (!(await tablaExiste('publicaciones_guardadas'))) {
    throw new ErrorHttp('Guardados no disponibles: ejecuta migraciones', 503)
  }

  await obtenerPublicacionPorId(publicacionId, usuarioId)

  const [existentes] = await pool.execute<GuardadoFila[]>(
    `SELECT id, leer_despues FROM publicaciones_guardadas
     WHERE usuario_id = ? AND publicacion_id = ? LIMIT 1`,
    [usuarioId, publicacionId]
  )

  if (existentes[0]) {
    await pool.execute(`DELETE FROM publicaciones_guardadas WHERE id = ?`, [existentes[0].id])
    return { guardado: false, leerDespues: false }
  }

  await pool.execute(
    `INSERT INTO publicaciones_guardadas (usuario_id, publicacion_id, leer_despues) VALUES (?, ?, FALSE)`,
    [usuarioId, publicacionId]
  )
  return { guardado: true, leerDespues: false }
}

export const actualizarLeerDespues = async (
  usuarioId: number,
  publicacionId: number,
  leerDespues: boolean
): Promise<{ guardado: boolean; leerDespues: boolean }> => {
  if (!(await tablaExiste('publicaciones_guardadas'))) {
    throw new ErrorHttp('Guardados no disponibles', 503)
  }

  const [resultado] = await pool.execute<ResultSetHeader>(
    `UPDATE publicaciones_guardadas SET leer_despues = ? WHERE usuario_id = ? AND publicacion_id = ?`,
    [leerDespues, usuarioId, publicacionId]
  )

  if (resultado.affectedRows === 0) {
    throw new ErrorHttp('Debes guardar la publicación antes de marcar leer después', 400)
  }

  return { guardado: true, leerDespues }
}
