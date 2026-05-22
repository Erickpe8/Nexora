import React, { useState } from 'react'
import { View } from 'react-native'
import type { Publicacion } from '../types'
import Tarjeta from './Tarjeta'
import Texto from './Texto'
import Insignia from './Insignia'
import InsigniaIA from './InsigniaIA'
import BotonesReaccion from './BotonesReaccion'
import AccionesEngagement from './AccionesEngagement'
import { useReacciones } from '../hooks/useReacciones'
import { useContextoAuth } from '../context/ContextoAutenticacion'
import { tiempoRelativo } from '../utils/tiempoRelativo'
import { colores } from '../styles/colores'

interface PropsTarjetaPublicacion {
  publicacion: Publicacion
  onPress: () => void
}

const LIMITE_RESUMEN = 180

const TarjetaPublicacion = ({ publicacion, onPress }: PropsTarjetaPublicacion) => {
  const { token } = useContextoAuth()
  const [expandido, setExpandido] = useState(false)
  const { total, miReaccion, enviando, alternar } = useReacciones(
    token,
    publicacion.id,
    publicacion.totalReacciones,
    publicacion.miReaccion
  )

  const resumenLargo = publicacion.resumen.length > LIMITE_RESUMEN
  const resumenVisible =
    expandido || !resumenLargo
      ? publicacion.resumen
      : `${publicacion.resumen.slice(0, LIMITE_RESUMEN).trim()}…`

  return (
    <Tarjeta onPress={onPress} className="mb-3">
      <View className="mb-2 flex-row flex-wrap gap-2">
        {publicacion.generadoPorIa ? <InsigniaIA /> : null}
        {publicacion.categoria ? <Insignia texto={publicacion.categoria} variante="info" /> : null}
        {publicacion.relevancia >= 70 ? (
          <Insignia texto="Tendencia" variante="exito" />
        ) : null}
      </View>

      <Texto variante="subtitulo">{publicacion.titulo}</Texto>

      <Texto variante="caption" className="mt-2">
        {resumenVisible}
      </Texto>
      {resumenLargo ? (
        <Texto
          variante="caption"
          color={colores.acento}
          className="mt-1"
          onPress={() => setExpandido(v => !v)}
        >
          {expandido ? 'Ver menos' : 'Leer más'}
        </Texto>
      ) : null}

      <Texto variante="cuerpo" className="mt-3">
        {publicacion.pregunta}
      </Texto>

      <BotonesReaccion miReaccion={miReaccion} total={total} enviando={enviando} onAlternar={alternar} />

      <AccionesEngagement publicacion={{ ...publicacion, totalReacciones: total, miReaccion }} />

      <View className="mt-3 flex-row justify-between">
        <Texto variante="etiqueta">{tiempoRelativo(publicacion.creadoEn)}</Texto>
        <Texto variante="etiqueta">{publicacion.totalComentarios} comentarios</Texto>
      </View>
    </Tarjeta>
  )
}

export default TarjetaPublicacion
