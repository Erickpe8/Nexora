import type { ActualizarPerfil, ItemHistorial, PerfilPublico, PerfilUsuario } from '../types'
import { clienteApi, RespuestaDatos } from './api'

export const servicioPerfil = {
  async obtenerPerfil(token: string): Promise<PerfilUsuario> {
    const respuesta = await clienteApi.get<RespuestaDatos<PerfilUsuario>>('/usuarios/perfil', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return respuesta.data.datos
  },

  async actualizarPerfil(token: string, datos: ActualizarPerfil): Promise<PerfilUsuario> {
    const respuesta = await clienteApi.patch<RespuestaDatos<PerfilUsuario>>('/usuarios/perfil', datos, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return respuesta.data.datos
  },

  async subirFotoPerfil(token: string, uriLocal: string, mime = 'image/jpeg'): Promise<PerfilUsuario> {
    const form = new FormData()
    const nombre = uriLocal.split('/').pop() ?? 'avatar.jpg'
    form.append('foto', {
      uri: uriLocal,
      name: nombre,
      type: mime,
    } as unknown as Blob)
    const respuesta = await clienteApi.post<RespuestaDatos<PerfilUsuario>>('/usuarios/perfil/foto', form, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    return respuesta.data.datos
  },

  async actualizarNombre(token: string, nombre: string): Promise<PerfilUsuario> {
    return servicioPerfil.actualizarPerfil(token, { nombre })
  },

  async obtenerPerfilPublico(token: string, id: number): Promise<PerfilPublico> {
    const respuesta = await clienteApi.get<RespuestaDatos<PerfilPublico>>(`/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return respuesta.data.datos
  },

  async obtenerHistorial(token: string, id: number): Promise<ItemHistorial[]> {
    const respuesta = await clienteApi.get<RespuestaDatos<ItemHistorial[]>>(`/usuarios/${id}/comentarios`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return respuesta.data.datos
  },
}
