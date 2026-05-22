export interface RedesSociales {
  github?: string
  linkedin?: string
  x?: string
  instagram?: string
  facebook?: string
  tiktok?: string
  youtube?: string
  web?: string
}

export interface PerfilBase {
  id: number
  nombre: string
  biografia: string | null
  fotoPerfilUrl: string | null
  fechaNacimiento: string | null
  redesSociales: RedesSociales
  creadoEn: string
  totalComentarios: number
}

export interface PerfilUsuario extends PerfilBase {
  correo: string
}

export interface PerfilPublico extends PerfilBase {}

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
  nombre?: string
  biografia?: string | null
  fotoPerfilUrl?: string | null
  fechaNacimiento?: string | null
  redesSociales?: RedesSociales
}
