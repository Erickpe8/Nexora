import { useState, useCallback } from 'react'
import type { TipoReaccion, ResumenReacciones } from '../types'
import { servicioReacciones } from '../services/servicioReacciones'

interface EstadoReacciones {
  total: number
  porTipo: Record<TipoReaccion, number>
  miReaccion: TipoReaccion | null
  enviando: boolean
}

const estadoInicial = (
  totalReacciones: number,
  miReaccion: TipoReaccion | null
): EstadoReacciones => ({
  total: totalReacciones,
  porTipo: { me_gusta: 0, fuego: 0, mente_explotada: 0, curioso: 0 },
  miReaccion,
  enviando: false,
})

export const useReacciones = (
  token: string | null,
  publicacionId: number,
  totalReaccionesInicial: number,
  miReaccionInicial: TipoReaccion | null
) => {
  const [estado, setEstado] = useState<EstadoReacciones>(() =>
    estadoInicial(totalReaccionesInicial, miReaccionInicial)
  )

  const actualizarDesdeResumen = useCallback((resumen: ResumenReacciones) => {
    setEstado(prev => ({
      ...prev,
      total: resumen.total,
      porTipo: resumen.porTipo,
      miReaccion: resumen.miReaccion,
      enviando: false,
    }))
  }, [])

  const alternar = useCallback(
    async (tipo: TipoReaccion) => {
      if (!token || estado.enviando) return

      // Actualización optimista
      const esMismoTipo = estado.miReaccion === tipo
      setEstado(prev => ({
        ...prev,
        enviando: true,
        miReaccion: esMismoTipo ? null : tipo,
        total: esMismoTipo ? Math.max(0, prev.total - 1) : prev.miReaccion ? prev.total : prev.total + 1,
      }))

      try {
        const resumen = esMismoTipo
          ? await servicioReacciones.quitarReaccion(token, publicacionId)
          : await servicioReacciones.reaccionar(token, publicacionId, tipo)
        actualizarDesdeResumen(resumen)
      } catch {
        // Revertir en caso de error
        setEstado(prev => ({
          ...prev,
          enviando: false,
          miReaccion: miReaccionInicial,
          total: totalReaccionesInicial,
        }))
      }
    },
    [token, publicacionId, estado.enviando, estado.miReaccion, miReaccionInicial, totalReaccionesInicial, actualizarDesdeResumen]
  )

  // Permite sincronizar desde evento Socket.IO
  const sincronizarDesdeTiempoReal = useCallback(
    (resumen: ResumenReacciones) => {
      actualizarDesdeResumen(resumen)
    },
    [actualizarDesdeResumen]
  )

  return {
    total: estado.total,
    porTipo: estado.porTipo,
    miReaccion: estado.miReaccion,
    enviando: estado.enviando,
    alternar,
    sincronizarDesdeTiempoReal,
  }
}
