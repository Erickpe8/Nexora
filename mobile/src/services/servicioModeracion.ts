import type {
  AccionModeracion,
  NuevaDenuncia,
  RespuestaDenuncia,
  RespuestaPaginadaDenuncias,
} from '../types/moderacion'
import { clienteApi, type RespuestaDatos } from './api'

export const servicioModeracion = {
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

  async listarDenuncias(
    token: string,
    pagina = 1,
    estado?: string
  ): Promise<RespuestaPaginadaDenuncias> {
    const respuesta = await clienteApi.get<RespuestaDatos<RespuestaPaginadaDenuncias>>(
      '/moderacion/denuncias',
      {
        params: { pagina, limite: 20, ...(estado ? { estado } : {}) },
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return respuesta.data.datos
  },

  async moderarComentario(
    token: string,
    comentarioId: number,
    accion: AccionModeracion,
    notaInterna?: string
  ): Promise<{ comentarioId: number; accion: AccionModeracion }> {
    const respuesta = await clienteApi.patch<
      RespuestaDatos<{ comentarioId: number; accion: AccionModeracion }>
    >(
      `/moderacion/comentarios/${comentarioId}`,
      { accion, notaInterna },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return respuesta.data.datos
  },
}
