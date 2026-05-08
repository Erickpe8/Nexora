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

export type ParamsFeed = {
  Feed:          undefined
  Detalle:       { publicacionId: number }
  PerfilPublico: { usuarioId: number }
}

export type ParamsNotificaciones = {
  Notificaciones: undefined
}

export type ParamsPerfil = {
  Perfil: undefined
}
