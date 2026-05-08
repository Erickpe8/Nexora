export interface PerfilUsuario {
  id: number
  nombre: string
  correo: string
  creadoEn: string
  totalComentarios: number
}

export interface PerfilPublico {
  id: number
  nombre: string
  creadoEn: string
  totalComentarios: number
}

export interface ItemHistorial {
  id: number
  contenido: string
  creadoEn: string
  publicacion: {
    id: number
    titulo: string
  }
}

export interface ActualizarPerfil {
  nombre: string
}
