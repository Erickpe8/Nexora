import { createServer } from 'http'
import os from 'os'
import { entorno } from './shared/config/entorno'
import { verificarConexion } from './shared/database/pool'
import { inicializarSocket } from './infrastructure/sockets/socket'
import { iniciarCronGenerador } from './infrastructure/cron/cronGenerador'
import { crearAplicacion } from './app'

const app = crearAplicacion()
const servidorHttp = createServer(app)

const urlsApiRedLocal = (puerto: number): string[] => {
  const salida: string[] = []
  for (const lista of Object.values(os.networkInterfaces())) {
    if (!lista) continue
    for (const info of lista) {
      const familia = String(info.family)
      const esIpv4 = familia === 'IPv4' || familia === '4'
      if (esIpv4 && !info.internal) {
        salida.push(`http://${info.address}:${puerto}/api`)
      }
    }
  }
  return salida
}

const iniciar = async (): Promise<void> => {
  await verificarConexion()

  inicializarSocket(servidorHttp)
  iniciarCronGenerador()

  servidorHttp.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      const p = entorno.puerto
      console.error(`\n❌ El puerto ${p} ya está en uso (otro proceso o otra terminal con npm run dev).`)
      console.error('   Opciones:')
      console.error(`   1) Liberar el puerto (CMD/PowerShell): netstat -ano | findstr :${p}`)
      console.error('      Luego: taskkill /PID <número_de_PID> /F')
      console.error('   2) Cambiar PUERTO en backend/.env y el mismo host:puerto en mobile/.env → EXPO_PUBLIC_API_URL\n')
      process.exit(1)
    }
    console.error('Error del servidor HTTP:', err)
    process.exit(1)
  })

  servidorHttp.listen(entorno.puerto, () => {
    const p = entorno.puerto
    console.log(`🚀 Servidor Nexora corriendo en http://localhost:${p}`)
    const lan = urlsApiRedLocal(p)
    if (lan.length > 0) {
      console.log('📱 Para móvil en la misma Wi‑Fi, EXPO_PUBLIC_API_URL puede ser (ejemplos):')
      for (const u of lan) console.log(`   ${u}`)
      console.log('   Si falla: firewall de Windows (entrada al puerto), backend activo e IP actualizada.\n')
    }
    console.log(`🌍 Entorno: ${entorno.nodeEnv}`)
  })
}

void iniciar()
