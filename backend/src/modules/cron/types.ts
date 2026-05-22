export type TipoTrabajoCron =
  | 'generar_noticias_ia'
  | 'actualizar_tendencias'
  | 'limpiar_cache'
  | 'actualizar_metricas'
  | 'procesar_recomendaciones'
  | 'reentrenar_tendencias'
  | 'revisar_contenido_reportado'
  | 'procesar_cola'

export type EstadoTrabajoCola = 'pendiente' | 'procesando' | 'completado' | 'fallido'

export interface PayloadGenerarNoticias {
  cantidad?: number
}

export interface RespuestaCronBase {
  ejecucionId: string
  tipo: TipoTrabajoCron
  exito: boolean
  duracionMs: number
  mensaje: string
  detalle?: Record<string, unknown>
}

export interface RespuestaEncolarTrabajo {
  jobId: number
  tipo: TipoTrabajoCron
  estado: EstadoTrabajoCola
  encoladoEn: string
}
