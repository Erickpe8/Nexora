import React, { useEffect, useRef } from 'react'
import { View, Animated } from 'react-native'

// Skeleton animado que imita el layout de TarjetaPublicacion
const EsqueletoTarjeta = () => {
  const opacidad = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    // Animación de pulso continua
    const animacion = Animated.loop(
      Animated.sequence([
        Animated.timing(opacidad, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacidad, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    )
    animacion.start()
    return () => animacion.stop()
  }, [opacidad])

  return (
    <Animated.View
      style={{ opacity: opacidad }}
      className="bg-tarjeta rounded-xl border border-borde p-4 mb-3"
    >
      {/* Línea de etiqueta */}
      <View className="h-3 w-16 bg-elevado rounded mb-3" />

      {/* Título */}
      <View className="h-5 w-full bg-elevado rounded mb-2" />
      <View className="h-5 w-3/4 bg-elevado rounded mb-4" />

      {/* Resumen */}
      <View className="h-3 w-full bg-elevado rounded mb-2" />
      <View className="h-3 w-full bg-elevado rounded mb-2" />
      <View className="h-3 w-2/3 bg-elevado rounded mb-4" />

      {/* Footer */}
      <View className="flex-row justify-between">
        <View className="h-3 w-20 bg-elevado rounded" />
        <View className="h-3 w-16 bg-elevado rounded" />
      </View>
    </Animated.View>
  )
}

export default EsqueletoTarjeta
