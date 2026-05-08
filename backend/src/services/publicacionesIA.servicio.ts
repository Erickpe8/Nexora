import type { ResultSetHeader } from 'mysql2/promise'
import { pool } from '../config/baseDatos'
import type { Publicacion, PublicacionIA, ResultadoGeneracion } from '../types'
import { obtenerPublicacionPorId } from './publicaciones.servicio'

const sanitizarTexto = (valor: string): string => {
  return valor
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
}

const contarPalabras = (texto: string): number => texto.split(/\s+/).filter(Boolean).length

const validarPublicacion = (publicacion: PublicacionIA): string | null => {
  if (!publicacion.titulo || publicacion.titulo.trim().length > 100) return 'Título inválido'
  if (!publicacion.resumen || contarPalabras(publicacion.resumen) > 300) return 'Resumen inválido'
  if (!publicacion.pregunta || publicacion.pregunta.trim().length === 0) return 'Pregunta inválida'
  if (!Array.isArray(publicacion.etiquetas) || publicacion.etiquetas.length < 1 || publicacion.etiquetas.length > 3) {
    return 'Etiquetas inválidas'
  }
  return null
}

const existeTitulo = async (titulo: string): Promise<boolean> => {
  const [filas] = await pool.execute<any[]>('SELECT id FROM publicaciones WHERE titulo = ? LIMIT 1', [titulo])
  return filas.length > 0
}

export const procesarLotePublicacionesIA = async (publicacionesIA: PublicacionIA[]): Promise<ResultadoGeneracion> => {
  const errores: string[] = []
  const publicaciones: Publicacion[] = []
  let guardadas = 0
  let descartadas = 0

  for (const item of publicacionesIA) {
    const sanitizada: PublicacionIA = {
      titulo: sanitizarTexto(item.titulo || '').slice(0, 100),
      resumen: sanitizarTexto(item.resumen || '').slice(0, 2000),
      pregunta: sanitizarTexto(item.pregunta || '').slice(0, 500),
      etiquetas: Array.isArray(item.etiquetas) ? item.etiquetas.slice(0, 3).map(et => sanitizarTexto(et)) : [],
    }

    const errorValidacion = validarPublicacion(sanitizada)
    if (errorValidacion) {
      descartadas += 1
      errores.push(errorValidacion)
      continue
    }

    if (await existeTitulo(sanitizada.titulo)) {
      descartadas += 1
      errores.push(`Duplicado detectado: ${sanitizada.titulo}`)
      continue
    }

    try {
      const [resultado] = await pool.execute<ResultSetHeader>(
        `INSERT INTO publicaciones (titulo, resumen, pregunta, etiquetas, generado_por_ia)
         VALUES (?, ?, ?, ?, TRUE)`,
        [sanitizada.titulo, sanitizada.resumen, sanitizada.pregunta, JSON.stringify(sanitizada.etiquetas)]
      )
      guardadas += 1
      publicaciones.push(await obtenerPublicacionPorId(resultado.insertId))
    } catch (error) {
      descartadas += 1
      errores.push(`Error al guardar publicación: ${(error as Error).message}`)
    }
  }

  return { guardadas, descartadas, errores, publicaciones }
}
