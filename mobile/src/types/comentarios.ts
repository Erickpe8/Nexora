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
