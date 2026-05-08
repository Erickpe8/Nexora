import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { colores } from '../styles'

type TamanoCargador = 'sm' | 'md' | 'lg'

interface PropsCargador {
  tamano?: TamanoCargador
  color?: string
  centrado?: boolean
}

const tamanoNativo: Record<TamanoCargador, 'small' | 'large'> = {
  sm: 'small',
  md: 'small',
  lg: 'large',
}

const Cargador = ({
  tamano = 'md',
  color = colores.acento,
  centrado = false,
}: PropsCargador) => {
  if (centrado) {
    return (
      <View className="flex-1 items-center justify-center bg-fondo">
        <ActivityIndicator size={tamanoNativo[tamano]} color={color} />
      </View>
    )
  }

  return <ActivityIndicator size={tamanoNativo[tamano]} color={color} />
}

export default Cargador
