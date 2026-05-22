import bcrypt from 'bcryptjs'
import { pool } from '../shared/database/pool'
import { generarToken } from '../utils/jwt'
import { ErrorHttp } from '../shared/errors/errorHttp'
import type { DatosRegistro, CredencialesLogin, RespuestaAuth, Usuario } from '../types'
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import {
  generarUsernameDisponible,
  normalizarUsername,
  validarFormatoUsername,
  usernameDisponible,
} from '../utils/username'

interface UsuarioFila extends RowDataPacket {
  id: number
  nombre: string
  username: string
  correo: string
  contrasena: string
  creado_en: string
}

const convertirUsuario = (fila: UsuarioFila): Usuario => ({
  id: fila.id,
  nombre: fila.nombre,
  username: fila.username,
  correo: fila.correo,
  creadoEn: fila.creado_en,
})

export const registrarUsuario = async (datos: DatosRegistro): Promise<RespuestaAuth> => {
  const nombre = datos.nombre.trim()
  const correo = datos.correo.trim().toLowerCase()
  const contrasena = datos.contrasena

  const [usuariosExistentes] = await pool.execute<UsuarioFila[]>(
    'SELECT id FROM usuarios WHERE correo = ? LIMIT 1',
    [correo]
  )

  if (usuariosExistentes.length > 0) {
    throw new ErrorHttp('El correo ya está registrado', 409)
  }

  const hashContrasena = await bcrypt.hash(contrasena, 10)

  let username = datos.username?.trim()
    ? normalizarUsername(datos.username.trim())
    : await generarUsernameDisponible(nombre)
  validarFormatoUsername(username)
  if (!(await usernameDisponible(username))) {
    throw new ErrorHttp('El username ya está en uso', 409)
  }

  const [resultado] = await pool.execute<ResultSetHeader>(
    'INSERT INTO usuarios (nombre, username, correo, contrasena) VALUES (?, ?, ?, ?)',
    [nombre, username, correo, hashContrasena]
  )

  const [filasUsuario] = await pool.execute<UsuarioFila[]>(
    'SELECT id, nombre, username, correo, contrasena, creado_en FROM usuarios WHERE id = ? LIMIT 1',
    [resultado.insertId]
  )

  if (filasUsuario.length === 0) {
    throw new ErrorHttp('No se pudo registrar el usuario', 500)
  }

  const usuario = convertirUsuario(filasUsuario[0])
  const token = generarToken({
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
  })

  return { token, usuario }
}

export const iniciarSesion = async (credenciales: CredencialesLogin): Promise<RespuestaAuth> => {
  const correo = credenciales.correo.trim().toLowerCase()
  const contrasena = credenciales.contrasena

  const [filasUsuario] = await pool.execute<UsuarioFila[]>(
    'SELECT id, nombre, username, correo, contrasena, creado_en FROM usuarios WHERE correo = ? LIMIT 1',
    [correo]
  )

  if (filasUsuario.length === 0) {
    throw new ErrorHttp('Credenciales inválidas', 401)
  }

  const usuarioFila = filasUsuario[0]
  const coincideContrasena = await bcrypt.compare(contrasena, usuarioFila.contrasena)

  if (!coincideContrasena) {
    throw new ErrorHttp('Credenciales inválidas', 401)
  }

  const usuario = convertirUsuario(usuarioFila)
  const token = generarToken({
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
  })

  return { token, usuario }
}
