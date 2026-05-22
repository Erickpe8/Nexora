import React, { useState } from 'react'
import { Image, View } from 'react-native'
import Texto from './Texto'
import { colores } from '../styles/colores'

interface PropsAvatarPerfil {
  nombre: string
  fotoPerfilUrl?: string | null
  tamano?: number
}

const obtenerIniciales = (nombre: string): string =>
  nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(parte => parte[0]?.toUpperCase() ?? '')
    .join('')

const AvatarPerfil = ({ nombre, fotoPerfilUrl, tamano = 96 }: PropsAvatarPerfil) => {
  const [errorImagen, setErrorImagen] = useState(false)
  const mostrarFoto = Boolean(fotoPerfilUrl?.trim()) && !errorImagen

  return (
    <View
      style={{
        width: tamano,
        height: tamano,
        borderRadius: tamano / 2,
        overflow: 'hidden',
        backgroundColor: colores.acento,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colores.borde,
      }}
    >
      {mostrarFoto ? (
        <Image
          source={{ uri: fotoPerfilUrl!.trim() }}
          style={{ width: tamano, height: tamano }}
          resizeMode="cover"
          onError={() => setErrorImagen(true)}
        />
      ) : (
        <Texto variante="titulo" color={colores.textoBase}>
          {obtenerIniciales(nombre)}
        </Texto>
      )}
    </View>
  )
}

export default AvatarPerfil
