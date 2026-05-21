import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import { io } from '../infrastructure/sockets/socket'
import { ErrorHttp } from '../shared/errors/errorHttp'

interface ResumenLike {
  comentarioId: number
  publicacionId: number
  totalLikes: number
  meDioLike: boolean
}

const obtenerPublicacionDeComentario = async (comentarioId: number): Promise<number> => {
  const [filas] = await pool.execute<RowDataPacket[]>(
    'SELECT publicacion_id FROM comentarios WHERE id = ? AND eliminado = FALSE LIMIT 1',
    [comentarioId]
  )
  if (filas.length === 0) throw new ErrorHttp('Comentario no encontrado', 404)
  return Number(filas[0].publicacion_id)
}

const contarLikes = async (comentarioId: number, usuarioId: number): Promise<{ total: number; meDioLike: boolean }> => {
  const [conteo] = await pool.execute<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM likes_comentario WHERE comentario_id = ?',
    [comentarioId]
  )
  const [miLike] = await pool.execute<RowDataPacket[]>(
    'SELECT id FROM likes_comentario WHERE comentario_id = ? AND usuario_id = ? LIMIT 1',
    [comentarioId, usuarioId]
  )
  return {
    total: Number(conteo[0]?.total ?? 0),
    meDioLike: miLike.length > 0,
  }
}

export const darLike = async (comentarioId: number, usuarioId: number): Promise<ResumenLike> => {
  const publicacionId = await obtenerPublicacionDeComentario(comentarioId)

  await pool.execute<ResultSetHeader>(
    `INSERT IGNORE INTO likes_comentario (comentario_id, usuario_id) VALUES (?, ?)`,
    [comentarioId, usuarioId]
  )

  const { total, meDioLike } = await contarLikes(comentarioId, usuarioId)
  const resumen: ResumenLike = { comentarioId, publicacionId, totalLikes: total, meDioLike }
  io.to(`comentarios:${publicacionId}`).emit('like_comentario', resumen)
  return resumen
}

export const quitarLike = async (comentarioId: number, usuarioId: number): Promise<ResumenLike> => {
  const publicacionId = await obtenerPublicacionDeComentario(comentarioId)

  await pool.execute(
    'DELETE FROM likes_comentario WHERE comentario_id = ? AND usuario_id = ?',
    [comentarioId, usuarioId]
  )

  const { total, meDioLike } = await contarLikes(comentarioId, usuarioId)
  const resumen: ResumenLike = { comentarioId, publicacionId, totalLikes: total, meDioLike }
  io.to(`comentarios:${publicacionId}`).emit('like_comentario', resumen)
  return resumen
}
