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
rutasNotificaciones.patch('/:id/leida', controladorMarcarLeida)
rutasNotificaciones.patch('/leer-todas', controladorMarcarTodasLeidas)

export default rutasNotificaciones
