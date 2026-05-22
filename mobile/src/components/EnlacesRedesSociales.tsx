import React from 'react'
import { Linking, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { RedesSociales } from '../types/perfil'
import Texto from './Texto'
import { colores } from '../styles/colores'
import { espaciado } from '../styles/espaciado'

type ClaveRed = keyof RedesSociales

const CONFIG_REDES: { clave: ClaveRed; etiqueta: string; icono: keyof typeof Ionicons.glyphMap }[] = [
  { clave: 'github', etiqueta: 'GitHub', icono: 'logo-github' },
  { clave: 'linkedin', etiqueta: 'LinkedIn', icono: 'logo-linkedin' },
  { clave: 'x', etiqueta: 'X', icono: 'logo-twitter' },
  { clave: 'instagram', etiqueta: 'Instagram', icono: 'logo-instagram' },
  { clave: 'facebook', etiqueta: 'Facebook', icono: 'logo-facebook' },
  { clave: 'tiktok', etiqueta: 'TikTok', icono: 'logo-tiktok' },
  { clave: 'youtube', etiqueta: 'YouTube', icono: 'logo-youtube' },
  { clave: 'web', etiqueta: 'Sitio web', icono: 'globe-outline' },
]

interface PropsEnlacesRedesSociales {
  redes: RedesSociales
  titulo?: string
}

const EnlacesRedesSociales = ({ redes, titulo = 'Redes sociales' }: PropsEnlacesRedesSociales) => {
  const enlaces = CONFIG_REDES.filter(({ clave }) => Boolean(redes[clave]?.trim()))

  if (enlaces.length === 0) {
    return (
      <View className="mt-4">
        <Texto variante="etiqueta" color={colores.textoSecundario}>
          {titulo}
        </Texto>
        <Texto variante="caption" className="mt-2">
          Sin enlaces públicos
        </Texto>
      </View>
    )
  }

  return (
    <View className="mt-4">
      <Texto variante="etiqueta" className="mb-2">
        {titulo}
      </Texto>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: espaciado.sm }}>
        {enlaces.map(({ clave, etiqueta, icono }) => (
          <TouchableOpacity
            key={clave}
            onPress={() => void Linking.openURL(redes[clave]!.trim())}
            accessibilityRole="link"
            accessibilityLabel={`Abrir ${etiqueta}`}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: espaciado.md,
              paddingVertical: espaciado.sm,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colores.borde,
              backgroundColor: colores.fondoElevado,
              gap: espaciado.xs,
            }}
          >
            <Ionicons name={icono} size={18} color={colores.acento} />
            <Texto variante="caption">{etiqueta}</Texto>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default EnlacesRedesSociales
