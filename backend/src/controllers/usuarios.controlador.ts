import { Response, NextFunction, Request } from 'express'
import type { RequestAutenticado } from '../types'
import {
  actualizarNombrePerfil,
  obtenerHistorialComentarios,
  obtenerPerfilPropio,
  obtenerPerfilPublico,
} from '../services/usuarios.servicio'

export const controladorPerfilPropio = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = (req as RequestAutenticado).usuario
    const datos = await obtenerPerfilPropio(id)
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}

export const controladorActualizarPerfil = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = (req as RequestAutenticado).usuario
    const datos = await actualizarNombrePerfil(id, String(req.body.nombre ?? ''))
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}

export const controladorPerfilPublico = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const datos = await obtenerPerfilPublico(Number(req.params.id))
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}

export const controladorHistorialUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const datos = await obtenerHistorialComentarios(Number(req.params.id))
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}
