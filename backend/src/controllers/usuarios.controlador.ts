import { Response, NextFunction, Request } from 'express'
import type { RequestAutenticado } from '../types'
import type { ActualizarPerfilDto } from '../types'
import {
  actualizarPerfil,
  obtenerHistorialComentarios,
  obtenerPerfilPropio,
  obtenerPerfilPublico,
  subirFotoPerfil,
} from '../services/usuarios.servicio'
import { ErrorHttp } from '../shared/errors/errorHttp'

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

export const controladorSubirFotoPerfil = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = (req as RequestAutenticado).usuario
    const archivo = req.file
    if (!archivo?.buffer) {
      throw new ErrorHttp('Debes enviar un archivo en el campo "foto"', 400)
    }
    const datos = await subirFotoPerfil(id, archivo.buffer, archivo.mimetype)
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
