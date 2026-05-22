import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import { columnaExiste, tablaExiste } from '../shared/database/esquema'
import { io } from '../infrastructure/sockets/socket'
import { ErrorHttp } from '../shared/errors/errorHttp'
import { crearNotificacion } from './notificaciones.servicio'
import type { Comentario, NuevoComentario } from '../types'

interface ComentarioFila extends RowDataPacket {
  id: number
  publicacion_id: number
  usuario_id: number
  nombre_usuario: string
  username: string
  comentario_padre_id: number | null
  contenido: string
  eliminado: number
  estado_moderacion: 'visible' | 'oculto'
  creado_en: string
  total_likes: number
  me_dio_like: number
}

const selectComentarios = async (): Promise<{
  sql: string
  incluyeUsuarioEnParams: boolean
}> => {
  const conLikes = await tablaExiste('likes_comentario')
  const conModeracion = await columnaExiste('comentarios', 'estado_moderacion')
  const estadoModeracion = conModeracion ? 'c.estado_moderacion' : "'visible' AS estado_moderacion"
  const camposLikes = conLikes
    ? `(SELECT COUNT(*) FROM likes_comentario l WHERE l.comentario_id = c.id) AS total_likes,
       (SELECT COUNT(*) FROM likes_comentario l2 WHERE l2.comentario_id = c.id AND l2.usuario_id = ?) AS me_dio_like`
    : '0 AS total_likes, 0 AS me_dio_like'

  return {
    incluyeUsuarioEnParams: conLikes,
    sql: `SELECT c.id, c.publicacion_id, c.usuario_id, u.nombre AS nombre_usuario,
            COALESCE(u.username, CONCAT('user', u.id)) AS username,
            c.comentario_padre_id, c.contenido, c.eliminado, ${estadoModeracion}, c.creado_en,
            ${camposLikes}
     FROM comentarios c
     INNER JOIN usuarios u ON u.id = c.usuario_id`,
  }
}

const mapearComentario = (fila: ComentarioFila): Comentario => ({
  id: fila.id,
  publicacionId: fila.publicacion_id,
  usuarioId: fila.usuario_id,
  nombreUsuario: fila.nombre_usuario,
  username: fila.username,
  comentarioPadreId: fila.comentario_padre_id,
  contenido: Boolean(fila.eliminado) ? '[comentario eliminado]' : fila.contenido,
  eliminado: Boolean(fila.eliminado),
  estadoModeracion: fila.estado_moderacion ?? 'visible',
  creadoEn: fila.creado_en,
  respuestas: [],
  totalLikes: Number(fila.total_likes || 0),
  meDioLike: Boolean(fila.me_dio_like),
})

const obtenerComentarioPorId = async (comentarioId: number, usuarioId = 0): Promise<ComentarioFila | null> => {
  const base = await selectComentarios()
  const params = base.incluyeUsuarioEnParams ? [usuarioId, comentarioId] : [comentarioId]
  const [filas] = await pool.execute<ComentarioFila[]>(
    `${base.sql} WHERE c.id = ? LIMIT 1`,
    params
  )
  return filas[0] ?? null
}

export const obtenerComentariosPublicacion = async (publicacionId: number, usuarioId = 0): Promise<Comentario[]> => {
  const base = await selectComentarios()
  const params = base.incluyeUsuarioEnParams ? [usuarioId, publicacionId] : [publicacionId]
  const [filas] = await pool.execute<ComentarioFila[]>(
    `${base.sql} WHERE c.publicacion_id = ? ORDER BY c.creado_en ASC`,
    params
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
    const comentarioPadre = await obtenerComentarioPorId(datos.comentarioPadreId, usuarioId)
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

  const fila = await obtenerComentarioPorId(resultado.insertId, usuarioId)
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
  const comentario = await obtenerComentarioPorId(comentarioId, usuarioId)
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
