import { useState, useEffect, useCallback } from 'react'
import { servicio[Nombre] } from '@/services/servicio[Nombre]'
import type { [TipoPrincipal] } from '@/types'

// Estado interno del hook tipado explícitamente
interface Estado[NombreHook] {
  datos: [TipoPrincipal] | null
  cargando: boolean
  error: string | null
}

// Interfaz pública del hook (lo que expone al componente)
interface Resultado[NombreHook] extends Estado[NombreHook] {
  cargar: () => Promise<void>
  limpiar: () => void
}

/**
 * use[NombreHook] — [descripción breve de qué maneja este hook]
 *
 * Responsabilidad: encapsular la lógica de [dominio].
 * No debe contener lógica de presentación.
 */
const use[NombreHook] = (): Resultado[NombreHook] => {
  const [estado, setEstado] = useState<Estado[NombreHook]>({
    datos: null,
    cargando: false,
    error: null,
  })

  const cargar = useCallback(async () => {
    setEstado(prev => ({ ...prev, cargando: true, error: null }))
    try {
      const resultado = await servicio[Nombre].obtener()
      setEstado({ datos: resultado, cargando: false, error: null })
    } catch (err) {
      setEstado(prev => ({
        ...prev,
        cargando: false,
        error: 'Error al cargar los datos',
      }))
    }
  }, [])

  const limpiar = useCallback(() => {
    setEstado({ datos: null, cargando: false, error: null })
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  return {
    ...estado,
    cargar,
    limpiar,
  }
}

export default use[NombreHook]
