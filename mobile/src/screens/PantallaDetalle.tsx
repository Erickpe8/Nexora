import React from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'

import {
  ScrollView,
} from 'react-native'

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack'

import type { ParamsDetalleYPerfil } from '../types/navegacion'

import type {
  Publicacion,
} from '../types'

import {
  AccionesEngagement,
  Cargador,
  ListaComentarios,
  Texto,
} from '../components'

import { useAutenticacion } from '../hooks/useAutenticacion'

import { servicioPublicaciones } from '../services/servicioPublicaciones'

import { useComentarios } from '../hooks/useComentarios'

import { useComentariosEnTiempoReal } from '../hooks/useComentariosEnTiempoReal'
import { usePollingSinSocket } from '../hooks/usePollingSinSocket'

type Props = NativeStackScreenProps<ParamsDetalleYPerfil, 'Detalle'>

const PantallaDetalle = ({
  route,
  navigation,
}: Props) => {
  const { token, usuario } =
    useAutenticacion()

  const [publicacion, setPublicacion] =
    React.useState<Publicacion | null>(
      null
    )

  const [cargando, setCargando] =
    React.useState(false)

  const publicacionId = route.params.publicacionId
  const slugParam = route.params.slug

  const idPublicacion = publicacion?.id ?? publicacionId ?? 0

  const comentarios = useComentarios(token, idPublicacion)

  const {
    cargar: cargarComentarios,
    crear: crearComentario,
    eliminar: eliminarComentario,
    enviando,
    comentarios: listaComentarios,
    insertarDesdeTiempoReal,
    marcarEliminadoTiempoReal,
    ocultarDesdeTiempoReal,
    restaurarDesdeTiempoReal,
  } = comentarios

  useComentariosEnTiempoReal(
    idPublicacion,
    comentario =>
      insertarDesdeTiempoReal(
        comentario
      ),
    id =>
      marcarEliminadoTiempoReal(id),
    id =>
      ocultarDesdeTiempoReal(id),
    id =>
      restaurarDesdeTiempoReal(id)
  )

  const recargarDetalle = React.useCallback(async () => {
    if (!token) return
    setCargando(true)
    try {
      const datos = slugParam
        ? await servicioPublicaciones.obtenerPorSlug(token, slugParam)
        : await servicioPublicaciones.obtenerDetalle(token, publicacionId ?? 0)
      setPublicacion(datos)
    } finally {
      setCargando(false)
    }
  }, [token, publicacionId, slugParam])

  React.useEffect(() => {
    void recargarDetalle()
  }, [recargarDetalle])

  React.useEffect(() => {
    if (idPublicacion > 0) void cargarComentarios()
  }, [idPublicacion, cargarComentarios])

  usePollingSinSocket(() => void cargarComentarios(), 30_000, Boolean(token))

  return (
    <SafeAreaView
      className="flex-1 bg-fondo"
      edges={['top']}
    >
      {cargando || !publicacion ? (
        <Cargador centrado />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 140,
          }}
          showsVerticalScrollIndicator={
            false
          }
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
        >
          <Texto variante="titulo">
            {publicacion.titulo}
          </Texto>

          <Texto
            variante="caption"
            className="mt-2"
          >
            {new Date(
              publicacion.creadoEn
            ).toLocaleString()}
          </Texto>

          <Texto
            variante="cuerpo"
            className="mt-4"
          >
            {publicacion.resumen}
          </Texto>

          <Texto
            variante="subtitulo"
            className="mt-4"
          >
            {publicacion.pregunta}
          </Texto>

          <AccionesEngagement publicacion={publicacion} />

          <ListaComentarios
            slugPublicacion={publicacion.slug}
            tituloPublicacion={publicacion.titulo}
            comentarios={
              listaComentarios
            }
            usuarioActual={usuario}
            enviando={enviando}
            onEnviar={crearComentario}
            onEliminar={
              eliminarComentario
            }
            onPerfil={usuarioId =>
              navigation.navigate(
                'PerfilPublico',
                { usuarioId }
              )
            }
          />
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default PantallaDetalle