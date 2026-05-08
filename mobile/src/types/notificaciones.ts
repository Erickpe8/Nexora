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

export interface EstadoNotificaciones {
  notificaciones: Notificacion[]
  totalNoLeidas: number
}
