import React from 'react'
import { View } from 'react-native'
import { useSocket } from '../hooks/useSocket'
import { useContextoAuth } from '../context/ContextoAutenticacion'
import Texto from './Texto'

const IndicadorConexion = () => {
  const { token, cargando } = useContextoAuth()
  const { estadoConexion } = useSocket()

  if (cargando || !token) return null
  if (estadoConexion === 'conectado') return null

  return (
    <View className="w-full border-t border-tarjeta bg-advertencia px-3 py-2">
      <Texto variante="caption" color="#0F0F0F" centrado>
        {estadoConexion === 'reconectando' ? 'Reconectando...' : 'Sin conexión en tiempo real'}
      </Texto>
    </View>
  )
}

export default IndicadorConexion
