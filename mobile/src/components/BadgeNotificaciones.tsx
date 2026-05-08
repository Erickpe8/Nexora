import React from 'react'
import { View } from 'react-native'
import { useContextoNotificaciones } from '../context/ContextoNotificaciones'
import Texto from './Texto'

const BadgeNotificaciones = () => {
  const { totalNoLeidas } = useContextoNotificaciones()
  if (totalNoLeidas <= 0) return null

  return (
    <View className="absolute -right-2 -top-1 min-w-5 rounded-full bg-error px-1 py-0.5">
      <Texto variante="etiqueta" color="#FFFFFF" centrado>
        {totalNoLeidas > 99 ? '99+' : totalNoLeidas}
      </Texto>
    </View>
  )
}

export default BadgeNotificaciones
