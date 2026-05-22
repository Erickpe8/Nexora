import { Request, Response, NextFunction } from 'express'
import { registro } from '../shared/logger/registro'

const CONTEXTO = 'AutenticacionCron'

const origenesPermitidos = (): Set<string> => {
  const raw = process.env.CRON_ORIGENES_PERMITIDOS ?? 'github-actions,manual,render,railway,vps,local'
  return new Set(raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean))
}

/**
 * Solo `Authorization: Bearer CRON_SECRET`.
 * No acepta cabecera Vercel Cron — la automatización es externa (GitHub Actions, etc.).
 */
export const middlewareAutenticacionCron = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const secreto = process.env.CRON_SECRET?.trim()
  if (!secreto || secreto.length < 16) {
    registro.error(CONTEXTO, 'CRON_SECRET no configurado o demasiado corto')
    res.status(503).json({
      error: 'Cron no configurado en el servidor (CRON_SECRET)',
      codigo: 503,
    })
    return
  }

  const authHeader = req.headers.authorization
  const bearerOk =
    typeof authHeader === 'string' && authHeader === `Bearer ${secreto}`

  const origenHeader = (req.headers['x-cron-origen'] as string | undefined)?.toLowerCase()
  const origenValido = !origenHeader || origenesPermitidos().has(origenHeader)

  if (!bearerOk || !origenValido) {
    registro.advertencia(CONTEXTO, 'Intento de cron no autorizado', {
      ip: req.ip,
      ruta: req.path,
      origen: origenHeader ?? 'sin-origen',
      tieneBearer: Boolean(authHeader),
    })
    res.status(401).json({ error: 'No autorizado', codigo: 401 })
    return
  }

  next()
}
