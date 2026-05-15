import React from 'react'
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props {
  children: React.ReactNode
  /** Contenido fijo arriba (logo / marca) */
  cabecera?: React.ReactNode
  /** Contenido fijo abajo (enlaces secundarios) */
  pie?: React.ReactNode
}

/**
 * Layout común auth: safe areas, teclado y scroll; mobile-first.
 */
export const AuthLayout = ({ children, cabecera, pie }: Props) => {
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-auth-canvas">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: Math.max(insets.bottom, 20) + 8,
            paddingHorizontal: 20,
          }}
        >
          {cabecera ? <View className="mb-8">{cabecera}</View> : null}

          <View className="flex-1 justify-center">
            <View className="mx-auto w-full max-w-md">{children}</View>
          </View>

          {pie ? <View className="mt-10">{pie}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}
