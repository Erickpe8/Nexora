import { useCallback, useState } from 'react'
import type { Publicacion } from '../types'
import { servicioEngagement } from '../services/servicioEngagement'

export const useGuardados = (token: string | null) => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [cargando, setCargando] = useState(false)
  const [soloLeerDespues, setSoloLeerDespues] = useState(false)

  const cargar = useCallback(
    async (pag = 1, reemplazar = true) => {
      if (!token) return
      setCargando(true)
      try {
        const datos = await servicioEngagement.obtenerGuardados(token, pag, 10, soloLeerDespues)
        setPagina(datos.pagina)
        setTotalPaginas(datos.totalPaginas)
        setPublicaciones(prev => (reemplazar ? datos.publicaciones : [...prev, ...datos.publicaciones]))
      } finally {
        setCargando(false)
      }
    },
    [token, soloLeerDespues]
  )

  const cargarMas = useCallback(async () => {
    if (pagina >= totalPaginas || cargando) return
    await cargar(pagina + 1, false)
  }, [pagina, totalPaginas, cargando, cargar])

  return {
    publicaciones,
    cargando,
    pagina,
    totalPaginas,
    soloLeerDespues,
    setSoloLeerDespues,
    cargar,
    cargarMas,
  }
}
