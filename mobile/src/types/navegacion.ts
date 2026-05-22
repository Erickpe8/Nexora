// Tipos de parámetros para cada navigator de la app

export type ParamsRaiz = {
  Auth:      undefined
  Principal: undefined
}

export type ParamsAuth = {
  Login:    undefined
  Registro: undefined
}

export type ParamsTabs = {
  TabFeed:           undefined
  TabNotificaciones: undefined
  TabPerfil:         undefined
}

/** Pantallas compartidas entre stacks Feed y Perfil */
export type ParamsDetalleYPerfil = {
  Detalle: { publicacionId?: number; slug?: string }
  PerfilPublico: { usuarioId: number }
}

export type ParamsFeed = {
  Feed: undefined
} & ParamsDetalleYPerfil

export type ParamsNotificaciones = {
  Notificaciones: undefined
}

export type ParamsPerfil = {
  Perfil: undefined
  Guardados: undefined
  Moderacion: undefined
} & ParamsDetalleYPerfil
