import React from 'react'
import { TouchableOpacity } from 'react-native'
import Texto from './Texto'

interface PropsBanner {
  cantidad: number
  onPress: () => void
}

const BannerNuevasPublicaciones = ({ cantidad, onPress }: PropsBanner) => {
  return (
    <TouchableOpacity className="mx-4 mb-3 rounded-xl bg-acento p-3" onPress={onPress} activeOpacity={0.8}>
      <Texto variante="cuerpo" color="#F0F0F0" centrado>
        Hay {cantidad} publicaciones nuevas. Toca para actualizar
      </Texto>
    </TouchableOpacity>
  )
}

export default BannerNuevasPublicaciones
