import React from 'react'
import { Pressable } from 'react-native'
import Texto from './Texto'
import { colores } from '../styles/colores'

interface PropsNametagUsuario {
  username: string
  nombreVisible?: string
  onPress?: () => void
  tamano?: 'sm' | 'md'
}

const NametagUsuario = ({ username, nombreVisible, onPress, tamano = 'md' }: PropsNametagUsuario) => {
  const etiqueta = `@${username}`
  const variante = tamano === 'sm' ? 'caption' : 'etiqueta'

  if (!onPress) {
    return (
      <Texto variante={variante} color={colores.acento}>
        {etiqueta}
      </Texto>
    )
  }

  return (
    <Pressable onPress={onPress} accessibilityRole="link" accessibilityLabel={`Perfil de ${etiqueta}`}>
      <Texto variante={variante} color={colores.acento}>
        {etiqueta}
        {nombreVisible && nombreVisible !== username ? ` · ${nombreVisible}` : ''}
      </Texto>
    </Pressable>
  )
}

export default NametagUsuario
