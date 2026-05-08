import React from 'react'
import type { ItemHistorial } from '../types'
import Tarjeta from './Tarjeta'
import Texto from './Texto'

interface PropsTarjetaHistorial {
  item: ItemHistorial
  onPress: (publicacionId: number) => void
}

const TarjetaHistorial = ({ item, onPress }: PropsTarjetaHistorial) => {
  return (
    <Tarjeta onPress={() => onPress(item.publicacion.id)} className="mb-2">
      <Texto variante="cuerpo">{item.contenido}</Texto>
      <Texto variante="caption" className="mt-1">
        En: {item.publicacion.titulo}
      </Texto>
    </Tarjeta>
  )
}

export default TarjetaHistorial
