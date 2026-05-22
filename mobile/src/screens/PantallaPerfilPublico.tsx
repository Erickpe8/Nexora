import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParamsDetalleYPerfil } from '../types/navegacion'
import {
  CabeceraPerfil,
  Cargador,
  EnlacesRedesSociales,
  EstadisticasPerfil,
  HistorialComentarios,
  Texto,
} from '../components'
import type { PerfilPublico } from '../types'
import { useAutenticacion } from '../hooks/useAutenticacion'
import { servicioPerfil } from '../services/servicioPerfil'
import { useHistorialComentarios } from '../hooks/useHistorialComentarios'
import { irADetallePublicacion } from '../utils/navegacionHistorial'

type Props = NativeStackScreenProps<ParamsDetalleYPerfil, 'PerfilPublico'>

const PantallaPerfilPublico = ({ route, navigation }: Props) => {
  const { token } = useAutenticacion()
  const [perfil, setPerfil] = React.useState<PerfilPublico | null>(null)
  const [cargando, setCargando] = React.useState(false)
  const { historial, cargar } = useHistorialComentarios(token)

  React.useEffect(() => {
    const obtener = async () => {
      if (!token) return
      setCargando(true)
      try {
        const datos = await servicioPerfil.obtenerPerfilPublico(token, route.params.usuarioId)
        setPerfil(datos)
        await cargar(route.params.usuarioId)
      } finally {
        setCargando(false)
      }
    }
    void obtener()
  }, [token, route.params.usuarioId, cargar])

  return (
    <SafeAreaView className="flex-1 bg-fondo" edges={['top']}>
      {cargando || !perfil ? (
        <Cargador centrado />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          <Texto variante="titulo" className="mb-3">
            Perfil público
          </Texto>

          <CabeceraPerfil
            nombre={perfil.nombre}
            username={perfil.username}
            creadoEn={perfil.creadoEn}
            fotoPerfilUrl={perfil.fotoPerfilUrl}
            biografia={perfil.biografia}
            fechaNacimiento={perfil.fechaNacimiento}
          />

          <EnlacesRedesSociales redes={perfil.redesSociales} />

          <EstadisticasPerfil totalComentarios={perfil.totalComentarios} />

          <HistorialComentarios
            historial={historial}
            onPressItem={publicacionId => irADetallePublicacion(navigation, publicacionId)}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default PantallaPerfilPublico
