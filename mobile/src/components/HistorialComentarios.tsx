import React from 'react'
import { View } from 'react-native'
import type { ItemHistorial } from '../types'
import TarjetaHistorial from './TarjetaHistorial'
import Texto from './Texto'

interface PropsHistorialComentarios {
  historial: ItemHistorial[]
  onPressItem: (publicacionId: number) => void
}

const HistorialComentarios = ({ historial, onPressItem }: PropsHistorialComentarios) => {
  return (
    <View className="mt-4">
      <Texto variante="subtitulo" className="mb-2">
        Historial de comentarios
      </Texto>
      {historial.length === 0 ? (
        <Texto variante="caption">Sin comentarios recientes</Texto>
      ) : (
        historial.map(item => <TarjetaHistorial key={item.id} item={item} onPress={onPressItem} />)
      )}
    </View>
  )
}

export default HistorialComentarios
