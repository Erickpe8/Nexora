import { Router } from 'express'
import { middlewareApiKeyInterna } from '../middlewares/autenticacionInterna'
import { controladorGenerarIA } from '../controllers/interno.controlador'
import rateLimit from 'express-rate-limit'

const rutasInterno = Router()

/** Rate limit estricto para el endpoint interno — máximo 5 disparos por hora. */
const limitadorInterno = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiadas solicitudes al endpoint interno', codigo: 429 },
  standardHeaders: true,
  legacyHeaders: false,
})

rutasInterno.use(middlewareApiKeyInterna)
rutasInterno.use(limitadorInterno)

rutasInterno.post('/ia/generar', controladorGenerarIA)

export default rutasInterno
