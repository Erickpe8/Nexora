import React from 'react'
import { View } from 'react-native'

interface PropsDivisor {
  margenVertical?: number
}

const Divisor = ({ margenVertical = 8 }: PropsDivisor) => {
  return (
    <View
      className="w-full h-px bg-borde"
      style={{ marginVertical: margenVertical }}
    />
  )
}

export default Divisor
