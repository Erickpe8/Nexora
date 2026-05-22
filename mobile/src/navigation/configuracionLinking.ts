import * as Linking from 'expo-linking'

const prefijo = Linking.createURL('/')

export const configuracionLinking = {
  prefixes: [prefijo, 'nexora://', 'https://nexora.app'],
  config: {
    screens: {
      Principal: {
        screens: {
          TabFeed: {
            screens: {
              Feed: 'feed',
              Detalle: 'noticia/:slug',
              PerfilPublico: 'usuario/:usuarioId',
            },
          },
          TabNotificaciones: {
            screens: {
              Notificaciones: 'notificaciones',
            },
          },
          TabPerfil: {
            screens: {
              Perfil: 'perfil',
              Detalle: 'perfil/publicacion/:publicacionId',
              PerfilPublico: 'perfil/usuario/:usuarioId',
              Moderacion: 'moderacion',
            },
          },
        },
      },
      Auth: {
        screens: {
          Login: 'login',
          Registro: 'registro',
        },
      },
    },
  },
}
