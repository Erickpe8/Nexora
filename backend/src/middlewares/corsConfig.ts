import cors, { type CorsOptions } from 'cors'

/** Orígenes fijos (producción, preview principal, desarrollo local). */
const ORIGENES_BASE = [
  'https://nexora-ruddy-nine.vercel.app',
  'https://nexora-git-main-erick-s-projects8.vercel.app',
  'http://localhost:3000',
  'http://localhost:8081',
  'http://localhost:4010',
]

/**
 * Permite previews de Vercel (`nexora-*.vercel.app`, ramas git) sin abrir a cualquier dominio.
 */
export const esOrigenPermitido = (origin: string): boolean => {
  const extras = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  if ([...ORIGENES_BASE, ...extras].includes(origin)) return true
  if (/^https:\/\/nexora[\w-]*\.vercel\.app$/i.test(origin)) return true
  if (/^https:\/\/nexora-git-[\w-]+\.vercel\.app$/i.test(origin)) return true
  return false
}

export const opcionesCors: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true)
      return
    }
    if (esOrigenPermitido(origin)) {
      callback(null, true)
      return
    }
    callback(new Error('CORS no permitido'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Cron-Origen',
    'X-Interno-Api-Key',
    'X-Correlacion-Id',
  ],
  exposedHeaders: ['X-Correlacion-Id'],
  optionsSuccessStatus: 204,
}

export const middlewareCors = cors(opcionesCors)

/** Refuerzo para serverless Vercel: preflight OPTIONS explícito. */
export const middlewarePreflightVercel = (
  req: import('express').Request,
  res: import('express').Response,
  next: import('express').NextFunction
): void => {
  const origin = req.headers.origin
  if (origin && esOrigenPermitido(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Vary', 'Origin')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Cron-Origen, X-Interno-Api-Key'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  }

  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }

  next()
}
