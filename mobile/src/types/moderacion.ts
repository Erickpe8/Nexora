export type MotivosDenuncia =
  | 'spam'
  | 'acoso'
  | 'contenido_inapropiado'
  | 'desinformacion'
  | 'otro'

export interface NuevaDenuncia {
  motivo: MotivosDenuncia
  detalle?: string
}

export type EstadoDenuncia = 'pendiente' | 'revisada' | 'resuelta' | 'descartada'

export interface Denuncia {
  id: number
  tipoObjetivo: 'comentario' | 'publicacion'
  objetivoId: number
  autorId: number
  motivo: string
  detalle: string | null
  estado: EstadoDenuncia
  creadoEn: string
  publicacionId?: number
}

export interface RespuestaDenuncia {
  id: number
  tipoObjetivo: 'comentario' | 'publicacion'
  objetivoId: number
  motivo: string
  estado: string
  creadoEn: string
}

export interface RespuestaPaginadaDenuncias {
  denuncias: Denuncia[]
  pagina: number
  totalPaginas: number
  total: number
}

export type AccionModeracion = 'oculto' | 'visible'
