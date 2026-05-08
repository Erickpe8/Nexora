import React from 'react'
import { View } from 'react-native'
import EsqueletoTarjeta from './EsqueletoTarjeta'

const CargadorFeed = () => {
  return (
    <View className="px-4 pt-4">
      <EsqueletoTarjeta />
      <EsqueletoTarjeta />
      <EsqueletoTarjeta />
    </View>
  )
}

export default CargadorFeed
