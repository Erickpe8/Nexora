import type { Comentario, NuevoComentario } from '../types'
import { clienteApi, RespuestaDatos } from './api'

export const servicioComentarios = {
  async obtener(token: string, publicacionId: number): Promise<Comentario[]> {
    const respuesta = await clienteApi.get<RespuestaDatos<Comentario[]>>(`/publicaciones/${publicacionId}/comentarios`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return respuesta.data.datos
  },

  async crear(token: string, publicacionId: number, datos: NuevoComentario, socketId: string | null): Promise<Comentario> {
    const respuesta = await clienteApi.post<RespuestaDatos<Comentario>>(`/publicaciones/${publicacionId}/comentarios`, datos, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-socket-id': socketId || '',
      },
    })
    return respuesta.data.datos
  },

  async eliminar(token: string, comentarioId: number, socketId: string | null): Promise<void> {
    await clienteApi.delete(`/comentarios/${comentarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-socket-id': socketId || '',
      },
    })
  },
}
