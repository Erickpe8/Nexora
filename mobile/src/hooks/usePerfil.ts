import { useCallback, useState } from 'react'
import type { PerfilUsuario } from '../types'
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

  const actualizarNombre = useCallback(
    async (nombre: string) => {
      if (!token) return
      setGuardando(true)
      setError(null)
      try {
        setPerfil(await servicioPerfil.actualizarNombre(token, nombre))
      } catch {
        setError('No se pudo actualizar el nombre')
        throw new Error('error_actualizar_perfil')
      } finally {
        setGuardando(false)
      }
    },
    [token]
  )

  return { perfil, cargando, guardando, error, cargar, actualizarNombre }
}
