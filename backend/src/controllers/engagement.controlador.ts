import { Request, Response, NextFunction } from 'express'
import { actualizarLeerDespues, toggleGuardado } from '../services/guardados.servicio'
import {
  registrarCompartirComentario,
  registrarCompartirPublicacion,
  type CanalCompartir,
} from '../services/compartir.servicio'
import {
  obtenerFeedGuardados,
  obtenerPublicacionPorSlug,
} from '../services/publicaciones.servicio'
import type { RequestAutenticado } from '../types'

const canalDesdeBody = (raw: unknown): CanalCompartir => {
  const canales: CanalCompartir[] = ['copy', 'web_share', 'whatsapp', 'x', 'facebook', 'deep_link', 'otro']
  return canales.includes(raw as CanalCompartir) ? (raw as CanalCompartir) : 'otro'
}

export const controladorToggleGuardado = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const publicacionId = Number(req.params.id)
    const { id: usuarioId } = (req as RequestAutenticado).usuario
    const datos = await toggleGuardado(usuarioId, publicacionId)
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}

export const controladorActualizarGuardado = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const publicacionId = Number(req.params.id)
    const { id: usuarioId } = (req as RequestAutenticado).usuario
    const leerDespues = Boolean(req.body?.leerDespues)
    const datos = await actualizarLeerDespues(usuarioId, publicacionId, leerDespues)
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}

export const controladorFeedGuardados = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pagina = Number(req.query.pagina ?? 1)
    const limite = Number(req.query.limite ?? 10)
    const soloLeerDespues = req.query.leerDespues === 'true' || req.query.leerDespues === '1'
    const { id: usuarioId } = (req as RequestAutenticado).usuario
    const datos = await obtenerFeedGuardados(usuarioId, pagina, limite, soloLeerDespues)
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}

export const controladorCompartirPublicacion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const publicacionId = Number(req.params.id)
    const { id: usuarioId } = (req as RequestAutenticado).usuario
    const canal = canalDesdeBody(req.body?.canal)
    const datos = await registrarCompartirPublicacion(usuarioId, publicacionId, canal)
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}

export const controladorCompartirComentario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comentarioId = Number(req.params.id)
    const { id: usuarioId } = (req as RequestAutenticado).usuario
    const canal = canalDesdeBody(req.body?.canal)
    const datos = await registrarCompartirComentario(usuarioId, comentarioId, canal)
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}

export const controladorPublicacionPorSlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slug = String(req.params.slug)
    const { id: usuarioId } = (req as RequestAutenticado).usuario
    const datos = await obtenerPublicacionPorSlug(slug, usuarioId)
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}
