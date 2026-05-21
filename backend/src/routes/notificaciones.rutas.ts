import { Router } from 'express'
import { middlewareAuth } from '../middlewares/autenticacion'
import {
  controladorMarcarLeida,
  controladorMarcarTodasLeidas,
  controladorObtenerNotificaciones,
} from '../controllers/notificaciones.controlador'

const rutasNotificaciones = Router()

rutasNotificaciones.use(middlewareAuth)
rutasNotificaciones.get('/', controladorObtenerNotificaciones)

// IMPORTANTE: la ruta estática /leer-todas debe ir ANTES de la dinámica /:id/leida
// de lo contrario Express interpreta "leer-todas" como el parámetro :id
rutasNotificaciones.patch('/leer-todas', controladorMarcarTodasLeidas)
rutasNotificaciones.patch('/:id/leida', controladorMarcarLeida)

export default rutasNotificaciones
