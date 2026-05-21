export interface Publicacion {
  id: number
  titulo: string
  resumen: string
  pregunta: string
  etiquetas: string[]
  generadoPorIa: boolean
  creadoEn: string
  totalComentarios: number
  totalReacciones: number
  miReaccion: TipoReaccion | null
}

export interface RespuestaFeed {
  publicaciones: Publicacion[]
  pagina: number
  totalPaginas: number
}

export type TipoReaccion = 'me_gusta' | 'fuego' | 'mente_explotada' | 'curioso'

export interface ResumenReacciones {
  total: number
  porTipo: Record<TipoReaccion, number>
  miReaccion: TipoReaccion | null
}
