import React, { createElement } from 'react'
import { Platform } from 'react-native'

interface Props {
  children: React.ReactNode
  alEnviar: () => void
}

/** En web, inputs de contraseña deben estar en un `form` del DOM (Chrome). */
export const EnvoltorioFormularioWeb = ({ children, alEnviar }: Props) => {
  if (Platform.OS !== 'web') {
    return <>{children}</>
  }

  return createElement(
    'form',
    {
      onSubmit: (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault()
        alEnviar()
      },
      style: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'stretch',
      },
    },
    children
  )
}
