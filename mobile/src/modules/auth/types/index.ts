export type { Usuario, RespuestaAuth, CredencialesLogin, DatosRegistro } from '../../../types'

export type EstadoCampo = 'idle' | 'focus' | 'error' | 'disabled'

export interface ResultadoValidacion {
  valido: boolean
  mensaje?: string
}
