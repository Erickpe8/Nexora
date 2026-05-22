import { useCallback, useState } from 'react'
import { servicioEngagement } from '../services/servicioEngagement'

export const useGuardarPublicacion = (
  token: string | null,
  publicacionId: number,
  inicialGuardado: boolean,
  inicialLeerDespues = false
) => {
  const [guardado, setGuardado] = useState(inicialGuardado)
  const [leerDespues, setLeerDespues] = useState(inicialLeerDespues)
  const [enviando, setEnviando] = useState(false)

  const alternarGuardado = useCallback(async () => {
    if (!token) return
    setEnviando(true)
    try {
      const res = await servicioEngagement.toggleGuardado(token, publicacionId)
      setGuardado(res.guardado)
      setLeerDespues(res.leerDespues)
    } finally {
      setEnviando(false)
    }
  }, [token, publicacionId])

  const marcarLeerDespues = useCallback(
    async (valor: boolean) => {
      if (!token || !guardado) return
      setEnviando(true)
      try {
        const res = await servicioEngagement.actualizarLeerDespues(token, publicacionId, valor)
        setLeerDespues(res.leerDespues)
      } finally {
        setEnviando(false)
      }
    },
    [token, publicacionId, guardado]
  )

  return { guardado, leerDespues, enviando, alternarGuardado, marcarLeerDespues, setGuardado, setLeerDespues }
}
