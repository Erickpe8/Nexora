import { useCallback, useState } from 'react'
import type { MotivosDenuncia } from '../types/moderacion'
import { servicioModeracion } from '../services/servicioModeracion'

interface EstadoDenuncia {
  enviando: boolean
  enviada: boolean
  error: string | null
}

/**
 * Hook para gestionar el flujo de denuncia de un comentario.
 * Maneja estado de envío, confirmación y errores.
 */
export const useDenuncias = (token: string | null) => {
  const [estado, setEstado] = useState<EstadoDenuncia>({
    enviando: false,
    enviada: false,
    error: null,
  })

  const denunciar = useCallback(
    async (comentarioId: number, motivo: MotivosDenuncia, detalle?: string): Promise<boolean> => {
      if (!token) return false

      setEstado({ enviando: true, enviada: false, error: null })

      try {
        await servicioModeracion.denunciarComentario(token, comentarioId, { motivo, detalle })
        setEstado({ enviando: false, enviada: true, error: null })
        return true
      } catch (error: unknown) {
        const mensaje =
          (error as { response?: { data?: { error?: string } } })?.response?.data?.error ??
          'No se pudo enviar la denuncia'
        setEstado({ enviando: false, enviada: false, error: mensaje })
        return false
      }
    },
    [token]
  )

  const reiniciar = useCallback(() => {
    setEstado({ enviando: false, enviada: false, error: null })
  }, [])

  return { ...estado, denunciar, reiniciar }
}
