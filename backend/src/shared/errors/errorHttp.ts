/** Error de dominio o HTTP mapeable a respuesta JSON estándar Nexora. */
export class ErrorHttp extends Error {
  constructor(
    public mensaje: string,
    public codigo: number = 500
  ) {
    super(mensaje)
    this.name = 'ErrorHttp'
  }
}
