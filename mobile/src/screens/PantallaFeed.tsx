import React from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'

import {
  View,
  FlatList,
} from 'react-native'

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack'

import type {
  ParamsFeed,
} from '../types/navegacion'

import {
  BannerNuevasPublicaciones,
  BarraBusqueda,
  CargadorFeed,
  EstadoVacio,
  TarjetaPublicacion,
  Texto,
} from '../components'

import { useAutenticacion } from '../hooks/useAutenticacion'

import { useFeed } from '../hooks/useFeed'

import { usePublicacionesNuevas } from '../hooks/usePublicacionesNuevas'
import { usePollingSinSocket } from '../hooks/usePollingSinSocket'

type Props = NativeStackScreenProps<
  ParamsFeed,
  'Feed'
>

const PantallaFeed = ({
  navigation,
}: Props) => {
  const { token } =
    useAutenticacion()

  const {
    publicaciones,
    cargando,
    error,
    cargar,
    cargarMas,
    refrescar,
    hayMas,
    terminoBusqueda,
    buscar,
    limpiarBusqueda,
  } = useFeed(token)

  const primeraId = publicaciones[0]?.id
  const {
    hayNuevas,
    cantidad,
    limpiar,
  } = usePublicacionesNuevas(token, primeraId, Boolean(terminoBusqueda))

  React.useEffect(() => {
    void cargar()
  }, [cargar])

  usePollingSinSocket(
    () => {
      if (!terminoBusqueda) void refrescar()
    },
    60_000,
    Boolean(token)
  )

  return (
    <SafeAreaView
      className="flex-1 bg-fondo"
      edges={['top']}
    >
      <Texto
        variante="titulo"
        className="px-4 pt-4 pb-2"
      >
        Nexora
      </Texto>

      <BarraBusqueda
        valor={terminoBusqueda}
        onBuscar={termino =>
          void buscar(termino)
        }
        onLimpiar={() =>
          void limpiarBusqueda()
        }
      />

      {hayNuevas &&
      !terminoBusqueda ? (
        <BannerNuevasPublicaciones
          cantidad={cantidad}
          onPress={() => {
            limpiar()
            void refrescar()
          }}
        />
      ) : null}

      {cargando &&
      publicaciones.length === 0 ? (
        <CargadorFeed />
      ) : (
        <FlatList
          data={publicaciones}
          keyExtractor={item =>
            String(item.id)
          }
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 140,
          }}
          showsVerticalScrollIndicator={
            false
          }
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TarjetaPublicacion
              publicacion={item}
              onPress={() =>
                navigation.navigate(
                  'Detalle',
                  {
                    publicacionId:
                      item.id,
                  }
                )
              }
            />
          )}
          onEndReached={() => {
            if (hayMas) {
              void cargarMas()
            }
          }}
          onEndReachedThreshold={0.5}
          onRefresh={() =>
            void refrescar()
          }
          refreshing={cargando}
          ListEmptyComponent={
            <View className="mt-10">
              <EstadoVacio
                mensaje={
                  error
                    ? 'Error al cargar feed'
                    : terminoBusqueda
                    ? `Sin resultados para "${terminoBusqueda}"`
                    : 'No hay publicaciones aún'
                }
              />
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

export default PantallaFeed