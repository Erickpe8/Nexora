import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../../../shared/database/pool'
import type { RespuestaCronBase, TipoTrabajoCron } from '../types'

interface EjecucionFila extends RowDataPacket {
  id: number
  tipo: string
  origen: string
  exito: number
  duracion_ms: number
  mensaje: string
  detalle: string | null
  creado_en: string
}

export const registrarEjecucionCron = async (
  tipo: TipoTrabajoCron,
  origen: string,
  exito: boolean,
  duracionMs: number,
  mensaje: string,
  detalle?: Record<string, unknown>
): Promise<string> => {
  const [resultado] = await pool.execute<ResultSetHeader>(
    `INSERT INTO cron_ejecuciones (tipo, origen, exito, duracion_ms, mensaje, detalle)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      tipo,
      origen,
      exito,
      duracionMs,
      mensaje.slice(0, 500),
      detalle ? JSON.stringify(detalle) : null,
    ]
  )
  return String(resultado.insertId)
}

export const listarEjecucionesRecientes = async (
  limite = 20,
  tipo?: TipoTrabajoCron
): Promise<EjecucionFila[]> => {
  const lim = Math.min(100, Math.max(1, limite))
  if (tipo) {
    const [filas] = await pool.query<EjecucionFila[]>(
      `SELECT * FROM cron_ejecuciones WHERE tipo = ? ORDER BY creado_en DESC LIMIT ${lim}`,
      [tipo]
    )
    return filas
  }
  const [filas] = await pool.query<EjecucionFila[]>(
    `SELECT * FROM cron_ejecuciones ORDER BY creado_en DESC LIMIT ${lim}`
  )
  return filas
}

export const envolverEjecucionCron = async (
  tipo: TipoTrabajoCron,
  origen: string,
  fn: () => Promise<Record<string, unknown>>
): Promise<RespuestaCronBase> => {
  const inicio = Date.now()
  const ejecucionId = `tmp-${Date.now()}`
  try {
    const detalle = await fn()
    const duracionMs = Date.now() - inicio
    const id = await registrarEjecucionCron(
      tipo,
      origen,
      true,
      duracionMs,
      'Completado correctamente',
      detalle
    )
    return {
      ejecucionId: id,
      tipo,
      exito: true,
      duracionMs,
      mensaje: 'Completado correctamente',
      detalle,
    }
  } catch (error) {
    const duracionMs = Date.now() - inicio
    const mensaje = (error as Error).message
    const id = await registrarEjecucionCron(tipo, origen, false, duracionMs, mensaje)
    return {
      ejecucionId: id,
      tipo,
      exito: false,
      duracionMs,
      mensaje,
    }
  }
}
