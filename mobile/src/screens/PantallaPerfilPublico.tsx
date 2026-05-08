import React from 'react'
import { View, SafeAreaView } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParamsFeed } from '../types/navegacion'
import { Texto } from '../components'

// Placeholder — se implementa en Fase 8 (Perfil de Usuario)
type Props = NativeStackScreenProps<ParamsFeed, 'PerfilPublico'>

const PantallaPerfilPublico = ({ route }: Props) => {
  return (
    <SafeAreaView className="flex-1 bg-fondo">
      <View className="flex-1 items-center justify-center px-4">
        <Texto variante="titulo" centrado>Perfil</Texto>
        <Texto variante="caption" centrado className="mt-2">
          Usuario #{route.params.usuarioId}
        </Texto>
      </View>
    </SafeAreaView>
  )
}

export default PantallaPerfilPublico
