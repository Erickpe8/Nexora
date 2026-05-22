import type { RowDataPacket } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import { tablaExiste } from '../shared/database/esquema'
import { ErrorHttp } from '../shared/errors/errorHttp'
import type { Publicacion, RespuestaFeed } from '../types'

export interface PublicacionFila extends RowDataPacket {
  id: number
  slug: string | null
  titulo: string
  resumen: string
  contenido_expandido: string | null
  pregunta: string
  categoria: string | null
  etiquetas: string | null
  fuente_url: string | null
  imagen_url: string | null
  relevancia: number | null
  generado_por_ia: number
  creado_en: string
  total_comentarios: number
  total_reacciones: number
  mi_reaccion: string | null
  compartidos_count?: number
  guardado_por_mi?: number
  leer_despues?: number | null
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

export const mapearPublicacion = (fila: PublicacionFila): Publicacion => {
  const etiquetas = parsearEtiquetas(fila.etiquetas)
  return {
    id: fila.id,
    slug: fila.slug ?? `noticia-${fila.id}`,
    titulo: fila.titulo,
    resumen: fila.resumen,
    contenidoExpandido: fila.contenido_expandido ?? fila.resumen,
    pregunta: fila.pregunta,
    categoria: fila.categoria ?? etiquetas[0] ?? null,
    etiquetas,
    fuenteUrl: fila.fuente_url ?? null,
    imagenUrl: fila.imagen_url ?? null,
    relevancia: Number(fila.relevancia ?? 0),
    generadoPorIa: Boolean(fila.generado_por_ia),
    creadoEn: fila.creado_en,
    totalComentarios: Number(fila.total_comentarios || 0),
    totalReacciones: Number(fila.total_reacciones || 0),
    miReaccion: (fila.mi_reaccion as Publicacion['miReaccion']) ?? null,
    compartidosCount: Number(fila.compartidos_count ?? 0),
    guardadoPorMi: Boolean(fila.guardado_por_mi),
    leerDespues: Boolean(fila.leer_despues),
  }
}

const CAMPOS_PUBLICACION = `p.id,
      COALESCE(p.slug, CONCAT('noticia-', p.id)) AS slug,
      p.titulo, p.resumen, p.contenido_expandido, p.pregunta, p.categoria, p.etiquetas,
      p.fuente_url, p.imagen_url, p.relevancia, p.generado_por_ia, p.creado_en,
      COALESCE(p.compartidos_count, 0) AS compartidos_count`

const camposEngagement = async (usuarioId: number): Promise<{ sql: string; extraParams: number[] }> => {
  const conGuardados = await tablaExiste('publicaciones_guardadas')
  if (!conGuardados) {
    return { sql: `FALSE AS guardado_por_mi, FALSE AS leer_despues`, extraParams: [] }
  }
  return {
    sql: `(SELECT COUNT(*) > 0 FROM publicaciones_guardadas g WHERE g.publicacion_id = p.id AND g.usuario_id = ?) AS guardado_por_mi,
      COALESCE((SELECT g2.leer_despues FROM publicaciones_guardadas g2 WHERE g2.publicacion_id = p.id AND g2.usuario_id = ? LIMIT 1), FALSE) AS leer_despues`,
    extraParams: [usuarioId, usuarioId],
  }
}

const camposReacciones = async (usuarioId: number): Promise<{ sql: string; extraParams: number[] }> => {
  const conReacciones = await tablaExiste('reacciones_publicacion')
  if (!conReacciones) {
    return { sql: `0 AS total_reacciones, NULL AS mi_reaccion`, extraParams: [] }
  }
  return {
    sql: `(SELECT COUNT(*) FROM reacciones_publicacion r WHERE r.publicacion_id = p.id) AS total_reacciones,
      (SELECT r2.tipo FROM reacciones_publicacion r2 WHERE r2.publicacion_id = p.id AND r2.usuario_id = ? LIMIT 1) AS mi_reaccion`,
    extraParams: [usuarioId],
  }
}

const consultarPublicaciones = async (
  usuarioId: number,
  whereExtra: string,
  whereParams: unknown[],
  orderBy: string,
  limite: number,
  offset: number
): Promise<PublicacionFila[]> => {
  const engagement = await camposEngagement(usuarioId)
  const reacciones = await camposReacciones(usuarioId)
  const params = [...whereParams, ...engagement.extraParams, ...reacciones.extraParams]

  const [filas] = await pool.query<PublicacionFila[]>(
    `SELECT
      ${CAMPOS_PUBLICACION},
      (SELECT COUNT(*) FROM comentarios c WHERE c.publicacion_id = p.id AND c.eliminado = FALSE) AS total_comentarios,
      ${engagement.sql},
      ${reacciones.sql}
    FROM publicaciones p
    ${whereExtra}
    ORDER BY ${orderBy}
    LIMIT ${limite} OFFSET ${offset}`,
    params
  )
  return filas
}

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

