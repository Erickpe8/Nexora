import React from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParamsPerfil } from '../types/navegacion'
import { CargadorFeed, EstadoVacio, TarjetaPublicacion, Texto } from '../components'
import { useAutenticacion } from '../hooks/useAutenticacion'
import { useGuardados } from '../hooks/useGuardados'
import { irADetallePublicacion } from '../utils/navegacionHistorial'
import { colores } from '../styles/colores'

type Props = NativeStackScreenProps<ParamsPerfil, 'Guardados'>

const PantallaGuardados = ({ navigation }: Props) => {
  const { token } = useAutenticacion()
  const { publicaciones, cargando, soloLeerDespues, setSoloLeerDespues, cargar, cargarMas } = useGuardados(token)

  React.useEffect(() => {
    void cargar(1, true)
  }, [cargar, soloLeerDespues])

  return (
    <SafeAreaView className="flex-1 bg-fondo" edges={['top']}>
      <View className="px-4 pt-3">
        <Texto variante="titulo" className="mb-3">
          Guardados
        </Texto>
        <View className="mb-3 flex-row gap-2">
          <TouchableOpacity
            onPress={() => setSoloLeerDespues(false)}
            className={`rounded-full px-3 py-1 ${!soloLeerDespues ? 'bg-acento' : 'bg-fondoTarjeta'}`}
          >
            <Texto variante="etiqueta" color={!soloLeerDespues ? colores.fondo : colores.textoBase}>
              Todos
            </Texto>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSoloLeerDespues(true)}
            className={`rounded-full px-3 py-1 ${soloLeerDespues ? 'bg-acento' : 'bg-fondoTarjeta'}`}
          >
            <Texto variante="etiqueta" color={soloLeerDespues ? colores.fondo : colores.textoBase}>
              Leer después
            </Texto>
          </TouchableOpacity>
        </View>
      </View>

      {cargando && publicaciones.length === 0 ? (
        <CargadorFeed />
      ) : publicaciones.length === 0 ? (
        <EstadoVacio
          titulo="Sin guardados"
          descripcion="Guarda noticias desde el feed para revisitarlas aquí."
        />
      ) : (
        <FlatList
          data={publicaciones}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          onEndReached={() => void cargarMas()}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => (
            <TarjetaPublicacion
              publicacion={item}
              onPress={() => irADetallePublicacion(navigation, item.id)}
            />
          )}
          ListFooterComponent={cargando ? <CargadorFeed /> : null}
        />
      )}
    </SafeAreaView>
  )
}

export default PantallaGuardados
