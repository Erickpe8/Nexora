import React, { useState } from 'react'
import { View } from 'react-native'
import type { Comentario, Usuario } from '../types'
import FormularioComentario from './FormularioComentario'
import TarjetaComentario from './TarjetaComentario'
import Texto from './Texto'

interface PropsListaComentarios {
  comentarios: Comentario[]
  usuarioActual: Usuario | null
  enviando: boolean
  onEnviar: (contenido: string, comentarioPadreId?: number) => Promise<void>
  onEliminar: (comentarioId: number) => Promise<void>
  onPerfil: (usuarioId: number) => void
}

const ListaComentarios = ({
  comentarios,
  usuarioActual,
  enviando,
  onEnviar,
  onEliminar,
  onPerfil,
}: PropsListaComentarios) => {
  const [comentarioPadreId, setComentarioPadreId] = useState<number | undefined>(undefined)

  return (
    <View className="mt-4">
      <Texto variante="subtitulo" className="mb-3">
        Comentarios
      </Texto>

      {comentarios.map(comentario => (
        <View key={comentario.id}>
          <TarjetaComentario
            comentario={comentario}
            usuarioActual={usuarioActual}
            onResponder={setComentarioPadreId}
            onEliminar={(id) => void onEliminar(id)}
            onPerfil={onPerfil}
          />
          <View className="ml-4">
            {comentario.respuestas.map(respuesta => (
              <TarjetaComentario
                key={respuesta.id}
                comentario={respuesta}
                usuarioActual={usuarioActual}
                onResponder={() => undefined}
                onEliminar={(id) => void onEliminar(id)}
                onPerfil={onPerfil}
              />
            ))}
          </View>
        </View>
      ))}

      <FormularioComentario enviando={enviando} comentarioPadreId={comentarioPadreId} onEnviar={onEnviar} />
    </View>
  )
}

export default ListaComentarios
