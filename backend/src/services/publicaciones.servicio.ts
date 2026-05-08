import type { RowDataPacket } from 'mysql2/promise'
import { pool } from '../config/baseDatos'
import { ErrorHttp } from '../middlewares/errores'
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
})

export const obtenerFeedPaginado = async (pagina: number, limite: number): Promise<RespuestaFeed> => {
  const paginaNormalizada = Number.isNaN(pagina) || pagina < 1 ? 1 : pagina
  const limiteNormalizado = Number.isNaN(limite) || limite < 1 ? 10 : Math.min(limite, 50)
  const offset = (paginaNormalizada - 1) * limiteNormalizado

  const [conteo] = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) AS total FROM publicaciones')
  const total = Number(conteo[0]?.total ?? 0)
  const totalPaginas = Math.max(1, Math.ceil(total / limiteNormalizado))

  const [filas] = await pool.query<PublicacionFila[]>(
    `SELECT
      p.id, p.titulo, p.resumen, p.pregunta, p.etiquetas, p.generado_por_ia, p.creado_en,
      (SELECT COUNT(*) FROM comentarios c WHERE c.publicacion_id = p.id) AS total_comentarios
    FROM publicaciones p
    ORDER BY p.creado_en DESC
    LIMIT ${limiteNormalizado} OFFSET ${offset}`
  )

  return {
    publicaciones: filas.map(mapearPublicacion),
    pagina: paginaNormalizada,
    totalPaginas,
  }
}

export const obtenerPublicacionPorId = async (id: number): Promise<Publicacion> => {
  const [filas] = await pool.execute<PublicacionFila[]>(
    `SELECT
      p.id, p.titulo, p.resumen, p.pregunta, p.etiquetas, p.generado_por_ia, p.creado_en,
      (SELECT COUNT(*) FROM comentarios c WHERE c.publicacion_id = p.id) AS total_comentarios
    FROM publicaciones p
    WHERE p.id = ?
    LIMIT 1`,
    [id]
  )

  if (filas.length === 0) {
    throw new ErrorHttp('Publicación no encontrada', 404)
  }

  return mapearPublicacion(filas[0])
}
