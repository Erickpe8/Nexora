import type { RowDataPacket } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import { ErrorHttp } from '../shared/errors/errorHttp'
import type { Publicacion, RespuestaFeed } from '../types'

interface PublicacionFila extends RowDataPacket {
  id: number
  titulo: string
  resumen: string
  pregunta: string
  etiquetas: string | null
  generado_por_ia: number
  creado_en: string
  total_comentarios: number
  total_reacciones: number
  mi_reaccion: string | null
}

const parsearEtiquetas = (etiquetas: string | null): string[] => {
  if (!etiquetas) return []
  try {
    const valor = JSON.parse(etiquetas) as string[]
    return Array.isArray(valor) ? valor : []
  } catch {
    return []
  }
}

const mapearPublicacion = (fila: PublicacionFila): Publicacion => ({
  id: fila.id,
  titulo: fila.titulo,
  resumen: fila.resumen,
  pregunta: fila.pregunta,
  etiquetas: parsearEtiquetas(fila.etiquetas),
  generadoPorIa: Boolean(fila.generado_por_ia),
  creadoEn: fila.creado_en,
  totalComentarios: Number(fila.total_comentarios || 0),
  totalReacciones: Number(fila.total_reacciones || 0),
  miReaccion: (fila.mi_reaccion as Publicacion['miReaccion']) ?? null,
})

export const obtenerFeedPaginado = async (
  pagina: number,
  limite: number,
  usuarioId: number,
  buscar?: string
): Promise<RespuestaFeed> => {
  const paginaNormalizada = Number.isNaN(pagina) || pagina < 1 ? 1 : pagina
  const limiteNormalizado = Number.isNaN(limite) || limite < 1 ? 10 : Math.min(limite, 50)
  const offset = (paginaNormalizada - 1) * limiteNormalizado

  const terminoBusqueda = buscar?.trim() ?? ''
  const hayBusqueda = terminoBusqueda.length > 0
  const like = `%${terminoBusqueda}%`

  const whereClause = hayBusqueda
    ? `WHERE (p.titulo LIKE ? OR p.resumen LIKE ? OR p.pregunta LIKE ? OR JSON_SEARCH(p.etiquetas, 'one', ?) IS NOT NULL)`
    : ''
  const whereParams = hayBusqueda ? [like, like, like, terminoBusqueda] : []

  const [conteo] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM publicaciones p ${whereClause}`,
    whereParams
  )
  const total = Number(conteo[0]?.total ?? 0)
  const totalPaginas = Math.max(1, Math.ceil(total / limiteNormalizado))

  const [filas] = await pool.query<PublicacionFila[]>(
    `SELECT
      p.id, p.titulo, p.resumen, p.pregunta, p.etiquetas, p.generado_por_ia, p.creado_en,
      (SELECT COUNT(*) FROM comentarios c WHERE c.publicacion_id = p.id) AS total_comentarios,
      (SELECT COUNT(*) FROM reacciones_publicacion r WHERE r.publicacion_id = p.id) AS total_reacciones,
      (SELECT r2.tipo FROM reacciones_publicacion r2 WHERE r2.publicacion_id = p.id AND r2.usuario_id = ${usuarioId} LIMIT 1) AS mi_reaccion
    FROM publicaciones p
    ${whereClause}
    ORDER BY p.creado_en DESC
    LIMIT ${limiteNormalizado} OFFSET ${offset}`,
    whereParams
  )

  return {
    publicaciones: filas.map(mapearPublicacion),
    pagina: paginaNormalizada,
    totalPaginas,
  }
}

export const obtenerPublicacionPorId = async (id: number, usuarioId: number): Promise<Publicacion> => {
  const [filas] = await pool.execute<PublicacionFila[]>(
    `SELECT
      p.id, p.titulo, p.resumen, p.pregunta, p.etiquetas, p.generado_por_ia, p.creado_en,
      (SELECT COUNT(*) FROM comentarios c WHERE c.publicacion_id = p.id) AS total_comentarios,
      (SELECT COUNT(*) FROM reacciones_publicacion r WHERE r.publicacion_id = p.id) AS total_reacciones,
      (SELECT r2.tipo FROM reacciones_publicacion r2 WHERE r2.publicacion_id = p.id AND r2.usuario_id = ? LIMIT 1) AS mi_reaccion
    FROM publicaciones p
    WHERE p.id = ?
    LIMIT 1`,
    [usuarioId, id]
  )

  if (filas.length === 0) {
    throw new ErrorHttp('Publicación no encontrada', 404)
  }

  return mapearPublicacion(filas[0])
}
