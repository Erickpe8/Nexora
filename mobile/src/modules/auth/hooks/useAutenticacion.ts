import { useCallback, useRef, useState } from 'react'
import Toast from 'react-native-toast-message'
import { useContextoAuth } from '../../../context/ContextoAutenticacion'
import type { CredencialesLogin, DatosRegistro } from '../../../types'
import { authApi } from '../services/authApi'
import { mapearErrorAuth } from '../services/mapAuthError'

export const useAutenticacion = () => {
  const { usuario, token, cargando: cargandoSesion, guardarSesion, cerrarSesion: limpiarSesionEnContexto } =
    useContextoAuth()
  const [cargando, setCargando] = useState(false)
  const operacionEnCurso = useRef(false)

  const iniciarSesion = useCallback(
    async (credenciales: CredencialesLogin, opciones?: { recordar?: boolean }): Promise<void> => {
      if (operacionEnCurso.current) return
      operacionEnCurso.current = true
      setCargando(true)
      try {
        const respuesta = await authApi.login(credenciales)
        await guardarSesion(respuesta.token, respuesta.usuario, {
          recordar: opciones?.recordar !== false,
        })
        Toast.show({ type: 'success', text1: 'Bienvenido de nuevo', text2: respuesta.usuario.nombre })
      } catch (e) {
        const msg = mapearErrorAuth(e)
        Toast.show({ type: 'error', text1: 'No se pudo iniciar sesión', text2: msg })
        throw e
      } finally {
        setCargando(false)
        operacionEnCurso.current = false
      }
    },
    [guardarSesion]
  )

  const registrar = useCallback(
    async (datos: DatosRegistro): Promise<void> => {
      if (operacionEnCurso.current) return
      operacionEnCurso.current = true
      setCargando(true)
      try {
        const respuesta = await authApi.registro(datos)
        await guardarSesion(respuesta.token, respuesta.usuario, { recordar: true })
        Toast.show({ type: 'success', text1: 'Cuenta creada', text2: `Hola, ${respuesta.usuario.nombre}` })
      } catch (e) {
        const msg = mapearErrorAuth(e)
        Toast.show({ type: 'error', text1: 'Registro incompleto', text2: msg })
        throw e
      } finally {
        setCargando(false)
        operacionEnCurso.current = false
      }
    },
    [guardarSesion]
  )

  const cerrarSesion = useCallback(async () => {
    await limpiarSesionEnContexto()
    Toast.show({ type: 'info', text1: 'Sesión cerrada' })
  }, [limpiarSesionEnContexto])

  return {
    usuario,
    token,
    cargando: cargando || cargandoSesion,
    iniciarSesion,
    registrar,
    cerrarSesion,
  }
}
