import { cliente } from '@/services/cliente'
import type { [TipoPrincipal], [TipoCrear] } from '@/types'

/**
 * servicio[Nombre] — encapsula todas las llamadas HTTP del módulo [nombre].
 *
 * Responsabilidad: comunicación con la API. Sin lógica de negocio.
 * Los hooks consumen este servicio; los componentes no lo llaman directamente.
 */
const servicio[Nombre] = {
  /**
   * Obtener lista de [recursos]
   */
  obtener: async (): Promise<[TipoPrincipal][]> => {
    const { data } = await cliente.get<[TipoPrincipal][]>('/[ruta]')
    return data
  },

  /**
   * Obtener un [recurso] por ID
   */
  obtenerPorId: async (id: number): Promise<[TipoPrincipal]> => {
    const { data } = await cliente.get<[TipoPrincipal]>(`/[ruta]/${id}`)
    return data
  },

  /**
   * Crear un nuevo [recurso]
   */
  crear: async (datos: [TipoCrear]): Promise<[TipoPrincipal]> => {
    const { data } = await cliente.post<[TipoPrincipal]>('/[ruta]', datos)
    return data
  },

  /**
   * Eliminar un [recurso] por ID
   */
  eliminar: async (id: number): Promise<void> => {
    await cliente.delete(`/[ruta]/${id}`)
  },
}

export default servicio[Nombre]
