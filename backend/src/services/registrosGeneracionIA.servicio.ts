import type { ResultSetHeader } from 'mysql2/promise'
import { pool } from '../shared/database/pool'

export interface DatosRegistroGeneracion {
  ejecucionId: string
  publicacionId: number | null
  duracionMs: number
  exito: boolean
  mensajeError?: string | null
  tokens?: number | null
}

/**
 * Persiste un registro de ejecución del pipeline IA en `registros_generacion_ia`.
 * No lanza errores al caller — los fallos de log no deben interrumpir el pipeline.
 */
export const guardarRegistroGeneracion = async (datos: DatosRegistroGeneracion): Promise<void> => {
  try {
    await pool.execute<ResultSetHeader>(
      `INSERT INTO registros_generacion_ia
        (ejecucion_id, publicacion_id, duracion_ms, exito, mensaje_error, tokens)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        datos.ejecucionId,
        datos.publicacionId ?? null,
        datos.duracionMs,
        datos.exito ? 1 : 0,
        datos.mensajeError ?? null,
        datos.tokens ?? null,
      ]
    )
  } catch {
    // Silencioso: el log de observabilidad no debe romper el pipeline
  }
}
