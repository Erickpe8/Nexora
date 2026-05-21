import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import { io } from '../infrastructure/sockets/socket'
import { ErrorHttp } from '../shared/errors/errorHttp'
import type { TipoReaccion, ResumenReacciones } from '../types'

const TIPOS_VALIDOS: TipoReaccion[] = ['me_gusta', 'fuego', 'mente_explotada', 'curioso']

export const obtenerResumenReacciones = async (
  publicacionId: number,
  usuarioId: number
): Promise<ResumenReacciones> => {
  const [filas] = await pool.execute<RowDataPacket[]>(
    `SELECT tipo, COUNT(*) AS total FROM reacciones_publicacion
     WHERE publicacion_id = ? GROUP BY tipo`,
    [publicacionId]
  )

  const porTipo: Record<TipoReaccion, number> = {
    me_gusta: 0,
    fuego: 0,
    mente_explotada: 0,
    curioso: 0,
  }
  let total = 0
  for (const fila of filas) {
    const tipo = fila.tipo as TipoReaccion
    porTipo[tipo] = Number(fila.total)
    total += Number(fila.total)
  }

  const [miReaccionFila] = await pool.execute<RowDataPacket[]>(
    `SELECT tipo FROM reacciones_publicacion WHERE publicacion_id = ? AND usuario_id = ? LIMIT 1`,
    [publicacionId, usuarioId]
  )
  const miReaccion = (miReaccionFila[0]?.tipo as TipoReaccion) ?? null

  return { total, porTipo, miReaccion }
}

export const reaccionar = async (
  publicacionId: number,
  usuarioId: number,
  tipo: TipoReaccion
): Promise<ResumenReacciones> => {
  if (!TIPOS_VALIDOS.includes(tipo)) {
    throw new ErrorHttp('Tipo de reacción inválido', 400)
  }

  // Verificar que la publicación existe
  const [pub] = await pool.execute<RowDataPacket[]>(
    'SELECT id FROM publicaciones WHERE id = ? LIMIT 1',
    [publicacionId]
  )
  if (pub.length === 0) throw new ErrorHttp('Publicación no encontrada', 404)

  // Upsert: si ya existe cambia el tipo, si no existe la crea
  await pool.execute<ResultSetHeader>(
    `INSERT INTO reacciones_publicacion (publicacion_id, usuario_id, tipo)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE tipo = VALUES(tipo)`,
    [publicacionId, usuarioId, tipo]
  )

  const resumen = await obtenerResumenReacciones(publicacionId, usuarioId)
  io.to(`comentarios:${publicacionId}`).emit('reaccion_publicacion', { publicacionId, resumen })
  return resumen
}

export const quitarReaccion = async (
  publicacionId: number,
  usuarioId: number
): Promise<ResumenReacciones> => {
  await pool.execute(
    'DELETE FROM reacciones_publicacion WHERE publicacion_id = ? AND usuario_id = ?',
    [publicacionId, usuarioId]
  )

  const resumen = await obtenerResumenReacciones(publicacionId, usuarioId)
  io.to(`comentarios:${publicacionId}`).emit('reaccion_publicacion', { publicacionId, resumen })
  return resumen
}
