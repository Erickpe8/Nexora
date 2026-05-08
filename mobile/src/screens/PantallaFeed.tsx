import React from 'react'
import { View, SafeAreaView } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParamsFeed } from '../types/navegacion'
import { Texto } from '../components'

// Placeholder — se implementa en Fase 5 (Feed con IA)
type Props = NativeStackScreenProps<ParamsFeed, 'Feed'>

const PantallaFeed = (_props: Props) => {
  return (
    <SafeAreaView className="flex-1 bg-fondo">
      <View className="flex-1 items-center justify-center px-4">
        <Texto variante="titulo" centrado>Feed</Texto>
        <Texto variante="caption" centrado className="mt-2">
          Próximamente — Fase 5
        </Texto>
      </View>
    </SafeAreaView>
  )
}

export default PantallaFeed
