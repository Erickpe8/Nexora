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

export interface ResumenReacciones {
  total: number
  porTipo: Record<TipoReaccion, number>
  miReaccion: TipoReaccion | null
}
