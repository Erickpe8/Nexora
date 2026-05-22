import type { RowDataPacket } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import { ErrorHttp } from '../shared/errors/errorHttp'

const USERNAME_RE = /^[a-z0-9_]{3,30}$/

export const normalizarUsername = (texto: string): string => {
  const limpio = texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 30)
  return limpio.length >= 3 ? limpio : 'usuario'
}

export const validarFormatoUsername = (username: string): void => {
  if (!USERNAME_RE.test(username)) {
    throw new ErrorHttp(
      'El username debe tener 3–30 caracteres: letras minúsculas, números o guión bajo',
      400
    )
  }
}

export const usernameDisponible = async (username: string, excluirId?: number): Promise<boolean> => {
  const params: Array<string | number> = [username]
  let sql = 'SELECT id FROM usuarios WHERE username = ? LIMIT 1'
  if (excluirId) {
    sql = 'SELECT id FROM usuarios WHERE username = ? AND id <> ? LIMIT 1'
    params.push(excluirId)
  }
  const [filas] = await pool.execute<RowDataPacket[]>(sql, params)
  return filas.length === 0
}

export const generarUsernameDisponible = async (base: string): Promise<string> => {
  const raiz = normalizarUsername(base)
  let candidato = raiz
  let sufijo = 0
  while (!(await usernameDisponible(candidato))) {
    sufijo += 1
    candidato = `${raiz.slice(0, 24)}${sufijo}`
    if (sufijo > 9999) {
      candidato = `user${Date.now()}`
      break
    }
  }
  return candidato
}
