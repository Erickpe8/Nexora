import type { Publicacion, RespuestaFeed } from '../types'
import { clienteApi, RespuestaDatos } from './api'

export type CanalCompartir = 'copy' | 'web_share' | 'whatsapp' | 'x' | 'facebook' | 'deep_link' | 'otro'

export const servicioEngagement = {
  async toggleGuardado(token: string, publicacionId: number): Promise<{ guardado: boolean; leerDespues: boolean }> {
    const res = await clienteApi.post<RespuestaDatos<{ guardado: boolean; leerDespues: boolean }>>(
      `/publicaciones/${publicacionId}/guardar`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return res.data.datos
  },

  async actualizarLeerDespues(
    token: string,
    publicacionId: number,
    leerDespues: boolean
  ): Promise<{ guardado: boolean; leerDespues: boolean }> {
    const res = await clienteApi.patch<RespuestaDatos<{ guardado: boolean; leerDespues: boolean }>>(
      `/publicaciones/${publicacionId}/guardar`,
      { leerDespues },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return res.data.datos
  },

  async obtenerGuardados(
    token: string,
    pagina: number,
    limite: number,
    soloLeerDespues = false
  ): Promise<RespuestaFeed & { total: number }> {
    const res = await clienteApi.get<RespuestaDatos<RespuestaFeed & { total: number }>>(
      '/usuarios/perfil/guardados',
      {
        params: {
          pagina,
          limite,
          ...(soloLeerDespues ? { leerDespues: 'true' } : {}),
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return res.data.datos
  },

  async compartirPublicacion(
    token: string,
    publicacionId: number,
    canal: CanalCompartir
  ): Promise<{ url: string; compartidosCount: number }> {
    const res = await clienteApi.post<RespuestaDatos<{ url: string; compartidosCount: number }>>(
      `/publicaciones/${publicacionId}/compartir`,
      { canal },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return res.data.datos
  },

  async compartirComentario(
    token: string,
    comentarioId: number,
    canal: CanalCompartir
  ): Promise<{ url: string }> {
    const res = await clienteApi.post<RespuestaDatos<{ url: string }>>(
      `/comentarios/${comentarioId}/compartir`,
      { canal },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return res.data.datos
  },

  async obtenerPorSlug(token: string, slug: string): Promise<Publicacion> {
    const res = await clienteApi.get<RespuestaDatos<Publicacion>>(`/publicaciones/slug/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data.datos
  },
}
