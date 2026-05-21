import type { Publicacion, RespuestaFeed } from '../types'
import { clienteApi, RespuestaDatos } from './api'

export const servicioPublicaciones = {
  async obtenerFeed(token: string, pagina: number, limite: number, buscar = ''): Promise<RespuestaFeed> {
    const respuesta = await clienteApi.get<RespuestaDatos<RespuestaFeed>>('/publicaciones', {
      params: { pagina, limite, ...(buscar.trim() ? { buscar: buscar.trim() } : {}) },
      headers: { Authorization: `Bearer ${token}` },
    })
    return respuesta.data.datos
  },

  async obtenerDetalle(token: string, id: number): Promise<Publicacion> {
    const respuesta = await clienteApi.get<RespuestaDatos<Publicacion>>(`/publicaciones/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return respuesta.data.datos
  },
}
