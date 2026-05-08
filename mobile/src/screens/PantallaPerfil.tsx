import React from 'react'
import { View, SafeAreaView } from 'react-native'
import { Texto } from '../components'

// Placeholder — se implementa en Fase 8 (Perfil de Usuario)
const PantallaPerfil = () => {
  return (
    <SafeAreaView className="flex-1 bg-fondo">
      <View className="flex-1 items-center justify-center px-4">
        <Texto variante="titulo" centrado>Mi Perfil</Texto>
        <Texto variante="caption" centrado className="mt-2">
          Próximamente — Fase 8
        </Texto>
      </View>
    </SafeAreaView>
  )
}

export default PantallaPerfil
