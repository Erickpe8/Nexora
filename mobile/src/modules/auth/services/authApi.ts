import type { CredencialesLogin, DatosRegistro, RespuestaAuth, Usuario } from '../../../types'
import { clienteApi } from '../../../services/api'
import type { RespuestaDatos } from '../../../services/api'
import { obtenerTokenSesion } from '../sessionToken'

export const authApi = {
  async login(credenciales: CredencialesLogin): Promise<RespuestaAuth> {
    const respuesta = await clienteApi.post<RespuestaDatos<RespuestaAuth>>('/auth/login', credenciales)
    return respuesta.data.datos
  },

  async registro(datos: DatosRegistro): Promise<RespuestaAuth> {
    const respuesta = await clienteApi.post<RespuestaDatos<RespuestaAuth>>('/auth/registro', datos)
    return respuesta.data.datos
  },

  async verificarSesionActual(): Promise<Usuario> {
    const token = obtenerTokenSesion()
    if (!token) {
      throw new Error('Sin token en memoria')
    }
    const respuesta = await clienteApi.get<RespuestaDatos<{ usuario: Usuario }>>('/auth/verificar')
    return respuesta.data.datos.usuario
  },
}
