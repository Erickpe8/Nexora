import type { Notificacion } from '../types'
import { clienteApi, RespuestaDatos } from './api'

export const servicioNotificaciones = {
  async obtener(token: string): Promise<Notificacion[]> {
    const respuesta = await clienteApi.get<RespuestaDatos<Notificacion[]>>('/notificaciones', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return respuesta.data.datos
  },

  async marcarLeida(token: string, id: number): Promise<void> {
    await clienteApi.patch(
      `/notificaciones/${id}/leida`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  },

  async marcarTodasLeidas(token: string): Promise<void> {
    await clienteApi.patch('/notificaciones/leer-todas', {}, { headers: { Authorization: `Bearer ${token}` } })
  },
}
