import { Request, Response, NextFunction } from 'express'
import { ejecutarCicloGeneracionIA } from '../infrastructure/cron/cronGenerador'
import {
  debeSembrarEnEsteEntorno,
  marcarDespliegueSembrado,
  obtenerIdDespliegueActual,
  obtenerUltimoDespliegueSembrado,
} from '../services/semillaDespliegue.servicio'
import { registro } from '../shared/logger/registro'

const CONTEXTO = 'SemillaDespliegue'

let semillaEnCurso = false
/** Evita repetir en la misma instancia serverless si aún no existe estado_sistema en MySQL. */
const sembradosEnInstancia = new Set<string>()

/**
 * Tras cada deploy en Vercel producción, la primera petición al API dispara 4 publicaciones IA.
 */
export const middlewareSemillaDespliegue = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!debeSembrarEnEsteEntorno() || semillaEnCurso) {
    next()
    return
  }

  const deploymentId = obtenerIdDespliegueActual()
  if (!deploymentId) {
    next()
    return
  }

  void (async () => {
    try {
      if (sembradosEnInstancia.has(deploymentId)) return

      const ultimo = await obtenerUltimoDespliegueSembrado()
      if (ultimo === deploymentId) {
        sembradosEnInstancia.add(deploymentId)
        return
      }

      semillaEnCurso = true
      sembradosEnInstancia.add(deploymentId)
      registro.info(CONTEXTO, 'Nuevo despliegue detectado — generando 4 publicaciones iniciales', {
        deploymentId,
      })

      await ejecutarCicloGeneracionIA()
      await marcarDespliegueSembrado(deploymentId)

      registro.info(CONTEXTO, 'Semilla de despliegue completada', { deploymentId })
    } catch (error) {
      registro.error(CONTEXTO, error, { deploymentId })
    } finally {
      semillaEnCurso = false
    }
  })()

  next()
}
