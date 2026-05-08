import React from 'react'
import { View, SafeAreaView, FlatList } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParamsFeed } from '../types/navegacion'
import { BannerNuevasPublicaciones, CargadorFeed, EstadoVacio, TarjetaPublicacion, Texto } from '../components'
import { useAutenticacion } from '../hooks/useAutenticacion'
import { useFeed } from '../hooks/useFeed'
import { usePublicacionesNuevas } from '../hooks/usePublicacionesNuevas'

type Props = NativeStackScreenProps<ParamsFeed, 'Feed'>

const PantallaFeed = ({ navigation }: Props) => {
  const { token } = useAutenticacion()
  const { publicaciones, cargando, error, cargar, cargarMas, refrescar, hayMas } = useFeed(token)
  const { hayNuevas, cantidad, limpiar } = usePublicacionesNuevas()

  React.useEffect(() => {
    void cargar()
  }, [cargar])

  return (
    <SafeAreaView className="flex-1 bg-fondo">
      <Texto variante="titulo" className="px-4 pt-4 pb-2">Nexora</Texto>

      {hayNuevas ? (
        <BannerNuevasPublicaciones
          cantidad={cantidad}
          onPress={() => {
            limpiar()
            void refrescar()
          }}
        />
      ) : null}

      {cargando && publicaciones.length === 0 ? (
        <CargadorFeed />
      ) : (
        <FlatList
          data={publicaciones}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TarjetaPublicacion publicacion={item} onPress={() => navigation.navigate('Detalle', { publicacionId: item.id })} />
          )}
          onEndReached={() => {
            if (hayMas) void cargarMas()
          }}
          onEndReachedThreshold={0.5}
          onRefresh={() => void refrescar()}
          refreshing={cargando}
          ListEmptyComponent={
            <View className="mt-10">
              <EstadoVacio mensaje={error ? 'Error al cargar feed' : 'No hay publicaciones aún'} />
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

export default PantallaFeed
