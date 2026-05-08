import { useState } from 'react'
import axios from 'axios'
import { useContextoAuth } from '../context/ContextoAutenticacion'
import { servicioAutenticacion } from '../services/servicioAutenticacion'
import type { CredencialesLogin, DatosRegistro } from '../types'

const obtenerMensajeError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (error.response?.data?.error as string) || 'No se pudo completar la solicitud'
  }
  return 'Ocurrió un error inesperado'
}

export const useAutenticacion = () => {
  const { usuario, token, cargando: cargandoSesion, guardarSesion, cerrarSesion: limpiarSesion } = useContextoAuth()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const iniciarSesion = async (credenciales: CredencialesLogin): Promise<void> => {
    setCargando(true)
    setError(null)
    try {
      const respuesta = await servicioAutenticacion.login(credenciales)
      await guardarSesion(respuesta.token, respuesta.usuario)
    } catch (errorSolicitud) {
      setError(obtenerMensajeError(errorSolicitud))
      throw errorSolicitud
    } finally {
      setCargando(false)
    }
  }

  const registrar = async (datos: DatosRegistro): Promise<void> => {
    setCargando(true)
    setError(null)
    try {
      const respuesta = await servicioAutenticacion.registrar(datos)
      await guardarSesion(respuesta.token, respuesta.usuario)
    } catch (errorSolicitud) {
      setError(obtenerMensajeError(errorSolicitud))
      throw errorSolicitud
    } finally {
      setCargando(false)
    }
  }

  const cerrarSesion = async (): Promise<void> => {
    setError(null)
    await limpiarSesion()
  }

  return {
    usuario,
    token,
    cargando: cargando || cargandoSesion,
    error,
    iniciarSesion,
    registrar,
    cerrarSesion,
    limpiarError: () => setError(null),
  }
}
