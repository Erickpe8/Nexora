import { randomUUID } from 'crypto'
import { io } from '../infrastructure/sockets/socket'
import { generarPublicacionesIA } from './deepseek.servicio'
import { procesarLotePublicacionesIA } from './publicacionesIA.servicio'
import { guardarRegistroGeneracion } from './registrosGeneracionIA.servicio'
import { registro } from '../shared/logger/registro'
import type { ResultadoCicloOrquestadorIA } from '../types'

const CONTEXTO = 'OrquestadorIA'
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

  registro.info(CONTEXTO, 'Iniciando ciclo de generación IA', { ejecucionId, cantidad: cantidadSolicitadaPorCiclo })

  try {
    const lote = await generarPublicacionesIA(cantidadSolicitadaPorCiclo)
    intentadas = lote.length

    registro.info(CONTEXTO, `Lote recibido de DeepSeek`, { ejecucionId, intentadas })

    const resultado = await procesarLotePublicacionesIA(lote, ejecucionId)
    guardadas = resultado.guardadas
    descartadas = resultado.descartadas
    errores.push(...resultado.errores)

    // Invariante: emitir SOLO si hay publicaciones realmente persistidas
    if (resultado.publicaciones.length > 0) {
      io.to('feed_global').emit('nuevas_publicaciones', {
        cantidad: resultado.publicaciones.length,
        publicaciones: resultado.publicaciones,
      })
      registro.info(CONTEXTO, 'Evento nuevas_publicaciones emitido', {
        ejecucionId,
        cantidad: resultado.publicaciones.length,
      })
    } else {
      registro.advertencia(CONTEXTO, 'Ciclo sin publicaciones nuevas para emitir', { ejecucionId })
    }
  } catch (error) {
    const mensaje = (error as Error).message
    errores.push(mensaje)

    // Categorizar el error de DeepSeek para observabilidad
    const categoriaError = categorizarErrorDeepSeek(error)
    registro.error(CONTEXTO, error, { ejecucionId, categoriaError })

    // Guardar registro de fallo global
    await guardarRegistroGeneracion({
      ejecucionId,
      publicacionId: null,
      duracionMs: Date.now() - inicio,
      exito: false,
      mensajeError: mensaje,
    }).catch(() => undefined) // no bloquear si falla el log
  }

  const duracionMs = Date.now() - inicio

  registro.info(CONTEXTO, 'Ciclo finalizado', {
    ejecucionId,
    intentadas,
    guardadas,
    descartadas,
    errores: errores.length,
    duracionMs,
  })

  return { ejecucionId, intentadas, guardadas, descartadas, errores, duracionMs }
}

/** Categoriza errores de DeepSeek para métricas de observabilidad. */
const categorizarErrorDeepSeek = (error: unknown): string => {
  if (!(error instanceof Error)) return 'desconocido'
  const msg = error.message.toLowerCase()
  if (msg.includes('timeout') || msg.includes('econnrefused') || msg.includes('network')) return 'red'
  if (msg.includes('parsear') || msg.includes('json') || msg.includes('parse')) return 'parseo'
  if (msg.includes('401') || msg.includes('403') || msg.includes('api key')) return '4xx_auth'
  if (msg.includes('429') || msg.includes('rate limit')) return '4xx_rate_limit'
  if (msg.includes('5') && msg.includes('00')) return '5xx_proveedor'
  return 'otro'
}
