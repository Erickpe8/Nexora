import { Request, Response, NextFunction } from 'express'

// Schema de validación simple: define campos requeridos y sus tipos
export interface CampoValidacion {
  tipo: 'string' | 'number' | 'boolean' | 'email'
  requerido?: boolean
  minLongitud?: number
  maxLongitud?: number
}

export type SchemaValidacion = Record<string, CampoValidacion>

// Validar formato de correo electrónico
const esCorreoValido = (valor: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)
}

// Middleware de validación de body
// Recibe un schema y devuelve un middleware que valida req.body
export const validar = (schema: SchemaValidacion) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errores: string[] = []

    for (const [campo, reglas] of Object.entries(schema)) {
      const valor = req.body[campo]

      // Verificar campo requerido
      if (reglas.requerido && (valor === undefined || valor === null || valor === '')) {
        errores.push(`El campo '${campo}' es requerido`)
        continue
      }

      // Si no es requerido y no viene, saltar
      if (valor === undefined || valor === null) continue

      // Verificar tipo
      if (reglas.tipo === 'email') {
        if (typeof valor !== 'string' || !esCorreoValido(valor)) {
          errores.push(`El campo '${campo}' debe ser un correo electrónico válido`)
        }
      } else if (typeof valor !== reglas.tipo) {
        errores.push(`El campo '${campo}' debe ser de tipo ${reglas.tipo}`)
      }

      // Verificar longitud mínima
      if (reglas.minLongitud && typeof valor === 'string' && valor.length < reglas.minLongitud) {
        errores.push(`El campo '${campo}' debe tener al menos ${reglas.minLongitud} caracteres`)
      }

      // Verificar longitud máxima
      if (reglas.maxLongitud && typeof valor === 'string' && valor.length > reglas.maxLongitud) {
        errores.push(`El campo '${campo}' no puede superar ${reglas.maxLongitud} caracteres`)
      }
    }

    if (errores.length > 0) {
      res.status(400).json({ error: errores.join('. '), codigo: 400 })
      return
    }

    next()
  }
}
