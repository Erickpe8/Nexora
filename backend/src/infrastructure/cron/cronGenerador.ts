import cron from 'node-cron'
import { ejecutarCicloOrquestadorGeneracionIA } from '../../services/orquestadorGeneracionIA.servicio'
import { registrarLogGeneracion } from '../observability/registroGeneracionIA'
import { registro } from '../../shared/logger/registro'

const CONTEXTO = 'CronGenerador'

let enEjecucion = false
let fallosConsecutivos = 0

const ejecutarCicloGeneracion = async (): Promise<void> => {
  if (enEjecucion) {
    registro.advertencia(CONTEXTO, 'Ciclo anterior aún en ejecución — omitiendo solapamiento')
    return
  }

  enEjecucion = true

  try {
    const resultado = await ejecutarCicloOrquestadorGeneracionIA()

    if (resultado.guardadas > 0) {
      fallosConsecutivos = 0
    } else if (resultado.errores.length > 0) {
      fallosConsecutivos += 1
    }

    registrarLogGeneracion({
      ejecucionId: resultado.ejecucionId,
      timestamp: new Date().toISOString(),
      publicacionesIntentadas: resultado.intentadas,
      publicacionesGuardadas: resultado.guardadas,
      publicacionesDescartadas: resultado.descartadas,
      errores: resultado.errores,
      duracionMs: resultado.duracionMs,
    })

    if (fallosConsecutivos >= 3) {
      registro.error(CONTEXTO, new Error('3 ciclos consecutivos fallaron completamente'), {
        fallosConsecutivos,
      })
    }
  } finally {
    enEjecucion = false
  }
}

export const iniciarCronGenerador = (): void => {
  cron.schedule('0 * * * *', () => {
    void ejecutarCicloGeneracion()
  })
  registro.info(CONTEXTO, 'Cron de generación IA iniciado — ejecución cada hora en punto')
}
