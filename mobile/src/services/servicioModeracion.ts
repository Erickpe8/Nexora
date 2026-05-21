import type { NuevaDenuncia, RespuestaDenuncia } from '../types/moderacion'
import { clienteApi, type RespuestaDatos } from './api'

export const servicioModeracion = {
  /**
   * Denuncia un comentario.
   * POST /api/comentarios/:id/denuncias
   */
  async denunciarComentario(
    token: string,
    comentarioId: number,
    datos: NuevaDenuncia
  ): Promise<RespuestaDenuncia> {
    const respuesta = await clienteApi.post<RespuestaDatos<RespuestaDenuncia>>(
      `/comentarios/${comentarioId}/denuncias`,
      datos,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return respuesta.data.datos
  },
}
