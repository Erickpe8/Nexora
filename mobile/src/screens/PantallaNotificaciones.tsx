import React from 'react'
import { View, SafeAreaView } from 'react-native'
import { Texto } from '../components'

// Placeholder — se implementa en Fase 7 (Notificaciones)
const PantallaNotificaciones = () => {
  return (
    <SafeAreaView className="flex-1 bg-fondo">
      <View className="flex-1 items-center justify-center px-4">
        <Texto variante="titulo" centrado>Notificaciones</Texto>
        <Texto variante="caption" centrado className="mt-2">
          Próximamente — Fase 7
        </Texto>
      </View>
    </SafeAreaView>
  )
}

export default PantallaNotificaciones
