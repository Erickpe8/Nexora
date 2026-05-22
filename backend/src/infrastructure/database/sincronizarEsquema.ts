/**
 * Sincroniza el esquema MySQL (crear tablas + migraciones incrementales).
 * Se ejecuta en build de Vercel y en el primer request serverless.
 */
import type { RowDataPacket } from 'mysql2/promise'
import { pool } from '../../shared/database/pool'
import { crearTodasLasTablas } from './crearTablas'
import { ejecutarMigracionesIncremental, ESQUEMA_VERSION } from './migrarTablas'

const CLAVE_VERSION = 'esquema_version'
const LOCK_NOMBRE = 'nexora_esquema_sync'

const logOpcional = (habilitado: boolean, msg: string): void => {
  if (habilitado) console.log(msg)
}

const tieneConfigBd = (): boolean =>
  Boolean(
    process.env.MYSQL_URL?.startsWith('mysql://') ||
      process.env.DATABASE_URL?.startsWith('mysql://') ||
      process.env.DB_HOST
  )

const tablaUsuariosExiste = async (): Promise<boolean> => {
  const [filas] = await pool.query<RowDataPacket[]>(`SHOW TABLES LIKE 'usuarios'`)
  return filas.length > 0
}

const leerVersionEsquema = async (): Promise<string | null> => {
  try {
    const [filas] = await pool.query<RowDataPacket[]>(
      'SELECT valor FROM estado_sistema WHERE clave = ? LIMIT 1',
      [CLAVE_VERSION]
    )
    return filas.length ? String(filas[0].valor) : null
  } catch {
    return null
  }
}

const marcarVersionEsquema = async (): Promise<void> => {
  await pool.execute(
    `INSERT INTO estado_sistema (clave, valor) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE valor = VALUES(valor), actualizado_en = NOW()`,
    [CLAVE_VERSION, ESQUEMA_VERSION]
  )
}

const esperarVersionEnOtroProceso = async (): Promise<void> => {
  for (let i = 0; i < 45; i += 1) {
    if ((await leerVersionEsquema()) === ESQUEMA_VERSION) return
    await new Promise<void>(r => {
      setTimeout(r, 2000)
    })
  }
  throw new Error('Timeout esperando sincronización de esquema en otro proceso')
}

/** Idempotente; seguro en cada deploy y en cold start de Vercel. */
export const sincronizarEsquema = async (opciones?: { log?: boolean }): Promise<void> => {
  if (!tieneConfigBd()) return

  const log = opciones?.log ?? false

  if ((await leerVersionEsquema()) === ESQUEMA_VERSION) {
    logOpcional(log, `⏭  Esquema ya en ${ESQUEMA_VERSION}`)
    return
  }

  const [lockFilas] = await pool.query<RowDataPacket[]>(
    `SELECT GET_LOCK(?, 120) AS adquirido`,
    [LOCK_NOMBRE]
  )
  const adquirido = Number(lockFilas[0]?.adquirido) === 1

  if (!adquirido) {
    logOpcional(log, '⏳ Otra instancia está migrando el esquema…')
    await esperarVersionEnOtroProceso()
    return
  }

  try {
    if ((await leerVersionEsquema()) === ESQUEMA_VERSION) return

    if (!(await tablaUsuariosExiste())) {
      logOpcional(log, '📦 BD sin tablas base — creando…')
      await crearTodasLasTablas({ log })
    }

    logOpcional(log, '🔧 Aplicando migraciones incrementales…')
    await ejecutarMigracionesIncremental({ log })

    await marcarVersionEsquema()
    logOpcional(log, `✅ Esquema sincronizado (${ESQUEMA_VERSION})`)
  } finally {
    await pool.query(`SELECT RELEASE_LOCK(?)`, [LOCK_NOMBRE])
  }
}

const esCli = require.main === module || process.argv[1]?.includes('sincronizarEsquema')

if (esCli) {
  void sincronizarEsquema({ log: true })
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ sincronizarEsquema:', err)
      process.exit(1)
    })
}
