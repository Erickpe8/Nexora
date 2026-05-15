type Escucha = () => void

const escuchas = new Set<Escucha>()

/** Token inválido o expirado en una petición autenticada. */
export const suscribirSesionInvalidada = (fn: Escucha): (() => void) => {
  escuchas.add(fn)
  return () => escuchas.delete(fn)
}

export const emitirSesionInvalidada = (): void => {
  escuchas.forEach(fn => {
    try {
      fn()
    } catch {
      /* no bloquear otras escuchas */
    }
  })
}
