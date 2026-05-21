import { Request, Response, NextFunction } from 'express'
import type { NuevoComentario, RequestAutenticado } from '../types'
import { crearComentario, eliminarComentario, obtenerComentariosPublicacion } from '../services/comentarios.servicio'

export const controladorObtenerComentarios = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const publicacionId = Number(req.params.id)
    const { id: usuarioId } = (req as RequestAutenticado).usuario
    const datos = await obtenerComentariosPublicacion(publicacionId, usuarioId)
    res.status(200).json({ datos })
  } catch (error) {
    next(error)
  }
}

export const controladorCrearComentario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const publicacionId = Number(req.params.id)
    const { id, nombre } = (req as RequestAutenticado).usuario
    const socketId = (req.headers['x-socket-id'] as string | undefined) ?? null
    const datos = req.body as NuevoComentario
    const creado = await crearComentario(publicacionId, id, nombre, datos, socketId)
    res.status(201).json({ datos: creado })
  } catch (error) {
    next(error)
  }
}

export const controladorEliminarComentario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comentarioId = Number(req.params.id)
    const { id } = (req as RequestAutenticado).usuario
    const socketId = (req.headers['x-socket-id'] as string | undefined) ?? null
    await eliminarComentario(comentarioId, id, socketId)
    res.status(200).json({ datos: { ok: true } })
  } catch (error) {
    next(error)
  }
}
