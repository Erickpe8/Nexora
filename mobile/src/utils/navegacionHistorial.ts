import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ParamsDetalleYPerfil } from '../types/navegacion'

type NavConDetalle = NativeStackNavigationProp<ParamsDetalleYPerfil>

export const irADetallePublicacion = (
  navigation: NavConDetalle,
  publicacionId: number
): void => {
  navigation.navigate('Detalle', { publicacionId })
}
