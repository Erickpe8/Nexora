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

export interface RespuestaDenuncia {
  id: number
  tipoObjetivo: 'comentario' | 'publicacion'
  objetivoId: number
  motivo: string
  estado: string
  creadoEn: string
}
