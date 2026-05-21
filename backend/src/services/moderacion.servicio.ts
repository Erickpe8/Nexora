import type { RowDataPacket } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import { io } from '../infrastructure/sockets/socket'
import { ErrorHttp } from '../shared/errors/errorHttp'
import { registro } from '../shared/logger/registro'

const CONTEXTO = 'ServicioModeracion'

export type AccionModeracion = 'oculto' | 'visible'

export interface ResultadoModeracion {
  comentarioId: number
  publicacionId: number
  estadoAnterior: string
  estadoNuevo: AccionModeracion
}

interface ComentarioModerado extends RowDataPacket {
  id: number
  publicacion_id: number
  estado_moderacion: string
}

/**
 * Cambia el estado de moderación de un comentario y emite el evento Socket correspondiente.
 * Fuente de verdad: MySQL. Socket es solo notificación.
 */
export const moderarComentario = async (
  comentarioId: number,
  accion: AccionModeracion,
  moderadorId: number,
  notaInterna?: string
): Promise<ResultadoModeracion> => {
  const [filas] = await pool.execute<ComentarioModerado[]>(
    'SELECT id, publicacion_id, estado_moderacion FROM comentarios WHERE id = ? AND eliminado = FALSE LIMIT 1',
    [comentarioId]
  )

  if (filas.length === 0) {
    throw new ErrorHttp('Comentario no encontrado', 404)
  }

  const comentario = filas[0]
  const estadoAnterior = comentario.estado_moderacion

  if (estadoAnterior === accion) {
    throw new ErrorHttp(`El comentario ya está en estado '${accion}'`, 409)
  }

  // Transacción: actualizar estado + nota interna
  await pool.execute(
    `UPDATE comentarios
     SET estado_moderacion = ?,
         oculto_en = ?,
         moderador_id = ?,
         nota_interna = ?
     WHERE id = ?`,
    [
      accion,
      accion === 'oculto' ? new Date() : null,
      moderadorId,
      notaInterna?.trim().slice(0, 500) ?? null,
      comentarioId,
    ]
  )

  const publicacionId = comentario.publicacion_id

  // Emitir evento de visibilidad a la sala de la publicación
  const evento = accion === 'oculto' ? 'comentario_oculto' : 'comentario_restaurado'
  io.to(`comentarios:${publicacionId}`).emit(evento, { comentarioId, publicacionId })

  registro.info(CONTEXTO, `Comentario ${accion}`, {
    comentarioId,
    publicacionId,
    moderadorId,
    estadoAnterior,
    estadoNuevo: accion,
  })

  return { comentarioId, publicacionId, estadoAnterior, estadoNuevo: accion }
}
