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
