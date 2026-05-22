import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import type { StyleProp, TextStyle } from 'react-native'
import type { TipoReaccion } from '../types'
import { colores } from '../styles/colores'

/** Iconos outline (Ionicons), alineados al estilo Flowbite / Heroicons. */
export type NombreIcono =
  | 'inicio'
  | 'notificaciones'
  | 'perfil'
  | 'buscar'
  | 'cerrar'
  | 'corazon'
  | 'corazon-vacio'
  | 'me-gusta'
  | 'fuego'
  | 'increible'
  | 'curioso'
  | 'ojo'
  | 'ojo-cerrado'
  | 'alerta'
  | 'confirmar'
  | 'guardar'
  | 'guardado'
  | 'compartir'
  | 'leer-despues'

const GLIFOS: Record<NombreIcono, keyof typeof Ionicons.glyphMap> = {
  inicio: 'home-outline',
  notificaciones: 'notifications-outline',
  perfil: 'person-outline',
  buscar: 'search-outline',
  cerrar: 'close-outline',
  corazon: 'heart',
  'corazon-vacio': 'heart-outline',
  'me-gusta': 'thumbs-up-outline',
  fuego: 'flame-outline',
  increible: 'sparkles-outline',
  curioso: 'help-circle-outline',
  ojo: 'eye-outline',
  'ojo-cerrado': 'eye-off-outline',
  alerta: 'alert-circle-outline',
  confirmar: 'checkmark-circle-outline',
  guardar: 'bookmark-outline',
  guardado: 'bookmark',
  compartir: 'share-outline',
  'leer-despues': 'time-outline',
}

export const iconoPorReaccion = (tipo: TipoReaccion): NombreIcono => {
  const mapa: Record<TipoReaccion, NombreIcono> = {
    me_gusta: 'me-gusta',
    fuego: 'fuego',
    mente_explotada: 'increible',
    curioso: 'curioso',
  }
  return mapa[tipo]
}

interface PropsIcono {
  nombre: NombreIcono
  tamano?: number
  color?: string
  /** Para tabs: opacidad reducida cuando no está activo. */
  enfocado?: boolean
  style?: StyleProp<TextStyle>
}

const Icono = ({
  nombre,
  tamano = 22,
  color = colores.textoSecundario,
  enfocado,
  style,
}: PropsIcono) => (
  <Ionicons
    name={GLIFOS[nombre]}
    size={tamano}
    color={color}
    style={[{ opacity: enfocado === undefined ? 1 : enfocado ? 1 : 0.5 }, style]}
  />
)

export default Icono
