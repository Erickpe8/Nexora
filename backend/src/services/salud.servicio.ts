import { pool } from '../shared/database/pool'

const timeoutMs = 2000

const consultaMysqlConTimeout = async (): Promise<boolean> => {
  const consulta = pool.query('SELECT 1 AS ok')
  const tiempoLimite = new Promise<never>((_, rechazar) => {
    setTimeout(() => rechazar(new Error('timeout_mysql')), timeoutMs)
  })
  try {
    await Promise.race([consulta, tiempoLimite])
    return true
  } catch {
    return false
  }
}

export const obtenerListo = (): { listo: boolean } => ({ listo: true })

export const obtenerVivo = async (): Promise<{ vivo: boolean; mysql: 'ok' | 'error' }> => {
  const ok = await consultaMysqlConTimeout()
  return { vivo: ok, mysql: ok ? 'ok' : 'error' }
}

export interface EstadoSaludCompleto {
  estado: 'ok' | 'degradado'
  version: string
  uptimeSegundos: number
  dependencias: { mysql: 'ok' | 'error' }
}

export const obtenerSaludCompleta = async (versionApi: string): Promise<EstadoSaludCompleto> => {
  const mysqlOk = await consultaMysqlConTimeout()
  return {
    estado: mysqlOk ? 'ok' : 'degradado',
    version: versionApi,
    uptimeSegundos: Math.floor(process.uptime()),
    dependencias: { mysql: mysqlOk ? 'ok' : 'error' },
  }
}
