import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import { io } from '../infrastructure/sockets/socket'
import type { Notificacion, TipoNotificacion } from '../types'

interface NotificacionFila extends RowDataPacket {
  id: number
  tipo: TipoNotificacion
  descripcion: string
  publicacion_id: number | null
  comentario_id: number | null
  leida: number
  creado_en: string
}

const mapearNotificacion = (fila: NotificacionFila): Notificacion => ({
  id: fila.id,
  tipo: fila.tipo,
  descripcion: fila.descripcion,
  publicacionId: fila.publicacion_id,
  comentarioId: fila.comentario_id,
  leida: Boolean(fila.leida),
  creadoEn: fila.creado_en,
})

export const crearNotificacion = async (
  usuarioId: number,
  tipo: TipoNotificacion,
  descripcion: string,
  publicacionId: number | null,
  comentarioId: number | null
): Promise<Notificacion> => {
  const [resultado] = await pool.execute<ResultSetHeader>(
    `INSERT INTO notificaciones (usuario_id, tipo, descripcion, publicacion_id, comentario_id)
     VALUES (?, ?, ?, ?, ?)`,
    [usuarioId, tipo, descripcion, publicacionId, comentarioId]
  )

  const [filas] = await pool.execute<NotificacionFila[]>(
    `SELECT id, tipo, descripcion, publicacion_id, comentario_id, leida, creado_en
     FROM notificaciones
     WHERE id = ?
     LIMIT 1`,
    [resultado.insertId]
  )

  const notificacion = mapearNotificacion(filas[0])
  io.to(`usuario:${usuarioId}`).emit('nueva_notificacion', notificacion)
  return notificacion
}

export const obtenerNotificacionesUsuario = async (usuarioId: number): Promise<Notificacion[]> => {
  const [filas] = await pool.execute<NotificacionFila[]>(
    `SELECT id, tipo, descripcion, publicacion_id, comentario_id, leida, creado_en
     FROM notificaciones
     WHERE usuario_id = ?
     ORDER BY creado_en DESC
     LIMIT 50`,
    [usuarioId]
  )

  return filas.map(mapearNotificacion)
}

export const marcarNotificacionLeida = async (usuarioId: number, id: number): Promise<void> => {
  await pool.execute('UPDATE notificaciones SET leida = TRUE WHERE id = ? AND usuario_id = ?', [id, usuarioId])
}

export const marcarTodasLeidas = async (usuarioId: number): Promise<void> => {
  await pool.execute('UPDATE notificaciones SET leida = TRUE WHERE usuario_id = ?', [usuarioId])
}
