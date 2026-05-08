import { Request, Response, NextFunction } from 'express'
import { iniciarSesion, registrarUsuario } from '../services/auth.servicio'
import type { CredencialesLogin, DatosRegistro, RequestAutenticado } from '../types'

export const controladorRegistro = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const datos = req.body as DatosRegistro
    const respuesta = await registrarUsuario(datos)
    res.status(201).json({ datos: respuesta })
  } catch (error) {
    next(error)
  }
}

export const controladorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const credenciales = req.body as CredencialesLogin
    const respuesta = await iniciarSesion(credenciales)
    res.status(200).json({ datos: respuesta })
  } catch (error) {
    next(error)
  }
}

export const controladorVerificarSesion = (
  req: Request,
  res: Response
): void => {
  const { id, nombre, correo } = (req as RequestAutenticado).usuario
  res.status(200).json({
    datos: {
      usuario: {
        id,
        nombre,
        correo,
      },
    },
  })
}
