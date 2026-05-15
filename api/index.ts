/**
 * Punto de entrada serverless en Vercel para el API Express (`crearAplicacion`).
 * No arranca Socket.IO ni cron (eso solo existe en `server.ts` para ejecución local / VPS).
 */
import { crearAplicacion } from '../backend/dist/app'

const app = crearAplicacion()

export default app
