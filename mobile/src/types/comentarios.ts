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
