import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import { ErrorHttp } from '../shared/errors/errorHttp'
import { entorno } from '../shared/config/entorno'
import type { NuevaDenuncia, Denuncia, RespuestaPaginadaDenuncias } from '../types'

interface DenunciaFila extends RowDataPacket {
  id: number
  tipo_objetivo: 'comentario' | 'publicacion'
  objetivo_id: number
  autor_id: number
  motivo: string
  detalle: string | null
  estado: string
  creado_en: string
}

const mapearDenuncia = (fila: DenunciaFila): Denuncia => ({
  id: fila.id,
  tipoObjetivo: fila.tipo_objetivo,
  objetivoId: fila.objetivo_id,
  autorId: fila.autor_id,
  motivo: fila.motivo,
  detalle: fila.detalle,
  estado: fila.estado as Denuncia['estado'],
  creadoEn: fila.creado_en,
})

/** Ventana de deduplicación: un usuario no puede denunciar el mismo objetivo dos veces en 24h. */
const VENTANA_DEDUP_HORAS = 24

const existeDenunciaReciente = async (
  autorId: number,
  tipoObjetivo: string,
  objetivoId: number
): Promise<boolean> => {
  const [filas] = await pool.execute<RowDataPacket[]>(
    `SELECT id FROM denuncias
     WHERE autor_id = ? AND tipo_objetivo = ? AND objetivo_id = ?
       AND creado_en >= DATE_SUB(NOW(), INTERVAL ? HOUR)
     LIMIT 1`,
    [autorId, tipoObjetivo, objetivoId, VENTANA_DEDUP_HORAS]
  )
  return filas.length > 0
}

export const crearDenuncia = async (
  autorId: number,
  datos: NuevaDenuncia
): Promise<Denuncia> => {
  // Verificar que el comentario existe
  if (datos.tipoObjetivo === 'comentario') {
    const [filas] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM comentarios WHERE id = ? AND eliminado = FALSE LIMIT 1',
      [datos.objetivoId]
    )
    if (filas.length === 0) {
      throw new ErrorHttp('Comentario no encontrado', 404)
    }
  }

  // Anti-duplicado en ventana de 24h
  const yaDenuncio = await existeDenunciaReciente(autorId, datos.tipoObjetivo, datos.objetivoId)
  if (yaDenuncio) {
    throw new ErrorHttp('Ya has denunciado este contenido recientemente', 409)
  }

  const [resultado] = await pool.execute<ResultSetHeader>(
    `INSERT INTO denuncias (tipo_objetivo, objetivo_id, autor_id, motivo, detalle)
     VALUES (?, ?, ?, ?, ?)`,
    [
      datos.tipoObjetivo,
      datos.objetivoId,
      autorId,
      datos.motivo,
      datos.detalle?.trim().slice(0, 500) ?? null,
    ]
  )

  const [filas] = await pool.execute<DenunciaFila[]>(
    'SELECT * FROM denuncias WHERE id = ? LIMIT 1',
    [resultado.insertId]
  )

  const denuncia = mapearDenuncia(filas[0])

  // Auto-ocultar si se supera el umbral configurado
  if (
    entorno.moderacion.habilitarAutoOcultar &&
    datos.tipoObjetivo === 'comentario'
  ) {
    await verificarUmbralAutoOcultar(datos.objetivoId)
  }

  return denuncia
}

const verificarUmbralAutoOcultar = async (comentarioId: number): Promise<void> => {
  const [filas] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM denuncias
     WHERE tipo_objetivo = 'comentario' AND objetivo_id = ? AND estado = 'pendiente'`,
    [comentarioId]
  )
  const total = Number(filas[0]?.total ?? 0)
  if (total >= entorno.moderacion.umbralAutoDenuncias) {
    await pool.execute(
      `UPDATE comentarios SET estado_moderacion = 'oculto', oculto_en = NOW()
       WHERE id = ? AND estado_moderacion = 'visible'`,
      [comentarioId]
    )
  }
}

export const obtenerDenunciasPaginadas = async (
  pagina: number,
  limite: number,
  estado?: string
): Promise<RespuestaPaginadaDenuncias> => {
  const paginaNorm = Math.max(1, pagina)
  const limiteNorm = Math.min(50, Math.max(1, limite))
  const offset = (paginaNorm - 1) * limiteNorm

  const condicion = estado ? 'WHERE estado = ?' : ''
  const params = estado ? [estado, limiteNorm, offset] : [limiteNorm, offset]

  const [conteo] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM denuncias ${condicion}`,
    estado ? [estado] : []
  )
  const total = Number(conteo[0]?.total ?? 0)

  const [filas] = await pool.query<DenunciaFila[]>(
    `SELECT * FROM denuncias ${condicion} ORDER BY creado_en DESC LIMIT ${limiteNorm} OFFSET ${offset}`,
    estado ? [estado] : []
  )

  return {
    denuncias: filas.map(mapearDenuncia),
    pagina: paginaNorm,
    totalPaginas: Math.max(1, Math.ceil(total / limiteNorm)),
    total,
  }
}
