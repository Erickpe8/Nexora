import { Request, Response, NextFunction } from 'express'
import { pool } from '../shared/database/pool'
import { iniciarSesion, registrarUsuario } from '../services/auth.servicio'
import type { RowDataPacket } from 'mysql2/promise'
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

export const controladorVerificarSesion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = (req as RequestAutenticado).usuario
    const [filas] = await pool.execute<RowDataPacket[]>(
      'SELECT id, nombre, COALESCE(username, CONCAT(\'user\', id)) AS username, correo, creado_en FROM usuarios WHERE id = ? LIMIT 1',
      [id]
    )
    if (filas.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado', codigo: 404 })
      return
    }
    const u = filas[0]
    res.status(200).json({
      datos: {
        usuario: {
          id: Number(u.id),
          nombre: String(u.nombre),
          username: String(u.username),
          correo: String(u.correo),
          creadoEn: String(u.creado_en),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}
