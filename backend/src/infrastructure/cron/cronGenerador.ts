import cron from 'node-cron'
import { ejecutarCicloOrquestadorGeneracionIA } from '../../services/orquestadorGeneracionIA.servicio'
import { registrarLogGeneracion } from '../observability/registroGeneracionIA'

let enEjecucion = false
let fallosConsecutivos = 0

const ejecutarCicloGeneracion = async (): Promise<void> => {
  if (enEjecucion) {
    return
  }

  enEjecucion = true

  try {
    const resultado = await ejecutarCicloOrquestadorGeneracionIA()

    if (resultado.guardadas > 0) {
      fallosConsecutivos = 0
    } else if (resultado.guardadas === 0 && resultado.intentadas > 0) {
      fallosConsecutivos += 1
    } else if (resultado.guardadas === 0 && resultado.intentadas === 0 && resultado.errores.length > 0) {
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
      console.error('⚠️ IA: 3 ciclos consecutivos fallaron completamente')
    }
  } finally {
    enEjecucion = false
  }
}

export const iniciarCronGenerador = (): void => {
  cron.schedule('0 * * * *', () => {
    void ejecutarCicloGeneracion()
  })
}
