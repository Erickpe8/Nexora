import React from 'react'
import { View } from 'react-native'
import AvatarPerfil from './AvatarPerfil'
import Texto from './Texto'
import { colores } from '../styles/colores'

interface PropsCabeceraPerfil {
  nombre: string
  username?: string
  creadoEn: string
  fotoPerfilUrl?: string | null
  biografia?: string | null
  fechaNacimiento?: string | null
}

const formatearFecha = (iso: string): string =>
  new Date(iso.includes('T') ? iso : `${iso}T12:00:00`).toLocaleDateString('es', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const CabeceraPerfil = ({
  nombre,
  username,
  creadoEn,
  fotoPerfilUrl,
  biografia,
  fechaNacimiento,
}: PropsCabeceraPerfil) => {
  return (
    <View className="items-center">
      <AvatarPerfil nombre={nombre} fotoPerfilUrl={fotoPerfilUrl} tamano={96} />
      <Texto variante="subtitulo" className="mt-3 text-center">
        {nombre}
      </Texto>
      {username ? (
        <Texto variante="caption" color={colores.acento} className="mt-1">
          @{username}
        </Texto>
      ) : null}
      <Texto variante="caption" className="mt-1">
        Miembro desde {formatearFecha(creadoEn)}
      </Texto>
      {fechaNacimiento ? (
        <Texto variante="caption" color={colores.textoSecundario} className="mt-1">
          Nacimiento: {formatearFecha(fechaNacimiento)}
        </Texto>
      ) : null}
      {biografia?.trim() ? (
        <Texto variante="cuerpo" className="mt-3 text-center leading-5">
          {biografia.trim()}
        </Texto>
      ) : null}
    </View>
  )
}

export default CabeceraPerfil
