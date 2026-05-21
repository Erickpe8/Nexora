import { useState, useCallback } from 'react'
import { servicioLikes } from '../services/servicioLikes'

export const useLikeComentario = (
  token: string | null,
  comentarioId: number,
  totalLikesInicial: number,
  meDioLikeInicial: boolean
) => {
  const [totalLikes, setTotalLikes] = useState(totalLikesInicial)
  const [meDioLike, setMeDioLike] = useState(meDioLikeInicial)
  const [enviando, setEnviando] = useState(false)

  const alternar = useCallback(async () => {
    if (!token || enviando) return

    // Actualización optimista
    const nuevoEstado = !meDioLike
    setMeDioLike(nuevoEstado)
    setTotalLikes(prev => (nuevoEstado ? prev + 1 : Math.max(0, prev - 1)))
    setEnviando(true)

    try {
      const resumen = nuevoEstado
        ? await servicioLikes.darLike(token, comentarioId)
        : await servicioLikes.quitarLike(token, comentarioId)
      setTotalLikes(resumen.totalLikes)
      setMeDioLike(resumen.meDioLike)
    } catch {
      // Revertir en caso de error
      setMeDioLike(meDioLikeInicial)
      setTotalLikes(totalLikesInicial)
    } finally {
      setEnviando(false)
    }
  }, [token, comentarioId, meDioLike, enviando, meDioLikeInicial, totalLikesInicial])

  // Sincronizar desde evento Socket.IO
  const sincronizarDesdeTiempoReal = useCallback(
    (nuevoTotal: number, nuevoMeDioLike: boolean) => {
      setTotalLikes(nuevoTotal)
      setMeDioLike(nuevoMeDioLike)
    },
    []
  )

  return { totalLikes, meDioLike, enviando, alternar, sincronizarDesdeTiempoReal }
}
