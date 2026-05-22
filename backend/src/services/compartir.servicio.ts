import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import { tablaExiste } from '../shared/database/esquema'
import { ErrorHttp } from '../shared/errors/errorHttp'
import { construirUrlPublicacion } from '../utils/urlCompartir'

export type CanalCompartir =
  | 'copy'
  | 'web_share'
  | 'whatsapp'
  | 'x'
  | 'facebook'
  | 'deep_link'
  | 'otro'

export const registrarCompartirPublicacion = async (
  usuarioId: number,
  publicacionId: number,
  canal: CanalCompartir = 'otro'
): Promise<{ url: string; compartidosCount: number }> => {
  const [pub] = await pool.execute<RowDataPacket[]>(
    `SELECT id, slug FROM publicaciones WHERE id = ? LIMIT 1`,
    [publicacionId]
  )
  if (!pub[0]) throw new ErrorHttp('Publicación no encontrada', 404)

  const slug = String(pub[0].slug ?? `noticia-${publicacionId}`)
  const url = construirUrlPublicacion(slug)

  if (await tablaExiste('compartidos_eventos')) {
    await pool.execute(
      `INSERT INTO compartidos_eventos (tipo_objetivo, objetivo_id, usuario_id, canal) VALUES ('publicacion', ?, ?, ?)`,
      [publicacionId, usuarioId, canal]
    )
  }

  await pool.execute(
    `UPDATE publicaciones SET compartidos_count = COALESCE(compartidos_count, 0) + 1 WHERE id = ?`,
    [publicacionId]
  )

  const [cnt] = await pool.execute<RowDataPacket[]>(
    `SELECT COALESCE(compartidos_count, 0) AS total FROM publicaciones WHERE id = ?`,
    [publicacionId]
  )

  return { url, compartidosCount: Number(cnt[0]?.total ?? 0) }
}

export const registrarCompartirComentario = async (
  usuarioId: number,
  comentarioId: number,
  canal: CanalCompartir = 'otro'
): Promise<{ url: string }> => {
  const [filas] = await pool.execute<RowDataPacket[]>(
    `SELECT c.id, c.publicacion_id, c.estado_moderacion, c.eliminado, p.slug
     FROM comentarios c
     INNER JOIN publicaciones p ON p.id = c.publicacion_id
     WHERE c.id = ? LIMIT 1`,
    [comentarioId]
  )
  const row = filas[0]
  if (!row) throw new ErrorHttp('Comentario no encontrado', 404)
  if (row.eliminado || row.estado_moderacion === 'oculto') {
    throw new ErrorHttp('No se puede compartir este comentario', 403)
  }

  const slug = String(row.slug ?? `noticia-${row.publicacion_id}`)
  const url = construirUrlPublicacion(slug, comentarioId)

  if (await tablaExiste('compartidos_eventos')) {
    await pool.execute(
      `INSERT INTO compartidos_eventos (tipo_objetivo, objetivo_id, usuario_id, canal) VALUES ('comentario', ?, ?, ?)`,
      [comentarioId, usuarioId, canal]
    )
  }

  return { url }
}
