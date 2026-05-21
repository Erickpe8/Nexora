import React from 'react'
import { View } from 'react-native'
import type { Publicacion } from '../types'
import Tarjeta from './Tarjeta'
import Texto from './Texto'
import InsigniaIA from './InsigniaIA'
import BotonesReaccion from './BotonesReaccion'
import { useReacciones } from '../hooks/useReacciones'
import { useContextoAuth } from '../context/ContextoAutenticacion'

interface PropsTarjetaPublicacion {
  publicacion: Publicacion
  onPress: () => void
}

const TarjetaPublicacion = ({ publicacion, onPress }: PropsTarjetaPublicacion) => {
  const { token } = useContextoAuth()
  const { total, miReaccion, enviando, alternar } = useReacciones(
    token,
    publicacion.id,
    publicacion.totalReacciones,
    publicacion.miReaccion
  )

  return (
    <Tarjeta onPress={onPress} className="mb-3">
      <View className="mb-2">
        {publicacion.generadoPorIa ? <InsigniaIA /> : null}
      </View>
      <Texto variante="subtitulo">{publicacion.titulo}</Texto>
      <Texto variante="caption" className="mt-2">
        {publicacion.resumen}
      </Texto>
      <Texto variante="cuerpo" className="mt-3">
        {publicacion.pregunta}
      </Texto>

      <BotonesReaccion
        miReaccion={miReaccion}
        total={total}
        enviando={enviando}
        onAlternar={alternar}
      />

      <View className="mt-3 flex-row justify-between">
        <Texto variante="etiqueta">{new Date(publicacion.creadoEn).toLocaleString()}</Texto>
        <Texto variante="etiqueta">{publicacion.totalComentarios} comentarios</Texto>
      </View>
    </Tarjeta>
  )
}

export default TarjetaPublicacion
