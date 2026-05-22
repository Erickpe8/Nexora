import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../../../shared/database/pool'
import { ejecutarTrabajoCron } from '../jobs/ejecutorTrabajos'
import type {
  EstadoTrabajoCola,
  PayloadGenerarNoticias,
  RespuestaEncolarTrabajo,
  TipoTrabajoCron,
} from '../types'

interface TrabajoFila extends RowDataPacket {
  id: number
  tipo: string
  payload: string | Record<string, unknown> | null
  estado: EstadoTrabajoCola
  intentos: number
  max_intentos: number
  error_mensaje: string | null
  creado_en: string
  procesado_en: string | null
}

const parsearPayload = (raw: string | Record<string, unknown> | null): Record<string, unknown> => {
  if (!raw) return {}
  if (typeof raw === 'object') return raw
  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return {}
  }
}

const existeTrabajoPendiente = async (tipo: TipoTrabajoCron): Promise<boolean> => {
  const [filas] = await pool.execute<RowDataPacket[]>(
    `SELECT id FROM cola_trabajos WHERE tipo = ? AND estado IN ('pendiente','procesando') LIMIT 1`,
    [tipo]
  )
  return filas.length > 0
}

export const encolarTrabajo = async (
  tipo: TipoTrabajoCron,
  payload: Record<string, unknown> = {},
  maxIntentos = 3,
  evitarDuplicados = false
): Promise<RespuestaEncolarTrabajo> => {
  if (evitarDuplicados && (await existeTrabajoPendiente(tipo))) {
    const [filas] = await pool.execute<RowDataPacket[]>(
      `SELECT id FROM cola_trabajos WHERE tipo = ? AND estado IN ('pendiente','procesando') ORDER BY creado_en ASC LIMIT 1`,
      [tipo]
    )
    const id = Number(filas[0]?.id ?? 0)
    return {
      jobId: id,
      tipo,
      estado: 'pendiente',
      encoladoEn: new Date().toISOString(),
    }
  }

  const [resultado] = await pool.execute<ResultSetHeader>(
    `INSERT INTO cola_trabajos (tipo, payload, estado, max_intentos) VALUES (?, ?, 'pendiente', ?)`,
    [tipo, JSON.stringify(payload), maxIntentos]
  )
  return {
    jobId: resultado.insertId,
    tipo,
    estado: 'pendiente',
    encoladoEn: new Date().toISOString(),
  }
}

const marcarEstadoTrabajo = async (
  id: number,
  estado: EstadoTrabajoCola,
  errorMensaje?: string
): Promise<void> => {
  await pool.execute(
    `UPDATE cola_trabajos
     SET estado = ?,
         error_mensaje = ?,
         procesado_en = CASE WHEN ? IN ('completado','fallido') THEN NOW() ELSE procesado_en END
     WHERE id = ?`,
    [estado, errorMensaje ?? null, estado, id]
  )
}

const reintentarTrabajo = async (
  id: number,
  intentosActuales: number,
  maxIntentos: number,
  errorMensaje: string
): Promise<void> => {
  const fallido = intentosActuales + 1 >= maxIntentos
  await pool.execute(
    `UPDATE cola_trabajos
     SET estado = ?, intentos = intentos + 1, error_mensaje = ?, procesado_en = NOW()
     WHERE id = ?`,
    [fallido ? 'fallido' : 'pendiente', errorMensaje, id]
  )
}

export const obtenerSiguienteTrabajoPendiente = async (): Promise<TrabajoFila | null> => {
  const [filas] = await pool.execute<TrabajoFila[]>(
    `SELECT * FROM cola_trabajos
     WHERE (
       estado = 'pendiente'
       OR (estado = 'procesando' AND creado_en < DATE_SUB(NOW(), INTERVAL 15 MINUTE))
     ) AND intentos < max_intentos
     ORDER BY creado_en ASC
     LIMIT 1`
  )
  return filas[0] ?? null
}

export const procesarColaTrabajos = async (
  origen: string,
  maxTrabajos = 1
): Promise<{
  procesados: number
  resultados: Array<{
    jobId: number
    tipo: TipoTrabajoCron
    exito: boolean
    mensaje: string
    detalle?: Record<string, unknown>
  }>
}> => {
  const resultados: Array<{
    jobId: number
    tipo: TipoTrabajoCron
    exito: boolean
    mensaje: string
    detalle?: Record<string, unknown>
  }> = []
  let procesados = 0

  for (let i = 0; i < maxTrabajos; i++) {
    const trabajo = await obtenerSiguienteTrabajoPendiente()
    if (!trabajo) break

    await marcarEstadoTrabajo(trabajo.id, 'procesando')
    const tipo = trabajo.tipo as TipoTrabajoCron
    const payload = parsearPayload(trabajo.payload)

    try {
      const detalle = await ejecutarTrabajoCron(tipo, origen, payload)
      await marcarEstadoTrabajo(trabajo.id, 'completado')
      resultados.push({ jobId: trabajo.id, tipo, exito: true, mensaje: 'OK', detalle })
      procesados++
    } catch (error) {
      const msg = (error as Error).message
      await reintentarTrabajo(trabajo.id, trabajo.intentos, trabajo.max_intentos, msg)
      resultados.push({ jobId: trabajo.id, tipo, exito: false, mensaje: msg })
      procesados++
    }
  }

  return { procesados, resultados }
}

export const encolarGenerarNoticias = async (cantidad = 4): Promise<RespuestaEncolarTrabajo> => {
  const payload: PayloadGenerarNoticias = { cantidad }
  return encolarTrabajo('generar_noticias_ia', payload as Record<string, unknown>, 3, true)
}
