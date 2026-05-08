import { useCallback, useState } from 'react'
import type { ItemHistorial } from '../types'
import { servicioPerfil } from '../services/servicioPerfil'

export const useHistorialComentarios = (token: string | null) => {
  const [historial, setHistorial] = useState<ItemHistorial[]>([])
  const [cargando, setCargando] = useState(false)

  const cargar = useCallback(
    async (usuarioId: number) => {
      if (!token) return
      setCargando(true)
      try {
        setHistorial(await servicioPerfil.obtenerHistorial(token, usuarioId))
      } finally {
        setCargando(false)
      }
    },
    [token]
  )

  return { historial, cargando, cargar }
}
