import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../config/baseDatos'
import { io } from '../sockets/socket'
import { ErrorHttp } from '../middlewares/errores'
import { crearNotificacion } from './notificaciones.servicio'
import type { Comentario, NuevoComentario } from '../types'

interface ComentarioFila extends RowDataPacket {
  id: number
  publicacion_id: number
  usuario_id: number
  nombre_usuario: string
  comentario_padre_id: number | null
  contenido: string
  eliminado: number
  creado_en: string
}

const mapearComentario = (fila: ComentarioFila): Comentario => ({
  id: fila.id,
  publicacionId: fila.publicacion_id,
  usuarioId: fila.usuario_id,
  nombreUsuario: fila.nombre_usuario,
  comentarioPadreId: fila.comentario_padre_id,
  contenido: Boolean(fila.eliminado) ? '[comentario eliminado]' : fila.contenido,
  eliminado: Boolean(fila.eliminado),
  creadoEn: fila.creado_en,
  respuestas: [],
})

const obtenerComentarioPorId = async (comentarioId: number): Promise<ComentarioFila | null> => {
  const [filas] = await pool.execute<ComentarioFila[]>(
    `SELECT c.id, c.publicacion_id, c.usuario_id, u.nombre AS nombre_usuario, c.comentario_padre_id, c.contenido, c.eliminado, c.creado_en
     FROM comentarios c
     INNER JOIN usuarios u ON u.id = c.usuario_id
     WHERE c.id = ?
     LIMIT 1`,
    [comentarioId]
  )
  return filas[0] ?? null
}

export const obtenerComentariosPublicacion = async (publicacionId: number): Promise<Comentario[]> => {
  const [filas] = await pool.execute<ComentarioFila[]>(
    `SELECT c.id, c.publicacion_id, c.usuario_id, u.nombre AS nombre_usuario, c.comentario_padre_id, c.contenido, c.eliminado, c.creado_en
     FROM comentarios c
     INNER JOIN usuarios u ON u.id = c.usuario_id
     WHERE c.publicacion_id = ?
     ORDER BY c.creado_en ASC`,
    [publicacionId]
  )

  const comentariosRaiz: Comentario[] = []
  const mapa = new Map<number, Comentario>()

  for (const fila of filas) {
    const comentario = mapearComentario(fila)
    mapa.set(comentario.id, comentario)
    if (comentario.comentarioPadreId) {
      const padre = mapa.get(comentario.comentarioPadreId)
      if (padre) {
        padre.respuestas.push(comentario)
      }
    } else {
      comentariosRaiz.push(comentario)
    }
  }

  return comentariosRaiz
}

export const crearComentario = async (
  publicacionId: number,
  usuarioId: number,
  nombreUsuario: string,
  datos: NuevoComentario,
  socketId: string | null
): Promise<Comentario> => {
  const contenido = datos.contenido?.trim()
  if (!contenido || contenido.length > 500) {
    throw new ErrorHttp('El comentario debe tener entre 1 y 500 caracteres', 400)
  }

  let comentarioPadreId: number | null = null
  let autorPadreId: number | null = null
  if (datos.comentarioPadreId) {
    const comentarioPadre = await obtenerComentarioPorId(datos.comentarioPadreId)
    if (!comentarioPadre || comentarioPadre.publicacion_id !== publicacionId) {
      throw new ErrorHttp('El comentario padre no existe', 400)
    }
    if (comentarioPadre.comentario_padre_id) {
      throw new ErrorHttp('Solo se permite un nivel de anidación', 400)
    }
    comentarioPadreId = comentarioPadre.id
    autorPadreId = comentarioPadre.usuario_id
  }

  const [resultado] = await pool.execute<ResultSetHeader>(
    `INSERT INTO comentarios (publicacion_id, usuario_id, comentario_padre_id, contenido)
     VALUES (?, ?, ?, ?)`,
    [publicacionId, usuarioId, comentarioPadreId, contenido]
  )

  const fila = await obtenerComentarioPorId(resultado.insertId)
  if (!fila) {
    throw new ErrorHttp('No se pudo crear el comentario', 500)
  }
  const comentario = mapearComentario(fila)

  io.to(`comentarios:${publicacionId}`).emit('nuevo_comentario', { comentario, socketId })

  if (autorPadreId && autorPadreId !== usuarioId) {
    await crearNotificacion(
      autorPadreId,
      'nueva_respuesta',
      `${nombreUsuario} respondió a tu comentario`,
      publicacionId,
      comentario.id
    )
  }

  const [participantes] = await pool.execute<RowDataPacket[]>(
    `SELECT DISTINCT usuario_id FROM comentarios WHERE publicacion_id = ? AND usuario_id <> ?`,
    [publicacionId, usuarioId]
  )
  for (const filaParticipante of participantes) {
    const participanteId = Number(filaParticipante.usuario_id)
    if (participanteId === autorPadreId) continue
    await crearNotificacion(
      participanteId,
      'actividad_publicacion',
      `${nombreUsuario} comentó en una publicación donde participas`,
      publicacionId,
      comentario.id
    )
  }

  return comentario
}

export const eliminarComentario = async (
  comentarioId: number,
  usuarioId: number,
  socketId: string | null
): Promise<void> => {
  const comentario = await obtenerComentarioPorId(comentarioId)
  if (!comentario) {
    throw new ErrorHttp('Comentario no encontrado', 404)
  }
  if (comentario.usuario_id !== usuarioId) {
    throw new ErrorHttp('No tienes permisos para eliminar este comentario', 403)
  }

  const [respuestas] = await pool.execute<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM comentarios WHERE comentario_padre_id = ?',
    [comentarioId]
  )
  const tieneRespuestas = Number(respuestas[0]?.total ?? 0) > 0

  if (tieneRespuestas) {
    await pool.execute('UPDATE comentarios SET eliminado = TRUE, contenido = "" WHERE id = ?', [comentarioId])
  } else {
    await pool.execute('DELETE FROM comentarios WHERE id = ?', [comentarioId])
  }

  io.to(`comentarios:${comentario.publicacion_id}`).emit('comentario_eliminado', {
    id: comentarioId,
    socketId,
  })
}
