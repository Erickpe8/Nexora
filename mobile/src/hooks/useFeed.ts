import { useCallback, useState } from 'react'
import { servicioPublicaciones } from '../services/servicioPublicaciones'
import type { Publicacion } from '../types'

export const useFeed = (token: string | null) => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagina, setPagina] = useState(1)
  const [hayMas, setHayMas] = useState(true)

  const cargar = useCallback(async () => {
    if (!token) return
    setCargando(true)
    setError(null)
    try {
      const respuesta = await servicioPublicaciones.obtenerFeed(token, 1, 10)
      setPublicaciones(respuesta.publicaciones)
      setPagina(1)
      setHayMas(respuesta.pagina < respuesta.totalPaginas)
    } catch {
      setError('No se pudo cargar el feed')
    } finally {
      setCargando(false)
    }
  }, [token])

  const cargarMas = useCallback(async () => {
    if (!token || cargando || !hayMas) return
    const siguiente = pagina + 1
    try {
      const respuesta = await servicioPublicaciones.obtenerFeed(token, siguiente, 10)
      setPublicaciones(prev => [...prev, ...respuesta.publicaciones])
      setPagina(siguiente)
      setHayMas(respuesta.pagina < respuesta.totalPaginas)
    } catch {
      setError('No se pudo cargar más publicaciones')
    }
  }, [token, cargando, hayMas, pagina])

  const refrescar = useCallback(async () => {
    await cargar()
  }, [cargar])

  return {
    publicaciones,
    cargando,
    error,
    pagina,
    hayMas,
    cargar,
    cargarMas,
    refrescar,
  }
}
