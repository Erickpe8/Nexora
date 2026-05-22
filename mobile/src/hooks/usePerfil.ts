import { useCallback, useState } from 'react'
import type { ActualizarPerfil, PerfilUsuario } from '../types'
import { servicioPerfil } from '../services/servicioPerfil'

export const usePerfil = (token: string | null) => {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null)
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    if (!token) return
    setCargando(true)
    setError(null)
    try {
      setPerfil(await servicioPerfil.obtenerPerfil(token))
    } catch {
      setError('No se pudo cargar el perfil')
    } finally {
      setCargando(false)
    }
  }, [token])

  const actualizarPerfil = useCallback(
    async (datos: ActualizarPerfil) => {
      if (!token) return
      setGuardando(true)
      setError(null)
      try {
        setPerfil(await servicioPerfil.actualizarPerfil(token, datos))
      } catch {
        setError('No se pudo guardar el perfil. Revisa los datos e intenta de nuevo.')
        throw new Error('error_actualizar_perfil')
      } finally {
        setGuardando(false)
      }
    },
    [token]
  )

  const actualizarNombre = useCallback(
    async (nombre: string) => actualizarPerfil({ nombre }),
    [actualizarPerfil]
  )

  return { perfil, cargando, guardando, error, cargar, actualizarPerfil, actualizarNombre }
}
