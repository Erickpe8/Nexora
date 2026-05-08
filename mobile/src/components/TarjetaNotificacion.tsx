import React from 'react'
import { TouchableOpacity } from 'react-native'
import type { Notificacion } from '../types'
import Texto from './Texto'

interface PropsTarjetaNotificacion {
  notificacion: Notificacion
  onPress: (notificacion: Notificacion) => void
}

const TarjetaNotificacion = ({ notificacion, onPress }: PropsTarjetaNotificacion) => {
  return (
    <TouchableOpacity
      className={`mb-2 rounded-xl border p-3 ${notificacion.leida ? 'bg-tarjeta border-borde' : 'bg-elevado border-acento'}`}
      onPress={() => onPress(notificacion)}
      activeOpacity={0.8}
    >
      <Texto variante="cuerpo">{notificacion.descripcion}</Texto>
      <Texto variante="etiqueta" className="mt-1">
        {new Date(notificacion.creadoEn).toLocaleString()}
      </Texto>
    </TouchableOpacity>
  )
}

export default TarjetaNotificacion
