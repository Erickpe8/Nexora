import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Texto } from '@/components/Texto'

// Definir las props del componente con una interface explícita
interface Props[NombreComponente] {
  // Agregar props aquí
  onPress?: () => void
}

/**
 * [NombreComponente] — [descripción breve de qué hace este componente]
 *
 * Responsabilidad: solo presentación, sin lógica de negocio.
 * La lógica debe vivir en el hook o pantalla que lo usa.
 */
const [NombreComponente] = ({ onPress }: Props[NombreComponente]) => {
  return (
    <View className="bg-tarjeta rounded-xl p-4">
      <Texto variante="cuerpo">
        {/* Contenido del componente */}
      </Texto>

      {onPress && (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          className="mt-2"
        >
          <Texto variante="etiqueta" color="acento">
            Acción
          </Texto>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default [NombreComponente]
