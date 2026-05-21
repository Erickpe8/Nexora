import { useCallback, useState } from 'react'
import { servicioPublicaciones } from '../services/servicioPublicaciones'
import type { Publicacion } from '../types'

export const useFeed = (token: string | null) => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagina, setPagina] = useState(1)
  const [hayMas, setHayMas] = useState(true)
  const [terminoBusqueda, setTerminoBusqueda] = useState('')

  const cargar = useCallback(async (buscar = '') => {
    if (!token) return
    setCargando(true)
    setError(null)
    try {
      const respuesta = await servicioPublicaciones.obtenerFeed(token, 1, 10, buscar)
      setPublicaciones(respuesta.publicaciones)
      setPagina(1)
      setHayMas(respuesta.pagina < respuesta.totalPaginas)
    } catch {
      setError('No se pudo cargar el feed')
    } finally {
      setCargando(false)
    }
  }, [token])

  const buscar = useCallback(async (termino: string) => {
    setTerminoBusqueda(termino)
    await cargar(termino)
  }, [cargar])

  const limpiarBusqueda = useCallback(async () => {
    setTerminoBusqueda('')
    await cargar('')
  }, [cargar])

  const cargarMas = useCallback(async () => {
    if (!token || cargando || !hayMas) return
    const siguiente = pagina + 1
    try {
      const respuesta = await servicioPublicaciones.obtenerFeed(token, siguiente, 10, terminoBusqueda)
      setPublicaciones(prev => [...prev, ...respuesta.publicaciones])
      setPagina(siguiente)
      setHayMas(respuesta.pagina < respuesta.totalPaginas)
    } catch {
      setError('No se pudo cargar más publicaciones')
    }
  }, [token, cargando, hayMas, pagina, terminoBusqueda])

  const refrescar = useCallback(async () => {
    await cargar(terminoBusqueda)
  }, [cargar, terminoBusqueda])

  return {
    publicaciones,
    cargando,
    error,
    pagina,
    hayMas,
    terminoBusqueda,
    cargar,
    cargarMas,
    refrescar,
    buscar,
    limpiarBusqueda,
  }
}
