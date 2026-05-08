export interface Usuario {
  id: number
  nombre: string
  correo: string
  creadoEn?: string
}

export interface RespuestaAuth {
  token: string
  usuario: Usuario
}

export interface CredencialesLogin {
  correo: string
  contrasena: string
}

export interface DatosRegistro {
  nombre: string
  correo: string
  contrasena: string
}
