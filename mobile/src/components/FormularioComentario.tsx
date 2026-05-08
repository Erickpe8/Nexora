import React, { useState } from 'react'
import { View } from 'react-native'
import Entrada from './Entrada'
import Boton from './Boton'
import Texto from './Texto'

interface PropsFormularioComentario {
  enviando: boolean
  comentarioPadreId?: number
  onEnviar: (contenido: string, comentarioPadreId?: number) => Promise<void>
}

const FormularioComentario = ({ enviando, comentarioPadreId, onEnviar }: PropsFormularioComentario) => {
  const [contenido, setContenido] = useState('')

  const manejarEnviar = async () => {
    const valor = contenido.trim()
    if (!valor) return
    await onEnviar(valor, comentarioPadreId)
    setContenido('')
  }

  return (
    <View className="mt-4">
      <Entrada
        etiqueta={comentarioPadreId ? 'Responder comentario' : 'Escribe un comentario'}
        value={contenido}
        onChangeText={setContenido}
        multiline
      />
      <Texto variante="etiqueta" className="mb-2">
        {contenido.length}/500
      </Texto>
      <Boton cargando={enviando} onPress={manejarEnviar}>
        Enviar
      </Boton>
    </View>
  )
}

export default FormularioComentario
