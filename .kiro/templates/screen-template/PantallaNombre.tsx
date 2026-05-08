import React from 'react'
import { View, FlatList, SafeAreaView } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParamsFeed } from '@/types/navegacion'
import { RUTAS } from '@/navigation/rutas'
import use[Nombre] from '@/hooks/use[Nombre]'
import [NombreComponente] from '@/components/[NombreComponente]'
import { CargadorFeed } from '@/components/CargadorFeed'
import { EstadoVacio } from '@/components/EstadoVacio'
import { Texto } from '@/components/Texto'

// Tipo de props de navegación para esta pantalla
type Props = NativeStackScreenProps<ParamsFeed, typeof RUTAS.[NOMBRE_RUTA]>

/**
 * Pantalla[Nombre] — [descripción breve de qué muestra esta pantalla]
 *
 * Responsabilidad: orquestar la UI y delegar lógica al hook use[Nombre].
 */
const Pantalla[Nombre] = ({ navigation, route }: Props) => {
  const { datos, cargando, error, cargar } = use[Nombre]()

  if (cargando) {
    return <CargadorFeed />
  }

  if (error) {
    return (
      <EstadoVacio
        mensaje="Ocurrió un error al cargar"
        accion={{ texto: 'Reintentar', onPress: cargar }}
      />
    )
  }

  if (!datos || datos.length === 0) {
    return <EstadoVacio mensaje="No hay contenido disponible" />
  }

  return (
    <SafeAreaView className="flex-1 bg-fondo">
      <FlatList
        data={datos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
        renderItem={({ item }) => (
          <[NombreComponente]
            datos={item}
            onPress={() => navigation.navigate(RUTAS.[OTRA_RUTA], { id: item.id })}
          />
        )}
        onRefresh={cargar}
        refreshing={cargando}
      />
    </SafeAreaView>
  )
}

export default Pantalla[Nombre]
