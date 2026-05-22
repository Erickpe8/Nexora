import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Alert, ScrollView } from 'react-native'
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
import { colores } from '../styles/colores'

const PantallaPerfil = () => {
  const { token, cerrarSesion } = useAutenticacion()
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
      await actualizarPerfil(datos)
      Alert.alert('Perfil actualizado', 'Tus cambios se guardaron correctamente.')
    } catch {
      /* error ya en hook */
    }
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

          {error ? (
            <Texto variante="caption" color={colores.error} className="mt-2">
              {error}
            </Texto>
          ) : null}

          <FormularioEditarPerfil
            perfil={perfil}
            guardando={guardando}
            onGuardar={alGuardarPerfil}
          />

          <HistorialComentarios historial={historial} onPressItem={() => undefined} />

          <Boton variante="secundario" className="mt-6" onPress={manejarCerrarSesion}>
            Cerrar sesión
          </Boton>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default PantallaPerfil
