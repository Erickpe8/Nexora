import { Router } from 'express'
import { controladorListo, controladorSalud, controladorVivo } from '../controllers/salud.controlador'

const rutasSalud = Router()

rutasSalud.get('/', controladorSalud)
rutasSalud.get('/listo', controladorListo)
rutasSalud.get('/vivo', controladorVivo)

export default rutasSalud
