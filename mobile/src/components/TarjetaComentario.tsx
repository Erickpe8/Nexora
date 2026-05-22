import React, { useState } from 'react'
import { View } from 'react-native'
import type { Comentario, Usuario } from '../types'
import Boton from './Boton'
import Tarjeta from './Tarjeta'
import Texto from './Texto'
import ModalDenuncia from './ModalDenuncia'
import { useDenuncias } from '../hooks/useDenuncias'
import { useLikeComentario } from '../hooks/useLikeComentario'
import { useContextoAuth } from '../context/ContextoAutenticacion'
import type { MotivosDenuncia } from '../types/moderacion'
import { colores } from '../styles/colores'
import { espaciado } from '../styles/espaciado'
import Icono from './Icono'

interface PropsTarjetaComentario {
  comentario: Comentario
  usuarioActual: Usuario | null
  onResponder: (comentarioId: number) => void
  onEliminar: (comentarioId: number) => void
  onPerfil: (usuarioId: number) => void
}

const TarjetaComentario = ({
  comentario,
  usuarioActual,
  onResponder,
  onEliminar,
  onPerfil,
}: PropsTarjetaComentario) => {
  const { token } = useContextoAuth()
  const esAutor = usuarioActual?.id === comentario.usuarioId
  const [modalVisible, setModalVisible] = useState(false)
  const { enviando: enviandoDenuncia, enviada, error, denunciar, reiniciar } = useDenuncias(token)
  const { totalLikes, meDioLike, enviando: enviandoLike, alternar: alternarLike } =
    useLikeComentario(token, comentario.id, comentario.totalLikes, comentario.meDioLike)

  // Comentario oculto por moderación — mostrar placeholder sin acciones
  if (comentario.estadoModeracion === 'oculto') {
    return (
      <Tarjeta className="mb-2 opacity-50">
        <Texto variante="caption" color="#9A9A9A">
          [comentario oculto por moderación]
        </Texto>
      </Tarjeta>
    )
  }

  const alDenunciar = async (motivo: MotivosDenuncia, detalle?: string) => {
    await denunciar(comentario.id, motivo, detalle)
  }

  const alCerrarModal = () => {
    setModalVisible(false)
    reiniciar()
  }

  return (
    <>
      <Tarjeta className="mb-2">
        <Texto
          variante="etiqueta"
          className="mb-1"
          onPress={() => onPerfil(comentario.usuarioId)}
        >
          {comentario.nombreUsuario}
        </Texto>

        <Texto variante="cuerpo">{comentario.contenido}</Texto>

        <Texto variante="etiqueta" className="mt-2">
          {new Date(comentario.creadoEn).toLocaleString()}
        </Texto>

        <View className="mt-2 flex-row gap-2 flex-wrap items-center">
          {/* Botón de like */}
          {!comentario.eliminado ? (
            <Boton
              variante="fantasma"
              tamano="sm"
              onPress={() => void alternarLike()}
              disabled={enviandoLike}
              accessibilityLabel={meDioLike ? 'Quitar me gusta' : 'Me gusta'}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: espaciado.xs }}>
                <Icono
                  nombre={meDioLike ? 'corazon' : 'corazon-vacio'}
                  tamano={18}
                  color={meDioLike ? colores.acento : colores.textoSecundario}
                />
                {totalLikes > 0 ? (
                  <Texto
                    variante="caption"
                    color={meDioLike ? colores.acento : colores.textoSecundario}
                  >
                    {String(totalLikes)}
                  </Texto>
                ) : null}
              </View>
            </Boton>
          ) : null}

          {!comentario.eliminado ? (
            <Boton
              variante="fantasma"
              tamano="sm"
              onPress={() => onResponder(comentario.id)}
            >
              Responder
            </Boton>
          ) : null}

          {esAutor ? (
            <Boton
              variante="peligro"
              tamano="sm"
              onPress={() => onEliminar(comentario.id)}
            >
              Eliminar
            </Boton>
          ) : null}

          {!esAutor && !comentario.eliminado ? (
            <Boton
              variante="fantasma"
              tamano="sm"
              onPress={() => setModalVisible(true)}
            >
              Denunciar
            </Boton>
          ) : null}
        </View>
      </Tarjeta>

      <ModalDenuncia
        visible={modalVisible}
        comentarioId={comentario.id}
        enviando={enviandoDenuncia}
        enviada={enviada}
        error={error}
        onDenunciar={alDenunciar}
        onCerrar={alCerrarModal}
      />
    </>
  )
}

export default TarjetaComentario
