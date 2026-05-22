import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { pool } from '../shared/database/pool'
import { ErrorHttp } from '../shared/errors/errorHttp'
import type {
  ActualizarPerfilDto,
  ItemHistorial,
  PerfilPublico,
  PerfilUsuario,
  RedesSociales,
} from '../types'

interface PerfilFila extends RowDataPacket {
  id: number
  nombre: string
  correo: string
  biografia: string | null
  foto_perfil_url: string | null
  fecha_nacimiento: string | null
  redes_sociales: string | RedesSociales | null
  creado_en: string
  total_comentarios: number
}

interface HistorialFila extends RowDataPacket {
  id: number
  contenido: string
  creado_en: string
  publicacion_id: number
  publicacion_titulo: string
}

const CAMPOS_REDES_PERMITIDOS = [
  'github',
  'linkedin',
  'x',
  'instagram',
  'facebook',
  'tiktok',
  'youtube',
  'web',
] as const

const SELECT_PERFIL = `
  u.id, u.nombre, u.correo, u.biografia, u.foto_perfil_url, u.fecha_nacimiento, u.redes_sociales, u.creado_en,
  (SELECT COUNT(*) FROM comentarios c WHERE c.usuario_id = u.id AND c.eliminado = FALSE) AS total_comentarios
`

const parsearRedesSociales = (raw: string | RedesSociales | null): RedesSociales => {
  if (!raw) return {}
  if (typeof raw === 'object') return raw
  try {
    const valor = JSON.parse(raw) as RedesSociales
    return typeof valor === 'object' && valor !== null ? valor : {}
  } catch {
    return {}
  }
}

const formatearFechaNacimiento = (valor: string | Date | null): string | null => {
  if (!valor) return null
  if (valor instanceof Date) {
    return valor.toISOString().slice(0, 10)
  }
  const texto = String(valor)
  return texto.length >= 10 ? texto.slice(0, 10) : texto
}

const mapearPerfilBase = (fila: PerfilFila) => ({
  id: fila.id,
  nombre: fila.nombre,
  biografia: fila.biografia?.trim() || null,
  fotoPerfilUrl: fila.foto_perfil_url?.trim() || null,
  fechaNacimiento: formatearFechaNacimiento(fila.fecha_nacimiento),
  redesSociales: parsearRedesSociales(fila.redes_sociales),
  creadoEn: fila.creado_en,
  totalComentarios: Number(fila.total_comentarios || 0),
})

const mapearPerfilUsuario = (fila: PerfilFila): PerfilUsuario => ({
  ...mapearPerfilBase(fila),
  correo: fila.correo,
})

const mapearPerfilPublico = (fila: PerfilFila): PerfilPublico => mapearPerfilBase(fila)

const normalizarUrl = (url: string): string => {
  const limpia = url.trim()
  if (!/^https?:\/\//i.test(limpia)) {
    return `https://${limpia}`
  }
  return limpia
}

const validarUrlOpcional = (url: string | undefined, etiqueta: string): string | undefined => {
  if (url === undefined) return undefined
  const limpia = url.trim()
  if (limpia === '') return ''
  if (limpia.length > 500) {
    throw new ErrorHttp(`La URL de ${etiqueta} es demasiado larga`, 400)
  }
  const normalizada = normalizarUrl(limpia)
  try {
    const parsed = new URL(normalizada)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new ErrorHttp(`URL de ${etiqueta} inválida`, 400)
    }
  } catch {
    throw new ErrorHttp(`URL de ${etiqueta} inválida`, 400)
  }
  return normalizada
}

