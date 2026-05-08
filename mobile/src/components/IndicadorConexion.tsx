import React from 'react'
import { View } from 'react-native'
import { useSocket } from '../hooks/useSocket'
import Texto from './Texto'

const IndicadorConexion = () => {
  const { estadoConexion } = useSocket()
  if (estadoConexion === 'conectado') return null

  return (
    <View className="bg-advertencia px-3 py-1">
      <Texto variante="caption" color="#0F0F0F" centrado>
        {estadoConexion === 'reconectando' ? 'Reconectando...' : 'Sin conexión en tiempo real'}
      </Texto>
    </View>
  )
}

export default IndicadorConexion
