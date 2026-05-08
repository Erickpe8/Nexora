import React from 'react'
import { View } from 'react-native'
import Texto from './Texto'
import Boton from './Boton'

interface AccionEstadoVacio {
  texto: string
  onPress: () => void
}

interface PropsEstadoVacio {
  mensaje: string
  mensajeSecundario?: string
  accion?: AccionEstadoVacio
}

const EstadoVacio = ({
  mensaje,
  mensajeSecundario,
  accion,
}: PropsEstadoVacio) => {
  return (
    <View className="flex-1 items-center justify-center px-8 bg-fondo">
      <Texto variante="titulo" centrado className="mb-2">
        {mensaje}
      </Texto>

      {mensajeSecundario && (
        <Texto variante="caption" centrado className="mb-6">
          {mensajeSecundario}
        </Texto>
      )}

      {accion && (
        <Boton variante="secundario" tamano="sm" onPress={accion.onPress}>
          {accion.texto}
        </Boton>
      )}
    </View>
  )
}

export default EstadoVacio
