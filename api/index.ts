/**
 * Entrada serverless Vercel → Express (`backend/dist/app`).
 */
import { crearAplicacion } from '../backend/dist/app'

const app = crearAplicacion()

export default app
