/**
 * Entrada serverless Vercel → Express empaquetado en build (`api/serverless.bundle.cjs`).
 * El bundle se genera en `npm run vercel-build` (scripts/bundle-serverless.cjs).
 */
import type { Application } from 'express'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { crearAplicacion } = require('./serverless.bundle.cjs') as {
  crearAplicacion: () => Application
}

const app = crearAplicacion()

export default app
