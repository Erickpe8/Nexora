import React from 'react'
import { Pressable, ActivityIndicator, View } from 'react-native'
import Texto from '../../../components/Texto'

interface Props {
  children: React.ReactNode
  onPress: () => void
  cargando?: boolean
  deshabilitado?: boolean
  variante?: 'primario' | 'secundario'
}

export const AuthBotonPrincipal = ({
  children,
  onPress,
  cargando = false,
  deshabilitado = false,
  variante = 'primario',
}: Props) => {
  const off = deshabilitado || cargando

  const clases =
    variante === 'primario'
      ? 'bg-acento active:bg-acento-claro shadow-lg shadow-acento/25'
      : 'border border-auth-stroke bg-auth-elevated active:bg-auth-surface'

  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityState={{ disabled: off, busy: cargando }}
      className={`flex-row items-center justify-center rounded-2xl px-5 py-4 ${clases} ${off ? 'opacity-50' : ''}`}
    >
      {cargando ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator color="#f4f4f5" />
          <Texto variante="cuerpo" className="font-semibold text-white">
            Espera…
          </Texto>
        </View>
      ) : (
        <Texto variante="cuerpo" className="font-semibold text-white">
          {children}
        </Texto>
      )}
    </Pressable>
  )
}
