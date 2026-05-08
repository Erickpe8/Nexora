import React from 'react'
import { View } from 'react-native'
import Texto from './Texto'

interface PropsCabeceraPerfil {
  nombre: string
  creadoEn: string
}

const obtenerIniciales = (nombre: string): string =>
  nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(parte => parte[0]?.toUpperCase() ?? '')
    .join('')

const CabeceraPerfil = ({ nombre, creadoEn }: PropsCabeceraPerfil) => {
  return (
    <View className="items-center">
      <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-acento">
        <Texto variante="subtitulo" color="#F0F0F0">
          {obtenerIniciales(nombre)}
        </Texto>
      </View>
      <Texto variante="subtitulo">{nombre}</Texto>
      <Texto variante="caption">Miembro desde {new Date(creadoEn).toLocaleDateString()}</Texto>
    </View>
  )
}

export default CabeceraPerfil
