import fs from 'fs'
import path from 'path'

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
  asegurarArchivo()
  const linea = `${JSON.stringify(log)}\n`
  fs.appendFileSync(rutaLog, linea, 'utf8')
  console.log(
    `🤖 IA | ejecucion=${log.ejecucionId} guardadas=${log.publicacionesGuardadas} descartadas=${log.publicacionesDescartadas} duracion=${log.duracionMs}ms`
  )
  if (log.errores.length > 0) {
    console.warn(`🤖 IA | errores: ${log.errores.join(' | ')}`)
  }
}