const validarFechaNacimiento = (fecha: string | null | undefined): string | null | undefined => {
  if (fecha === undefined) return undefined
  const limpia = fecha?.trim() ?? ''
  if (limpia === '') return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(limpia)) {
    throw new ErrorHttp('La fecha de nacimiento debe tener formato AAAA-MM-DD', 400)
  }
  const parsed = new Date(`${limpia}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) {
    throw new ErrorHttp('Fecha de nacimiento inválida', 400)
  }
  const hoy = new Date()
  if (parsed > hoy) {
    throw new ErrorHttp('La fecha de nacimiento no puede ser futura', 400)
  }
  const edadMs = hoy.getTime() - parsed.getTime()
  const edadAnios = edadMs / (1000 * 60 * 60 * 24 * 365.25)
  if (edadAnios < 13) {
    throw new ErrorHttp('Debes tener al menos 13 años para usar Nexora', 400)
  }
  if (edadAnios > 120) {
    throw new ErrorHttp('Fecha de nacimiento no válida', 400)
  }
  return limpia
}

const validarRedesSociales = (redes: RedesSociales | undefined): RedesSociales | undefined => {
  if (redes === undefined) return undefined
  const salida: RedesSociales = {}
  for (const clave of Object.keys(redes)) {
    if (!CAMPOS_REDES_PERMITIDOS.includes(clave as (typeof CAMPOS_REDES_PERMITIDOS)[number])) {
      continue
    }
    const url = redes[clave as keyof RedesSociales]
    if (typeof url !== 'string') continue
    const validada = validarUrlOpcional(url, clave)
    if (validada) {
      salida[clave as keyof RedesSociales] = validada
    }
  }
  return salida
}

export const obtenerPerfilPropio = async (usuarioId: number): Promise<PerfilUsuario> => {
  const [filas] = await pool.execute<PerfilFila[]>(
    `SELECT ${SELECT_PERFIL} FROM usuarios u WHERE u.id = ? LIMIT 1`,
    [usuarioId]
  )
  if (filas.length === 0) throw new ErrorHttp('Usuario no encontrado', 404)
  return mapearPerfilUsuario(filas[0])
}

export const actualizarPerfil = async (
  usuarioId: number,
  datos: ActualizarPerfilDto
): Promise<PerfilUsuario> => {
  const actual = await obtenerPerfilPropio(usuarioId)
  const sets: string[] = []
  const params: Array<string | null> = []

  if (datos.nombre !== undefined) {
    const nombreLimpio = datos.nombre.trim()
    if (nombreLimpio.length < 3 || nombreLimpio.length > 30) {
      throw new ErrorHttp('El nombre debe tener entre 3 y 30 caracteres', 400)
    }
    const [ocupado] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM usuarios WHERE nombre = ? AND id <> ? LIMIT 1',
      [nombreLimpio, usuarioId]
    )
    if (ocupado.length > 0) throw new ErrorHttp('El nombre ya está en uso', 409)
    sets.push('nombre = ?')
    params.push(nombreLimpio)
  }

  if (datos.biografia !== undefined) {
    const bio = datos.biografia?.trim() ?? ''
    if (bio.length > 500) {
      throw new ErrorHttp('La biografía no puede superar 500 caracteres', 400)
    }
    sets.push('biografia = ?')
    params.push(bio === '' ? null : bio)
  }

  if (datos.fotoPerfilUrl !== undefined) {
    const foto = datos.fotoPerfilUrl?.trim() ?? ''
    if (foto === '') {
      sets.push('foto_perfil_url = ?')
      params.push(null)
    } else {
      const validada = validarUrlOpcional(foto, 'foto de perfil')
      sets.push('foto_perfil_url = ?')
      params.push(validada ?? null)
    }
  }

  const fechaValidada = validarFechaNacimiento(datos.fechaNacimiento)
  if (fechaValidada !== undefined) {
    sets.push('fecha_nacimiento = ?')
    params.push(fechaValidada)
  }

  const redesValidadas = validarRedesSociales(datos.redesSociales)
  if (redesValidadas !== undefined) {
    sets.push('redes_sociales = ?')
    params.push(JSON.stringify(redesValidadas))
  }

  if (sets.length === 0) {
    return actual
  }

  await pool.execute<ResultSetHeader>(
    `UPDATE usuarios SET ${sets.join(', ')} WHERE id = ?`,
    [...params, usuarioId]
  )

  return obtenerPerfilPropio(usuarioId)
}

/** @deprecated Usar actualizarPerfil */
export const actualizarNombrePerfil = async (usuarioId: number, nombre: string): Promise<PerfilUsuario> =>
  actualizarPerfil(usuarioId, { nombre })

export const obtenerPerfilPublico = async (usuarioId: number): Promise<PerfilPublico> => {
  const [filas] = await pool.execute<PerfilFila[]>(
    `SELECT ${SELECT_PERFIL} FROM usuarios u WHERE u.id = ? LIMIT 1`,
    [usuarioId]
  )
  if (filas.length === 0) throw new ErrorHttp('Usuario no encontrado', 404)
  return mapearPerfilPublico(filas[0])
}

export const obtenerHistorialComentarios = async (usuarioId: number): Promise<ItemHistorial[]> => {
  const [filas] = await pool.execute<HistorialFila[]>(
    `SELECT
      c.id, c.contenido, c.creado_en, p.id AS publicacion_id, p.titulo AS publicacion_titulo
     FROM comentarios c
     INNER JOIN publicaciones p ON p.id = c.publicacion_id
     WHERE c.usuario_id = ? AND c.eliminado = FALSE
     ORDER BY c.creado_en DESC
     LIMIT 20`,
    [usuarioId]
  )

  return filas.map(fila => ({
    id: fila.id,
    contenido: fila.contenido,
    creadoEn: fila.creado_en,
    publicacion: {
      id: fila.publicacion_id,
      titulo: fila.publicacion_titulo,
    },
  }))
}
