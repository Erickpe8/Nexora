import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Alert, FlatList, View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParamsPerfil } from '../types/navegacion'
import type { Denuncia } from '../types'
import { Boton, Cargador, Insignia, Texto, Tarjeta } from '../components'
import { useAutenticacion } from '../hooks/useAutenticacion'
import { servicioModeracion } from '../services/servicioModeracion'
import { colores } from '../styles/colores'
import { irADetallePublicacion } from '../utils/navegacionHistorial'

type Props = NativeStackScreenProps<ParamsPerfil, 'Moderacion'>

const etiquetaEstado = (estado: string): string => {
  const mapa: Record<string, string> = {
    pendiente: 'Pendiente',
    revisada: 'Revisada',
    resuelta: 'Resuelta',
    descartada: 'Descartada',
  }
  return mapa[estado] ?? estado
}

const PantallaModeracion = ({ navigation }: Props) => {
  const { token } = useAutenticacion()
  const [denuncias, setDenuncias] = React.useState<Denuncia[]>([])
  const [cargando, setCargando] = React.useState(true)
  const [procesandoId, setProcesandoId] = React.useState<number | null>(null)

  const cargar = React.useCallback(async () => {
    if (!token) return
    setCargando(true)
    try {
      const resp = await servicioModeracion.listarDenuncias(token, 1, 'pendiente')
      setDenuncias(resp.denuncias)
    } catch {
      Alert.alert('Error', 'No se pudieron cargar las denuncias')
    } finally {
      setCargando(false)
    }
  }, [token])

  React.useEffect(() => {
    void cargar()
  }, [cargar])

  const moderar = async (comentarioId: number, accion: 'oculto' | 'visible') => {
    if (!token) return
    setProcesandoId(comentarioId)
    try {
      await servicioModeracion.moderarComentario(token, comentarioId, accion)
      setDenuncias(prev => prev.filter(d => d.objetivoId !== comentarioId))
      Alert.alert('Listo', accion === 'oculto' ? 'Comentario ocultado' : 'Comentario restaurado')
    } catch {
      Alert.alert('Error', 'No se pudo aplicar la acción de moderación')
    } finally {
      setProcesandoId(null)
    }
  }

  const renderItem = ({ item }: { item: Denuncia }) => (
    <Tarjeta className="mb-3">
      <View className="flex-row justify-between items-center mb-2">
        <Insignia texto={etiquetaEstado(item.estado)} />
        <Texto variante="caption">{new Date(item.creadoEn).toLocaleString('es')}</Texto>
      </View>
      <Texto variante="etiqueta">Comentario #{item.objetivoId}</Texto>
      <Texto variante="cuerpo" className="mt-1">
        Motivo: {item.motivo}
      </Texto>
      {item.detalle ? (
        <Texto variante="caption" color={colores.textoSecundario} className="mt-1">
          {item.detalle}
        </Texto>
      ) : null}
      <View className="flex-row gap-2 mt-3">
        <Boton
          variante="secundario"
          className="flex-1"
          cargando={procesandoId === item.objetivoId}
          onPress={() => void moderar(item.objetivoId, 'oculto')}
        >
          Ocultar
        </Boton>
        <Boton
          variante="secundario"
          className="flex-1"
          onPress={() => void moderar(item.objetivoId, 'visible')}
        >
          Restaurar
        </Boton>
      </View>
      {item.publicacionId ? (
        <Boton
          variante="secundario"
          className="mt-2"
          onPress={() => irADetallePublicacion(navigation, item.publicacionId!)}
        >
          Ver publicación
        </Boton>
      ) : null}
    </Tarjeta>
  )

  return (
    <SafeAreaView className="flex-1 bg-fondo" edges={['top']}>
      {cargando ? (
        <Cargador centrado />
      ) : (
        <FlatList
          data={denuncias}
          keyExtractor={d => String(d.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
          ListHeaderComponent={
            <Texto variante="titulo" className="mb-3">
              Denuncias pendientes
            </Texto>
          }
          ListEmptyComponent={
            <Texto variante="caption" color={colores.textoSecundario}>
              No hay denuncias pendientes
            </Texto>
          }
          renderItem={renderItem}
          onRefresh={() => void cargar()}
          refreshing={cargando}
        />
      )}
    </SafeAreaView>
  )
}

export default PantallaModeracion
