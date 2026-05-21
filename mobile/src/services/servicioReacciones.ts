import type { TipoReaccion, ResumenReacciones } from '../types'
import { clienteApi, RespuestaDatos } from './api'

export const servicioReacciones = {
  async reaccionar(token: string, publicacionId: number, tipo: TipoReaccion): Promise<ResumenReacciones> {
    const respuesta = await clienteApi.post<RespuestaDatos<ResumenReacciones>>(
      `/publicaciones/${publicacionId}/reacciones`,
      { tipo },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return respuesta.data.datos
  },

  async quitarReaccion(token: string, publicacionId: number): Promise<ResumenReacciones> {
    const respuesta = await clienteApi.delete<RespuestaDatos<ResumenReacciones>>(
      `/publicaciones/${publicacionId}/reacciones`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return respuesta.data.datos
  },
}
