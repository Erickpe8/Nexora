import { Response, NextFunction, Request } from 'express'
import type { RequestAutenticado } from '../types'
import type { ActualizarPerfilDto } from '../types'
import {
  actualizarPerfil,
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
    const cuerpo = req.body as ActualizarPerfilDto
    const datos = await actualizarPerfil(id, {
      nombre: cuerpo.nombre,
      biografia: cuerpo.biografia,
      fotoPerfilUrl: cuerpo.fotoPerfilUrl,
      fechaNacimiento: cuerpo.fechaNacimiento,
      redesSociales: cuerpo.redesSociales,
    })
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
