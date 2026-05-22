import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Alert, ScrollView } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParamsPerfil } from '../types/navegacion'
import {
  Boton,
  CabeceraPerfil,
  Cargador,
  EnlacesRedesSociales,
  EstadisticasPerfil,
  FormularioEditarPerfil,
  HistorialComentarios,
  Texto,
} from '../components'
import { useAutenticacion } from '../hooks/useAutenticacion'
import { usePerfil } from '../hooks/usePerfil'
import { useHistorialComentarios } from '../hooks/useHistorialComentarios'
import { irADetallePublicacion } from '../utils/navegacionHistorial'
import { colores } from '../styles/colores'

type Props = NativeStackScreenProps<ParamsPerfil, 'Perfil'>

const PantallaPerfil = ({ navigation }: Props) => {
  const { token, actualizarUsuario, cerrarSesion } = useAutenticacion()
  const { perfil, cargando, guardando, error, cargar, actualizarPerfil } = usePerfil(token)
  const { historial, cargar: cargarHistorial } = useHistorialComentarios(token)

  React.useEffect(() => {
    void cargar()
  }, [cargar])

  React.useEffect(() => {
    if (perfil) {
      void cargarHistorial(perfil.id)
    }
  }, [perfil, cargarHistorial])

  const manejarCerrarSesion = () => {
    Alert.alert('Cerrar sesión', '¿Deseas cerrar tu sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => void cerrarSesion() },
    ])
  }

  const alGuardarPerfil = async (datos: Parameters<typeof actualizarPerfil>[0]) => {
    try {
      const actualizado = await actualizarPerfil(datos)
      await actualizarUsuario({ nombre: actualizado.nombre, username: actualizado.username })
      Alert.alert('Perfil actualizado', 'Tus cambios se guardaron correctamente.')
    } catch {
      /* error en hook */
    }
  }

  const alFotoSubida = async (nuevo: { nombre: string }) => {
    await actualizarUsuario({ nombre: nuevo.nombre })
    void cargar()
  }

  return (
    <SafeAreaView className="flex-1 bg-fondo" edges={['top']}>
      {cargando || !perfil ? (
        <Cargador centrado />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Texto variante="titulo" className="mb-3">
            Mi perfil
          </Texto>

          <CabeceraPerfil
            nombre={perfil.nombre}
            username={perfil.username}
            creadoEn={perfil.creadoEn}
            fotoPerfilUrl={perfil.fotoPerfilUrl}
            biografia={perfil.biografia}
            fechaNacimiento={perfil.fechaNacimiento}
          />

          <Texto variante="caption" className="mt-2">
            Correo: {perfil.correo}
          </Texto>

          <EnlacesRedesSociales redes={perfil.redesSociales} />

          <EstadisticasPerfil totalComentarios={perfil.totalComentarios} />

          <Boton className="mt-4" onPress={() => navigation.navigate('Guardados')}>
            Mis guardados
          </Boton>

          {perfil.esModerador ? (
            <Boton className="mt-4" onPress={() => navigation.navigate('Moderacion')}>
              Panel de moderación
            </Boton>
          ) : null}

          {error ? (
            <Texto variante="caption" color={colores.error} className="mt-2">
              {error}
            </Texto>
          ) : null}

          <FormularioEditarPerfil
            perfil={perfil}
            token={token}
            guardando={guardando}
            onGuardar={alGuardarPerfil}
            onFotoSubida={alFotoSubida}
          />

          <HistorialComentarios
            historial={historial}
            onPressItem={publicacionId => irADetallePublicacion(navigation, publicacionId)}
          />

          <Boton variante="secundario" className="mt-6" onPress={manejarCerrarSesion}>
            Cerrar sesión
          </Boton>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default PantallaPerfil
