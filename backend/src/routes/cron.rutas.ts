import { Router } from 'express'
import { controladorGenerarIA } from '../controllers/interno.controlador'
import { middlewareAutorizarCronGeneracion } from '../middlewares/cronGeneracion'

const rutasCron = Router()

/** GET/POST — Vercel Cron (GET) o scripts manuales (POST). */
rutasCron.get('/generar-ia', middlewareAutorizarCronGeneracion, controladorGenerarIA)
rutasCron.post('/generar-ia', middlewareAutorizarCronGeneracion, controladorGenerarIA)

export default rutasCron
