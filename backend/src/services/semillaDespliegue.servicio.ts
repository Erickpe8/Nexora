import type { RowDataPacket } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import { tablaExiste } from '../shared/database/esquema'

const CLAVE_ULTIMO_DESPLIEGUE = 'ultimo_sembrado_vercel_deployment'

export const debeSembrarEnEsteEntorno = (): boolean =>
  process.env.VERCEL === '1' &&
  process.env.VERCEL_ENV === 'production' &&
  Boolean(process.env.VERCEL_DEPLOYMENT_ID)

export const obtenerIdDespliegueActual = (): string | null =>
  process.env.VERCEL_DEPLOYMENT_ID ?? null

export const obtenerUltimoDespliegueSembrado = async (): Promise<string | null> => {
  if (!(await tablaExiste('estado_sistema'))) return null
  const [filas] = await pool.execute<RowDataPacket[]>(
    'SELECT valor FROM estado_sistema WHERE clave = ? LIMIT 1',
    [CLAVE_ULTIMO_DESPLIEGUE]
  )
  return filas[0]?.valor ? String(filas[0].valor) : null
}

export const marcarDespliegueSembrado = async (deploymentId: string): Promise<void> => {
  if (!(await tablaExiste('estado_sistema'))) return
  await pool.execute(
    `INSERT INTO estado_sistema (clave, valor) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE valor = VALUES(valor), actualizado_en = NOW()`,
    [CLAVE_ULTIMO_DESPLIEGUE, deploymentId]
  )
}
