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
  username: string
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
  username?: string
  correo: string
  contrasena: string
}

export interface Publicacion {
  id: number
  slug: string
  titulo: string
  resumen: string
  contenidoExpandido: string | null
  pregunta: string
  categoria: string | null
  etiquetas: string[]
  fuenteUrl: string | null
  imagenUrl: string | null
  relevancia: number
  generadoPorIa: boolean
  creadoEn: string
  totalComentarios: number
  totalReacciones: number
  miReaccion: TipoReaccion | null
  compartidosCount: number
  guardadoPorMi: boolean
  leerDespues: boolean
}

export interface RespuestaFeed {
  publicaciones: Publicacion[]
  pagina: number
  totalPaginas: number
}

export type TipoReaccion = 'me_gusta' | 'fuego' | 'mente_explotada' | 'curioso'

export interface Reaccion {
  publicacionId: number
  usuarioId: number
  tipo: TipoReaccion
}

export interface ResumenReacciones {
  total: number
  porTipo: Record<TipoReaccion, number>
  miReaccion: TipoReaccion | null
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
  username: string
  comentarioPadreId: number | null
  contenido: string
  eliminado: boolean
  estadoModeracion: 'visible' | 'oculto'
  creadoEn: string
  respuestas: Comentario[]
  totalLikes: number
  meDioLike: boolean
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

export interface RedesSociales {
  github?: string
  linkedin?: string
  x?: string
  instagram?: string
  facebook?: string
  tiktok?: string
  youtube?: string
  web?: string
}

export interface PerfilBase {
  id: number
  nombre: string
  username: string
  biografia: string | null
  fotoPerfilUrl: string | null
  fechaNacimiento: string | null
  redesSociales: RedesSociales
  creadoEn: string
  totalComentarios: number
}

export interface PerfilUsuario extends PerfilBase {
  correo: string
  esModerador: boolean
}

export interface PerfilPublico extends PerfilBase {}

export interface ActualizarPerfilDto {
  nombre?: string
  username?: string
  biografia?: string | null
  fotoPerfilUrl?: string | null
  fechaNacimiento?: string | null
  redesSociales?: RedesSociales
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

// --- Moderación y Denuncias ---

export type MotivosDenuncia = 'spam' | 'acoso' | 'contenido_inapropiado' | 'desinformacion' | 'otro'
export type EstadoDenuncia = 'pendiente' | 'revisada' | 'resuelta' | 'descartada'
export type EstadoModeracion = 'visible' | 'oculto'

export interface NuevaDenuncia {
  tipoObjetivo: 'comentario' | 'publicacion'
  objetivoId: number
  motivo: MotivosDenuncia
  detalle?: string
}

export interface Denuncia {
  id: number
  tipoObjetivo: 'comentario' | 'publicacion'
  objetivoId: number
  autorId: number
  motivo: string
  detalle: string | null
  estado: EstadoDenuncia
  creadoEn: string
  /** Presente en listados de moderación cuando el objetivo es un comentario. */
  publicacionId?: number
}

export interface RespuestaPaginadaDenuncias {
  denuncias: Denuncia[]
  pagina: number
  totalPaginas: number
  total: number
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
