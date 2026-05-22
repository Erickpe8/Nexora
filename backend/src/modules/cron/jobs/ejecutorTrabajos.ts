import { ejecutarCicloOrquestadorGeneracionIA } from '../../../services/orquestadorGeneracionIA.servicio'
import { pool } from '../../../shared/database/pool'
import { tablaExiste } from '../../../shared/database/esquema'
import type { RowDataPacket } from 'mysql2/promise'
import { envolverEjecucionCron } from '../services/cronEjecuciones.servicio'
import { procesarColaTrabajos } from '../services/colaTrabajos.servicio'
import type { TipoTrabajoCron } from '../types'

const cantidadDesdePayload = (payload: Record<string, unknown>): number => {
  const n = Number(payload.cantidad)
  return Number.isFinite(n) && n >= 1 && n <= 10 ? Math.floor(n) : 4
}

export const ejecutarTrabajoCron = async (
  tipo: TipoTrabajoCron,
  origen: string,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  switch (tipo) {
    case 'generar_noticias_ia': {
      const resultado = await ejecutarCicloOrquestadorGeneracionIA()
      return { ...resultado, cantidadSolicitada: cantidadDesdePayload(payload) }
    }
    case 'actualizar_tendencias':
      return ejecutarActualizarTendencias()
    case 'limpiar_cache':
      return ejecutarLimpiarCache()
    case 'actualizar_metricas':
      return ejecutarActualizarMetricas()
    case 'procesar_recomendaciones':
      return { procesadas: 0, mensaje: 'Recomendaciones: pendiente de implementación v2' }
    case 'reentrenar_tendencias':
      return { mensaje: 'Reentrenamiento: pendiente de pipeline ML v2' }
    case 'revisar_contenido_reportado':
      return ejecutarRevisarContenidoReportado()
    case 'procesar_cola': {
      const max = Math.min(5, Math.max(1, Number(payload.maxTrabajos) || 1))
      return procesarColaTrabajos(origen, max)
    }
    default:
      throw new Error(`Tipo de trabajo desconocido: ${tipo}`)
  }
}

/** Ejecuta con registro en cron_ejecuciones (modo síncrono desde HTTP). */
export const ejecutarTrabajoCronConRegistro = async (
  tipo: TipoTrabajoCron,
  origen: string,
  payload: Record<string, unknown>
) => envolverEjecucionCron(tipo, origen, () => ejecutarTrabajoCron(tipo, origen, payload))

async function ejecutarActualizarTendencias(): Promise<Record<string, unknown>> {
  const conReacciones = await tablaExiste('reacciones_publicacion')
  const bonusReacciones = conReacciones
    ? `+ (SELECT COUNT(*) FROM reacciones_publicacion r WHERE r.publicacion_id = p.id)`
    : ''
  const [resultado] = await pool.execute(
    `UPDATE publicaciones p
     SET relevancia = LEAST(100, GREATEST(
       COALESCE(p.relevancia, 0),
       (SELECT COUNT(*) FROM comentarios c WHERE c.publicacion_id = p.id AND c.eliminado = FALSE) * 3
       ${bonusReacciones}
     ))
     WHERE p.creado_en >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
  )
  return { filasActualizadas: (resultado as { affectedRows?: number }).affectedRows ?? 0 }
}

async function ejecutarLimpiarCache(): Promise<Record<string, unknown>> {
  const [registros] = await pool.execute(
    `DELETE FROM registros_generacion_ia WHERE creado_en < DATE_SUB(NOW(), INTERVAL 90 DAY)`
  )
  const [trabajos] = await pool.execute(
    `DELETE FROM cola_trabajos
     WHERE estado IN ('completado','fallido') AND procesado_en < DATE_SUB(NOW(), INTERVAL 30 DAY)`
  )
  return {
    registrosIaEliminados: (registros as { affectedRows?: number }).affectedRows ?? 0,
    trabajosColaEliminados: (trabajos as { affectedRows?: number }).affectedRows ?? 0,
  }
}

async function ejecutarActualizarMetricas(): Promise<Record<string, unknown>> {
  const [filas] = await pool.execute<RowDataPacket[]>(
    `SELECT
      (SELECT COUNT(*) FROM publicaciones) AS publicaciones,
      (SELECT COUNT(*) FROM comentarios WHERE eliminado = FALSE) AS comentarios,
      (SELECT COUNT(*) FROM denuncias WHERE estado = 'pendiente') AS denuncias_pendientes,
      (SELECT COUNT(*) FROM cola_trabajos WHERE estado = 'pendiente') AS cola_pendiente`
  )
  return { metricas: filas[0] ?? {} }
}

async function ejecutarRevisarContenidoReportado(): Promise<Record<string, unknown>> {
  const [filas] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM denuncias WHERE estado = 'pendiente'`
  )
  return {
    denunciasPendientes: Number(filas[0]?.total ?? 0),
    mensaje: 'Revisión humana vía panel moderador; auto-ocultar activo por umbral',
  }
}
