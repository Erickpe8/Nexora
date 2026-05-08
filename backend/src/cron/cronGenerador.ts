import cron from 'node-cron'
import { io } from '../sockets/socket'
import { generarPublicacionesIA } from '../services/deepseek.servicio'
import { procesarLotePublicacionesIA } from '../services/publicacionesIA.servicio'
import { registrarLogGeneracion } from '../utils/loggerGeneracion'

let enEjecucion = false
let fallosConsecutivos = 0

const ejecutarCicloGeneracion = async (): Promise<void> => {
  if (enEjecucion) {
    return
  }

  enEjecucion = true
  const inicio = Date.now()
  const errores: string[] = []
  let intentadas = 0
  let guardadas = 0
  let descartadas = 0

  try {
    const lote = await generarPublicacionesIA(4)
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

    if (guardadas === 0 && intentadas > 0) {
      fallosConsecutivos += 1
    } else {
      fallosConsecutivos = 0
    }
  } catch (error) {
    fallosConsecutivos += 1
    errores.push((error as Error).message)
  } finally {
    registrarLogGeneracion({
      timestamp: new Date().toISOString(),
      publicacionesIntentadas: intentadas,
      publicacionesGuardadas: guardadas,
      publicacionesDescartadas: descartadas,
      errores,
      duracionMs: Date.now() - inicio,
    })
    if (fallosConsecutivos >= 3) {
      console.error('⚠️ IA: 3 ciclos consecutivos fallaron completamente')
    }
    enEjecucion = false
  }
}

export const iniciarCronGenerador = (): void => {
  cron.schedule('0 * * * *', () => {
    void ejecutarCicloGeneracion()
  })
}
