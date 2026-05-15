/** Registro mínimo estructurado; evolución hacia JSON + correlación (observabilidad-plataforma). */
export const registro = {
  info: (contexto: string, mensaje: string): void => {
    console.log(`[${contexto}] ${mensaje}`)
  },
  advertencia: (contexto: string, mensaje: string): void => {
    console.warn(`[${contexto}] ${mensaje}`)
  },
  error: (contexto: string, error: unknown): void => {
    console.error(`[${contexto}]`, error)
  },
}
