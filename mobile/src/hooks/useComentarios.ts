import { useCallback, useState } from 'react'
import type { Comentario } from '../types'
import { servicioComentarios } from '../services/servicioComentarios'
import { servicioSocket } from '../services/servicioSocket'

const insertarComentario = (comentarios: Comentario[], nuevo: Comentario): Comentario[] => {
  if (!nuevo.comentarioPadreId) {
    return [...comentarios, nuevo]
  }
  return comentarios.map(comentario => {
    if (comentario.id === nuevo.comentarioPadreId) {
      return { ...comentario, respuestas: [...comentario.respuestas, nuevo] }
    }
    return comentario
  })
}

const marcarComentarioEliminado = (comentarios: Comentario[], id: number): Comentario[] => {
  return comentarios.map(comentario => {
    if (comentario.id === id) {
      return { ...comentario, eliminado: true, contenido: '[comentario eliminado]' }
    }
    return {
      ...comentario,
      respuestas: comentario.respuestas.map(respuesta =>
        respuesta.id === id ? { ...respuesta, eliminado: true, contenido: '[comentario eliminado]' } : respuesta
      ),
    }
  })
}

const cambiarEstadoModeracion = (
  comentarios: Comentario[],
  id: number,
  estado: 'visible' | 'oculto'
): Comentario[] => {
  return comentarios.map(comentario => {
    if (comentario.id === id) {
      return { ...comentario, estadoModeracion: estado }
    }
    return {
      ...comentario,
      respuestas: comentario.respuestas.map(respuesta =>
        respuesta.id === id ? { ...respuesta, estadoModeracion: estado } : respuesta
      ),
    }
  })
}

export const useComentarios = (token: string | null, publicacionId: number) => {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [cargando, setCargando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    if (!token) return
    setCargando(true)
    setError(null)
    try {
      const datos = await servicioComentarios.obtener(token, publicacionId)
      setComentarios(datos)
    } catch {
      setError('No se pudieron cargar los comentarios')
    } finally {
      setCargando(false)
    }
  }, [token, publicacionId])

  const crear = useCallback(
    async (contenido: string, comentarioPadreId?: number) => {
      if (!token) return
      setEnviando(true)
      setError(null)
      try {
        const creado = await servicioComentarios.crear(
          token,
          publicacionId,
          { contenido, comentarioPadreId },
          servicioSocket.obtenerSocket()?.id || null
        )
        setComentarios(prev => insertarComentario(prev, creado))
      } catch {
        setError('No se pudo enviar el comentario')
        throw new Error('error_comentario')
      } finally {
        setEnviando(false)
      }
    },
    [token, publicacionId]
  )

  const eliminar = useCallback(
    async (comentarioId: number) => {
      if (!token) return
      await servicioComentarios.eliminar(token, comentarioId, servicioSocket.obtenerSocket()?.id || null)
      setComentarios(prev => marcarComentarioEliminado(prev, comentarioId))
    },
    [token]
  )

  return {
    comentarios,
    cargando,
    enviando,
    error,
    cargar,
    crear,
    eliminar,
    insertarDesdeTiempoReal: (comentario: Comentario) => setComentarios(prev => insertarComentario(prev, comentario)),
    marcarEliminadoTiempoReal: (id: number) => setComentarios(prev => marcarComentarioEliminado(prev, id)),
    ocultarDesdeTiempoReal: (id: number) => setComentarios(prev => cambiarEstadoModeracion(prev, id, 'oculto')),
    restaurarDesdeTiempoReal: (id: number) => setComentarios(prev => cambiarEstadoModeracion(prev, id, 'visible')),
  }
}
