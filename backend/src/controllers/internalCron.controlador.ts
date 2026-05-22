import { Request, Response, NextFunction } from 'express'
import {
  encolarGenerarNoticias,
  encolarTrabajo,
  procesarColaTrabajos,
} from '../modules/cron/services/colaTrabajos.servicio'
import { ejecutarTrabajoCronConRegistro } from '../modules/cron/jobs/ejecutorTrabajos'
import { listarEjecucionesRecientes } from '../modules/cron/services/cronEjecuciones.servicio'
import type { TipoTrabajoCron } from '../modules/cron/types'

const origenDesdeRequest = (req: Request): string =>
  (req.headers['x-cron-origen'] as string | undefined)?.trim() || 'desconocido'

const modoDesdeQuery = (req: Request): 'encolar' | 'ejecutar' =>
  req.query.modo === 'encolar' ? 'encolar' : 'ejecutar'

const payloadDesdeBody = (req: Request): Record<string, unknown> => {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    return req.body as Record<string, unknown>
  }
  return {}
}

const manejarTrabajo =
  (tipo: TipoTrabajoCron) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const origen = origenDesdeRequest(req)
      const modo = modoDesdeQuery(req)
      const payload = payloadDesdeBody(req)

      if (modo === 'encolar') {
        const encolado = await encolarTrabajo(tipo, payload)
        res.status(202).json({
          datos: encolado,
          mensaje: 'Trabajo encolado. Procesar con POST /api/internal/cron/process-queue',
        })
        return
      }

      const resultado = await ejecutarTrabajoCronConRegistro(tipo, origen, payload)
      res.status(resultado.exito ? 200 : 500).json({ datos: resultado })
    } catch (error) {
      next(error)
    }
  }

export const controladorGenerateNews = manejarTrabajo('generar_noticias_ia')
export const controladorUpdateTrends = manejarTrabajo('actualizar_tendencias')
export const controladorCleanupCache = manejarTrabajo('limpiar_cache')
export const controladorUpdateMetrics = manejarTrabajo('actualizar_metricas')
export const controladorProcessRecommendations = manejarTrabajo('procesar_recomendaciones')
export const controladorRetrainTrends = manejarTrabajo('reentrenar_tendencias')
export const controladorReviewReported = manejarTrabajo('revisar_contenido_reportado')

/** Procesa trabajos pendientes en cola_trabajos (invocar cada 5 min desde GitHub Actions). */
export const controladorProcessQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const origen = origenDesdeRequest(req)
    const maxTrabajos = Math.min(5, Math.max(1, Number(req.query.max) || 1))
    const resultado = await ejecutarTrabajoCronConRegistro('procesar_cola', origen, {
      maxTrabajos,
    })
    res.status(resultado.exito ? 200 : 500).json({ datos: resultado })
  } catch (error) {
    next(error)
  }
}

/** Atajo: encolar generación IA (modo encolar por defecto). */
export const controladorGenerateNewsEnqueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cantidad = Math.min(10, Math.max(1, Number(req.body?.cantidad) || 4))
    const encolado = await encolarGenerarNoticias(cantidad)
    res.status(202).json({ datos: encolado })
  } catch (error) {
    next(error)
  }
}

export const controladorHistorialCron = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limite = Math.min(100, Math.max(1, Number(req.query.limite) || 20))
    const tipo = req.query.tipo as TipoTrabajoCron | undefined
    const filas = await listarEjecucionesRecientes(limite, tipo)
    res.status(200).json({
      datos: filas.map(f => ({
        id: f.id,
        tipo: f.tipo,
        origen: f.origen,
        exito: Boolean(f.exito),
        duracionMs: f.duracion_ms,
        mensaje: f.mensaje,
        detalle: f.detalle ? JSON.parse(String(f.detalle)) : null,
        creadoEn: f.creado_en,
      })),
    })
  } catch (error) {
    next(error)
  }
}
