import React from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'

import {
  FlatList,
  View,
} from 'react-native'

import {
  Boton,
  EstadoVacio,
  TarjetaNotificacion,
  Texto,
} from '../components'

import { useAutenticacion } from '../hooks/useAutenticacion'

import { useNotificaciones } from '../hooks/useNotificaciones'

import { useNotificacionesEnTiempoReal } from '../hooks/useNotificacionesEnTiempoReal'

import type {
  Notificacion,
} from '../types'

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack'

import type {
  ParamsNotificaciones,
} from '../types/navegacion'

type Props = NativeStackScreenProps<
  ParamsNotificaciones,
  'Notificaciones'
>

const PantallaNotificaciones = ({
  navigation,
}: Props) => {
  const { token } =
    useAutenticacion()

  const {
    notificaciones,
    cargando,
    cargar,
    marcarLeida,
    marcarTodasLeidas,
    agregarLocal,
  } = useNotificaciones(token)

  useNotificacionesEnTiempoReal(
    agregarLocal
  )

  React.useEffect(() => {
    void cargar()
  }, [cargar])

  const manejarPress = async (
    notificacion: Notificacion
  ) => {
    if (!notificacion.leida) {
      await marcarLeida(
        notificacion.id
      )
    }

    if (
      notificacion.publicacionId
    ) {
      navigation.navigate(
        'Notificaciones'
      )
    }
  }

  return (
    <SafeAreaView
      className="flex-1 bg-fondo"
      edges={['top']}
    >
      <View className="flex-1 px-4 pt-4">
        <Texto
          variante="titulo"
          className="mb-3"
        >
          Notificaciones
        </Texto>

        <Boton
          variante="secundario"
          className="mb-3"
          onPress={() =>
            void marcarTodasLeidas()
          }
        >
          Marcar todas como leídas
        </Boton>

        <FlatList
          data={notificaciones}
          keyExtractor={item =>
            String(item.id)
          }
          contentContainerStyle={{
            paddingBottom: 140,
          }}
          showsVerticalScrollIndicator={
            false
          }
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          refreshing={cargando}
          onRefresh={() =>
            void cargar()
          }
          renderItem={({ item }) => (
            <TarjetaNotificacion
              notificacion={item}
              onPress={notificacion =>
                void manejarPress(
                  notificacion
                )
              }
            />
          )}
          ListEmptyComponent={
            <EstadoVacio
              mensaje="Sin notificaciones"
              mensajeSecundario="Aún no tienes actividad nueva"
            />
          }
        />
      </View>
    </SafeAreaView>
  )
}

export default PantallaNotificaciones