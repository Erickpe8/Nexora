import { clienteApi, RespuestaDatos } from './api'

interface ResumenLike {
  comentarioId: number
  publicacionId: number
  totalLikes: number
  meDioLike: boolean
}

export const servicioLikes = {
  async darLike(token: string, comentarioId: number): Promise<ResumenLike> {
    const respuesta = await clienteApi.post<RespuestaDatos<ResumenLike>>(
      `/comentarios/${comentarioId}/likes`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return respuesta.data.datos
  },

  async quitarLike(token: string, comentarioId: number): Promise<ResumenLike> {
    const respuesta = await clienteApi.delete<RespuestaDatos<ResumenLike>>(
      `/comentarios/${comentarioId}/likes`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return respuesta.data.datos
  },
}
