import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import { ErrorHttp } from '../shared/errors/errorHttp'
import type { ItemHistorial, PerfilPublico, PerfilUsuario } from '../types'

interface PerfilFila extends RowDataPacket {
  id: number
  nombre: string
  correo: string
  creado_en: string
  total_comentarios: number
}

interface HistorialFila extends RowDataPacket {
  id: number
  contenido: string
  creado_en: string
  publicacion_id: number
  publicacion_titulo: string
}

const mapearPerfilUsuario = (fila: PerfilFila): PerfilUsuario => ({
  id: fila.id,
  nombre: fila.nombre,
  correo: fila.correo,
  creadoEn: fila.creado_en,
  totalComentarios: Number(fila.total_comentarios || 0),
})

const mapearPerfilPublico = (fila: PerfilFila): PerfilPublico => ({
  id: fila.id,
  nombre: fila.nombre,
  creadoEn: fila.creado_en,
  totalComentarios: Number(fila.total_comentarios || 0),
})

export const obtenerPerfilPropio = async (usuarioId: number): Promise<PerfilUsuario> => {
  const [filas] = await pool.execute<PerfilFila[]>(
    `SELECT
      u.id, u.nombre, u.correo, u.creado_en,
      (SELECT COUNT(*) FROM comentarios c WHERE c.usuario_id = u.id AND c.eliminado = FALSE) AS total_comentarios
     FROM usuarios u
     WHERE u.id = ?
     LIMIT 1`,
    [usuarioId]
  )
  if (filas.length === 0) throw new ErrorHttp('Usuario no encontrado', 404)
  return mapearPerfilUsuario(filas[0])
}

export const actualizarNombrePerfil = async (usuarioId: number, nombre: string): Promise<PerfilUsuario> => {
  const nombreLimpio = nombre.trim()
  if (nombreLimpio.length < 3 || nombreLimpio.length > 30) {
    throw new ErrorHttp('El nombre debe tener entre 3 y 30 caracteres', 400)
  }

  const [ocupado] = await pool.execute<RowDataPacket[]>(
    'SELECT id FROM usuarios WHERE nombre = ? AND id <> ? LIMIT 1',
    [nombreLimpio, usuarioId]
  )
  if (ocupado.length > 0) throw new ErrorHttp('El nombre ya está en uso', 409)

  await pool.execute<ResultSetHeader>('UPDATE usuarios SET nombre = ? WHERE id = ?', [nombreLimpio, usuarioId])
  return obtenerPerfilPropio(usuarioId)
}

export const obtenerPerfilPublico = async (usuarioId: number): Promise<PerfilPublico> => {
  const [filas] = await pool.execute<PerfilFila[]>(
    `SELECT
      u.id, u.nombre, u.correo, u.creado_en,
      (SELECT COUNT(*) FROM comentarios c WHERE c.usuario_id = u.id AND c.eliminado = FALSE) AS total_comentarios
     FROM usuarios u
     WHERE u.id = ?
     LIMIT 1`,
    [usuarioId]
  )
  if (filas.length === 0) throw new ErrorHttp('Usuario no encontrado', 404)
  return mapearPerfilPublico(filas[0])
}

export const obtenerHistorialComentarios = async (usuarioId: number): Promise<ItemHistorial[]> => {
  const [filas] = await pool.execute<HistorialFila[]>(
    `SELECT
      c.id, c.contenido, c.creado_en, p.id AS publicacion_id, p.titulo AS publicacion_titulo
     FROM comentarios c
     INNER JOIN publicaciones p ON p.id = c.publicacion_id
     WHERE c.usuario_id = ? AND c.eliminado = FALSE
     ORDER BY c.creado_en DESC
     LIMIT 20`,
    [usuarioId]
  )

  return filas.map(fila => ({
    id: fila.id,
    contenido: fila.contenido,
    creadoEn: fila.creado_en,
    publicacion: {
      id: fila.publicacion_id,
      titulo: fila.publicacion_titulo,
    },
  }))
}
