import React from 'react'
import { View } from 'react-native'
import type { Comentario, Usuario } from '../types'
import Boton from './Boton'
import Tarjeta from './Tarjeta'
import Texto from './Texto'

interface PropsTarjetaComentario {
  comentario: Comentario
  usuarioActual: Usuario | null
  onResponder: (comentarioId: number) => void
  onEliminar: (comentarioId: number) => void
  onPerfil: (usuarioId: number) => void
}

const TarjetaComentario = ({ comentario, usuarioActual, onResponder, onEliminar, onPerfil }: PropsTarjetaComentario) => {
  const esAutor = usuarioActual?.id === comentario.usuarioId
  return (
    <Tarjeta className="mb-2">
      <Texto variante="etiqueta" className="mb-1" onPress={() => onPerfil(comentario.usuarioId)}>
        {comentario.nombreUsuario}
      </Texto>
      <Texto variante="cuerpo">{comentario.contenido}</Texto>
      <Texto variante="etiqueta" className="mt-2">
        {new Date(comentario.creadoEn).toLocaleString()}
      </Texto>
      <View className="mt-2 flex-row gap-2">
        {!comentario.eliminado ? (
          <Boton variante="fantasma" tamano="sm" onPress={() => onResponder(comentario.id)}>
            Responder
          </Boton>
        ) : null}
        {esAutor ? (
          <Boton variante="peligro" tamano="sm" onPress={() => onEliminar(comentario.id)}>
            Eliminar
          </Boton>
        ) : null}
      </View>
    </Tarjeta>
  )
}

export default TarjetaComentario
