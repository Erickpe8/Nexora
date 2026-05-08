import type { CredencialesLogin, DatosRegistro, RespuestaAuth, Usuario } from '../types'
import { clienteApi, RespuestaDatos } from './api'

export const servicioAutenticacion = {
  async login(credenciales: CredencialesLogin): Promise<RespuestaAuth> {
    const respuesta = await clienteApi.post<RespuestaDatos<RespuestaAuth>>('/auth/login', credenciales)
    return respuesta.data.datos
  },

  async registrar(datos: DatosRegistro): Promise<RespuestaAuth> {
    const respuesta = await clienteApi.post<RespuestaDatos<RespuestaAuth>>('/auth/registro', datos)
    return respuesta.data.datos
  },

  async verificarSesion(token: string): Promise<Usuario> {
    const respuesta = await clienteApi.get<RespuestaDatos<{ usuario: Usuario }>>('/auth/verificar', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return respuesta.data.datos.usuario
  },
}
