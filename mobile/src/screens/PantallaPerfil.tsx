import React from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'

import {
  Alert,
  ScrollView,
} from 'react-native'

import {
  Boton,
  CabeceraPerfil,
  Cargador,
  EstadisticasPerfil,
  FormularioEditarNombre,
  HistorialComentarios,
  Texto,
} from '../components'

import { useAutenticacion } from '../hooks/useAutenticacion'

import { usePerfil } from '../hooks/usePerfil'

import { useHistorialComentarios } from '../hooks/useHistorialComentarios'

const PantallaPerfil = () => {
  const {
    usuario,
    token,
    cerrarSesion,
  } = useAutenticacion()

  const {
    perfil,
    cargando,
    guardando,
    cargar,
    actualizarNombre,
  } = usePerfil(token)

  const {
    historial,
    cargar: cargarHistorial,
  } = useHistorialComentarios(token)

  React.useEffect(() => {
    void cargar()
  }, [cargar])

  React.useEffect(() => {
    if (perfil) {
      void cargarHistorial(
        perfil.id
      )
    }
  }, [perfil, cargarHistorial])

  const manejarCerrarSesion =
    () => {
      Alert.alert(
        'Cerrar sesión',
        '¿Deseas cerrar tu sesión?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Cerrar sesión',
            style: 'destructive',
            onPress: () =>
              void cerrarSesion(),
          },
        ]
      )
    }

  return (
    <SafeAreaView
      className="flex-1 bg-fondo"
      edges={['top']}
    >
      {cargando || !perfil ? (
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
          <Texto
            variante="titulo"
            className="mb-3"
          >
            Mi perfil
          </Texto>

          <CabeceraPerfil
            nombre={perfil.nombre}
            creadoEn={perfil.creadoEn}
          />

          <Texto
            variante="caption"
            className="mt-2"
          >
            Correo:
            {' '}
            {perfil.correo}
          </Texto>

          <EstadisticasPerfil
            totalComentarios={
              perfil.totalComentarios
            }
          />

          <FormularioEditarNombre
            nombreActual={
              usuario?.nombre ??
              perfil.nombre
            }
            guardando={guardando}
            onGuardar={
              actualizarNombre
            }
          />

          <HistorialComentarios
            historial={historial}
            onPressItem={() =>
              undefined
            }
          />

          <Boton
            variante="secundario"
            className="mt-6"
            onPress={
              manejarCerrarSesion
            }
          >
            Cerrar sesión
          </Boton>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default PantallaPerfil