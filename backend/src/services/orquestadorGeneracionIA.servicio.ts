import { randomUUID } from 'crypto'
import { io } from '../infrastructure/sockets/socket'
import { generarPublicacionesIA } from './deepseek.servicio'
import { procesarLotePublicacionesIA } from './publicacionesIA.servicio'
import type { ResultadoCicloOrquestadorIA } from '../types'

const cantidadSolicitadaPorCiclo = 4

/**
 * Ejecuta un ciclo: generar con DeepSeek → validar y persistir → emitir Socket solo si hay filas guardadas.
 * Invariante: `nuevas_publicaciones` solo después de inserts confirmados en `procesarLotePublicacionesIA`.
 */
export const ejecutarCicloOrquestadorGeneracionIA = async (): Promise<ResultadoCicloOrquestadorIA> => {
  const ejecucionId = randomUUID()
  const inicio = Date.now()
  const errores: string[] = []
  let intentadas = 0
  let guardadas = 0
  let descartadas = 0

  try {
    const lote = await generarPublicacionesIA(cantidadSolicitadaPorCiclo)
    intentadas = lote.length
    const resultado = await procesarLotePublicacionesIA(lote)
    guardadas = resultado.guardadas
    descartadas = resultado.descartadas
    errores.push(...resultado.errores)

    if (resultado.publicaciones.length > 0) {
      io.to('feed_global').emit('nuevas_publicaciones', {
        cantidad: resultado.publicaciones.length,
        publicaciones: resultado.publicaciones,
      })
    }
  } catch (error) {
    errores.push((error as Error).message)
  }

  return {
    ejecucionId,
    intentadas,
    guardadas,
    descartadas,
    errores,
    duracionMs: Date.now() - inicio,
  }
}
