import React from 'react'
import { View, SafeAreaView } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParamsAuth } from '../types/navegacion'
import { Texto } from '../components'

// Placeholder — se implementa en Fase 4 (Autenticación)
type Props = NativeStackScreenProps<ParamsAuth, 'Registro'>

const PantallaRegistro = (_props: Props) => {
  return (
    <SafeAreaView className="flex-1 bg-fondo">
      <View className="flex-1 items-center justify-center px-4">
        <Texto variante="titulo" centrado>Crear cuenta</Texto>
        <Texto variante="caption" centrado className="mt-2">
          Próximamente — Fase 4
        </Texto>
      </View>
    </SafeAreaView>
  )
}

export default PantallaRegistro
