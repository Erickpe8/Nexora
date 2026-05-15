import React from 'react'
import { Pressable, View, Switch, Platform } from 'react-native'
import Texto from '../../../components/Texto'

interface Props {
  valor: boolean
  alCambiar: (v: boolean) => void
  deshabilitado?: boolean
}

export const AuthInterruptorRecordar = ({ valor, alCambiar, deshabilitado }: Props) => (
  <View className="mb-6 flex-row items-center justify-between rounded-2xl border border-auth-stroke bg-auth-surface/80 px-4 py-3">
    <View className="mr-3 flex-1">
      <Texto variante="cuerpo" className="font-medium text-base">
        Recordar sesión
      </Texto>
      <Texto variante="caption" className="mt-0.5 text-auth-muted">
        No pedir datos al abrir la app en este dispositivo
      </Texto>
    </View>
    <Switch
      value={valor}
      onValueChange={alCambiar}
      disabled={deshabilitado}
      trackColor={{ false: '#3f3f46', true: '#6C63FF' }}
      thumbColor={Platform.OS === 'android' ? '#fafafa' : undefined}
    />
  </View>
)

interface PropsEnlace {
  children: React.ReactNode
  onPress: () => void
  deshabilitado?: boolean
}

export const AuthEnlacePie = ({ children, onPress, deshabilitado }: PropsEnlace) => (
  <Pressable
    onPress={onPress}
    disabled={deshabilitado}
    accessibilityRole="link"
    className="items-center py-3 active:opacity-70"
  >
    <Texto variante="cuerpo" className="text-center font-medium text-acento">
      {children}
    </Texto>
  </Pressable>
)
