import rateLimit from 'express-rate-limit'

// Límite general: 100 peticiones por IP cada 15 minutos
export const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiadas peticiones. Intenta de nuevo en 15 minutos.',
    codigo: 429,
  },
})

// Límite estricto para auth: 10 intentos por IP cada 15 minutos
export const limitadorAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiados intentos de autenticación. Intenta de nuevo en 15 minutos.',
    codigo: 429,
  },
})