  const filas = await consultarPublicaciones(
    usuarioId,
    whereClause,
    whereParams,
    'p.creado_en DESC',
    limiteNormalizado,
    offset
  )

  return {
    publicaciones: filas.map(mapearPublicacion),
    pagina: paginaNormalizada,
    totalPaginas,
  }
}

export const obtenerPublicacionPorId = async (id: number, usuarioId: number): Promise<Publicacion> => {
  const filas = await consultarPublicaciones(usuarioId, 'WHERE p.id = ?', [id], 'p.id ASC', 1, 0)
  if (filas.length === 0) throw new ErrorHttp('Publicación no encontrada', 404)
  return mapearPublicacion(filas[0])
}

export const obtenerPublicacionPorSlug = async (slug: string, usuarioId: number): Promise<Publicacion> => {
  const filas = await consultarPublicaciones(
    usuarioId,
    'WHERE p.slug = ? OR (p.slug IS NULL AND CONCAT(\'noticia-\', p.id) = ?)',
    [slug, slug],
    'p.id ASC',
    1,
    0
  )
  if (filas.length === 0) throw new ErrorHttp('Publicación no encontrada', 404)
  return mapearPublicacion(filas[0])
}

export const obtenerFeedGuardados = async (
  usuarioId: number,
  pagina: number,
  limite: number,
  soloLeerDespues = false
): Promise<RespuestaFeed & { total: number }> => {
  if (!(await tablaExiste('publicaciones_guardadas'))) {
    return { publicaciones: [], pagina: 1, totalPaginas: 1, total: 0 }
  }

  const paginaN = Math.max(1, pagina)
  const limiteN = Math.min(50, Math.max(1, limite))
  const offset = (paginaN - 1) * limiteN
  const filtroLeer = soloLeerDespues ? 'AND g.leer_despues = TRUE' : ''

  const [conteo] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM publicaciones_guardadas g WHERE g.usuario_id = ? ${filtroLeer}`,
    [usuarioId]
  )
  const total = Number(conteo[0]?.total ?? 0)
  const totalPaginas = Math.max(1, Math.ceil(total / limiteN))

  const reacciones = await camposReacciones(usuarioId)

  const [filas] = await pool.query<PublicacionFila[]>(
    `SELECT
      ${CAMPOS_PUBLICACION},
      (SELECT COUNT(*) FROM comentarios c WHERE c.publicacion_id = p.id AND c.eliminado = FALSE) AS total_comentarios,
      TRUE AS guardado_por_mi,
      g.leer_despues AS leer_despues,
      ${reacciones.sql}
    FROM publicaciones_guardadas g
    INNER JOIN publicaciones p ON p.id = g.publicacion_id
    WHERE g.usuario_id = ? ${filtroLeer}
    ORDER BY g.creado_en DESC
    LIMIT ${limiteN} OFFSET ${offset}`,
    [usuarioId, ...reacciones.extraParams]
  )

  return {
    publicaciones: filas.map(mapearPublicacion),
    pagina: paginaN,
    totalPaginas,
    total,
  }
}
