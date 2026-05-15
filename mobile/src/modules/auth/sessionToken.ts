/** Token en memoria para interceptores Axios (sin leer disco en cada petición). */
let accesoEnMemoria: string | null = null

export const establecerTokenSesion = (token: string | null): void => {
  accesoEnMemoria = token
}

export const obtenerTokenSesion = (): string | null => accesoEnMemoria

export const limpiarTokenSesion = (): void => {
  accesoEnMemoria = null
}
