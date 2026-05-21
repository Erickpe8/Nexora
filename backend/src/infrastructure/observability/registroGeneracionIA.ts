import fs from 'fs'
import path from 'path'
import { registro } from '../../shared/logger/registro'

export interface LogGeneracionIA {
  ejecucionId: string
  timestamp: string
  publicacionesIntentadas: number
  publicacionesGuardadas: number
  publicacionesDescartadas: number
  errores: string[]
  duracionMs: number
}

const rutaLog = path.resolve(process.cwd(), 'logs', 'generacion.log')

const asegurarArchivo = (): void => {
  const carpeta = path.dirname(rutaLog)
  if (!fs.existsSync(carpeta)) {
    fs.mkdirSync(carpeta, { recursive: true })
  }
  if (!fs.existsSync(rutaLog)) {
    fs.writeFileSync(rutaLog, '', 'utf8')
  }
}

export const registrarLogGeneracion = (log: LogGeneracionIA): void => {
  // Persistir en archivo de log rotativo
  try {
    asegurarArchivo()
    fs.appendFileSync(rutaLog, `${JSON.stringify(log)}\n`, 'utf8')
  } catch {
    registro.advertencia('RegistroGeneracionIA', 'No se pudo escribir en logs/generacion.log')
  }

  // Emitir al logger estructurado
  const nivel = log.errores.length > 0 && log.publicacionesGuardadas === 0 ? 'advertencia' : 'info'
  registro[nivel]('GeneracionIA', 'Ciclo completado', {
    ejecucionId: log.ejecucionId,
    intentadas: log.publicacionesIntentadas,
    guardadas: log.publicacionesGuardadas,
    descartadas: log.publicacionesDescartadas,
    errores: log.errores.length,
    duracionMs: log.duracionMs,
  })

  if (log.errores.length > 0) {
    registro.advertencia('GeneracionIA', 'Errores en ciclo', {
      ejecucionId: log.ejecucionId,
      errores: log.errores,
    })
  }
}
