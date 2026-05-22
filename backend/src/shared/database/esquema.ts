import type { RowDataPacket } from 'mysql2/promise'
import { pool } from './pool'

const cache = new Map<string, boolean>()

export const tablaExiste = async (nombreTabla: string): Promise<boolean> => {
  const clave = `tabla:${nombreTabla}`
  if (cache.has(clave)) return cache.get(clave)!

  const [filas] = await pool.execute<RowDataPacket[]>(
    `SELECT 1 AS ok FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name = ? LIMIT 1`,
    [nombreTabla]
  )
  const existe = filas.length > 0
  cache.set(clave, existe)
  return existe
}

export const columnaExiste = async (nombreTabla: string, nombreColumna: string): Promise<boolean> => {
  const clave = `columna:${nombreTabla}.${nombreColumna}`
  if (cache.has(clave)) return cache.get(clave)!

  const [filas] = await pool.execute<RowDataPacket[]>(
    `SELECT 1 AS ok FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ? LIMIT 1`,
    [nombreTabla, nombreColumna]
  )
  const existe = filas.length > 0
  cache.set(clave, existe)
  return existe
}

export const obtenerEstadoEsquemaEntrega = async (): Promise<{
  reaccionesPublicacion: boolean
  likesComentario: boolean
  denuncias: boolean
  moderacionComentarios: boolean
}> => ({
  reaccionesPublicacion: await tablaExiste('reacciones_publicacion'),
  likesComentario: await tablaExiste('likes_comentario'),
  denuncias: await tablaExiste('denuncias'),
  moderacionComentarios: await columnaExiste('comentarios', 'estado_moderacion'),
})
