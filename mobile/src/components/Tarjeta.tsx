import React from 'react'
import { View, TouchableOpacity, ViewProps } from 'react-native'

type RellenoTarjeta = 'sm' | 'md' | 'lg'

interface PropsTarjeta extends ViewProps {
  relleno?: RellenoTarjeta
  onPress?: () => void
  children: React.ReactNode
}

const clasesPorRelleno: Record<RellenoTarjeta, string> = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
}

const Tarjeta = ({
  relleno = 'md',
  onPress,
  children,
  className,
  ...props
}: PropsTarjeta) => {
  const claseBase = `bg-tarjeta rounded-xl border border-borde ${clasesPorRelleno[relleno]} ${className ?? ''}`

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        className={claseBase}
      >
        {children}
      </TouchableOpacity>
    )
  }

  return (
    <View className={claseBase} {...props}>
      {children}
    </View>
  )
}

export default Tarjeta
