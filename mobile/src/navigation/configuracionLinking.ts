// Deep linking — preparado para activación futura
// Para activar: pasar como prop `linking` al NavigationContainer en NavegadorRaiz
//
// Ejemplo de uso:
//   <NavigationContainer theme={temaNexora} linking={configuracionLinking}>

export const configuracionLinking = {
  prefixes: ['nexora://', 'https://nexora.app'],
  config: {
    screens: {
      Principal: {
        screens: {
          TabFeed: {
            screens: {
              Detalle: 'publicacion/:publicacionId',
              PerfilPublico: 'usuario/:usuarioId',
            },
          },
          TabNotificaciones: {
            screens: {
              Notificaciones: 'notificaciones',
            },
          },
        },
      },
    },
  },
}
