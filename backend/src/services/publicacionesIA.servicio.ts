import { createHash } from 'crypto'
import type { ResultSetHeader } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import type { Publicacion, PublicacionIA, ResultadoGeneracion } from '../types'
import { obtenerPublicacionPorId } from './publicaciones.servicio'
import { guardarRegistroGeneracion } from './registrosGeneracionIA.servicio'

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

/** Genera un hash SHA-256 del contenido normalizado para deduplicación semántica. */
const generarHashContenido = (pub: PublicacionIA): string => {
  const contenido = `${pub.titulo.toLowerCase().trim()}|${pub.resumen.toLowerCase().trim()}`
  return createHash('sha256').update(contenido).digest('hex')
}

const existeTitulo = async (titulo: string): Promise<boolean> => {
  const [filas] = await pool.execute<any[]>('SELECT id FROM publicaciones WHERE titulo = ? LIMIT 1', [titulo])
  return filas.length > 0
}

const existeHash = async (hash: string): Promise<boolean> => {
  const [filas] = await pool.execute<any[]>(
    'SELECT id FROM publicaciones WHERE hash_contenido = ? LIMIT 1',
    [hash]
  )
  return filas.length > 0
}

export const procesarLotePublicacionesIA = async (
  publicacionesIA: PublicacionIA[],
  ejecucionId: string = 'manual'
): Promise<ResultadoGeneracion> => {
  const errores: string[] = []
  const publicaciones: Publicacion[] = []
  let guardadas = 0
  let descartadas = 0

  for (const item of publicacionesIA) {
    const inicioItem = Date.now()

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
      await guardarRegistroGeneracion({
        ejecucionId,
        publicacionId: null,
        duracionMs: Date.now() - inicioItem,
        exito: false,
        mensajeError: `Validación: ${errorValidacion}`,
      })
      continue
    }

    const hashContenido = generarHashContenido(sanitizada)

    if (await existeTitulo(sanitizada.titulo) || await existeHash(hashContenido)) {
      descartadas += 1
      errores.push(`Duplicado detectado: ${sanitizada.titulo}`)
      continue
    }

    try {
      const [resultado] = await pool.execute<ResultSetHeader>(
        `INSERT INTO publicaciones
          (titulo, resumen, pregunta, etiquetas, generado_por_ia, proveedor_ia, hash_contenido)
         VALUES (?, ?, ?, ?, TRUE, 'deepseek', ?)`,
        [
          sanitizada.titulo,
          sanitizada.resumen,
          sanitizada.pregunta,
          JSON.stringify(sanitizada.etiquetas),
          hashContenido,
        ]
      )
      guardadas += 1
      const publicacion = await obtenerPublicacionPorId(resultado.insertId, 0)
      publicaciones.push(publicacion)

      await guardarRegistroGeneracion({
        ejecucionId,
        publicacionId: resultado.insertId,
        duracionMs: Date.now() - inicioItem,
        exito: true,
      })
    } catch (error) {
      descartadas += 1
      const msg = `Error al guardar publicación: ${(error as Error).message}`
      errores.push(msg)
      await guardarRegistroGeneracion({
        ejecucionId,
        publicacionId: null,
        duracionMs: Date.now() - inicioItem,
        exito: false,
        mensajeError: msg,
      })
    }
  }

  return { guardadas, descartadas, errores, publicaciones }
}
