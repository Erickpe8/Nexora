import { Request } from 'express'

// Usuario decodificado del JWT
export interface UsuarioToken {
  id: number
  nombre: string
  correo: string
}

export interface Usuario {
  id: number
  nombre: string
  correo: string
  creadoEn: string
}

export interface RespuestaAuth {
  token: string
  usuario: Usuario
}

export interface CredencialesLogin {
  correo: string
  contrasena: string
}

export interface DatosRegistro {
  nombre: string
  correo: string
  contrasena: string
}

export interface Publicacion {
  id: number
  titulo: string
  resumen: string
  pregunta: string
  etiquetas: string[]
  generadoPorIa: boolean
  creadoEn: string
  totalComentarios: number
}

export interface RespuestaFeed {
  publicaciones: Publicacion[]
  pagina: number
  totalPaginas: number
}

export interface PublicacionIA {
  titulo: string
  resumen: string
  pregunta: string
  etiquetas: string[]
}

export interface ResultadoGeneracion {
  guardadas: number
  descartadas: number
  errores: string[]
  publicaciones: Publicacion[]
}

/** Resultado de un ciclo completo del orquestador IA (cron o disparo manual). */
export interface ResultadoCicloOrquestadorIA {
  ejecucionId: string
  intentadas: number
  guardadas: number
  descartadas: number
  errores: string[]
  duracionMs: number
}

export interface Comentario {
  id: number
  publicacionId: number
  usuarioId: number
  nombreUsuario: string
  comentarioPadreId: number | null
  contenido: string
  eliminado: boolean
  creadoEn: string
  respuestas: Comentario[]
}

export interface NuevoComentario {
  contenido: string
  comentarioPadreId?: number
}

export type TipoNotificacion = 'nueva_respuesta' | 'actividad_publicacion'

export interface Notificacion {
  id: number
  tipo: TipoNotificacion
  descripcion: string
  publicacionId: number | null
  comentarioId: number | null
  leida: boolean
  creadoEn: string
}

export interface PerfilUsuario {
  id: number
  nombre: string
  correo: string
  creadoEn: string
  totalComentarios: number
}

export interface PerfilPublico {
  id: number
  nombre: string
  creadoEn: string
  totalComentarios: number
}

export interface ItemHistorial {
  id: number
  contenido: string
  creadoEn: string
  publicacion: {
    id: number
    titulo: string
  }
}

// Extender Request de Express para incluir el usuario autenticado
export interface RequestAutenticado extends Request {
  usuario: UsuarioToken
}

// Formato estándar de respuesta exitosa
export interface RespuestaExito<T = unknown> {
  datos: T
}

// Formato estándar de respuesta de error
export interface RespuestaError {
  error: string
  codigo: number
}

// Formato de respuesta paginada
export interface RespuestaPaginada<T> {
  datos: T[]
  pagina: number
  totalPaginas: number
  total: number
}
