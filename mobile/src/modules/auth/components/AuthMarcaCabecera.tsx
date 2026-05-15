import React from 'react'
import { View } from 'react-native'
import Texto from '../../../components/Texto'

interface Props {
  titulo: string
  subtitulo: string
}

export const AuthMarcaCabecera = ({ titulo, subtitulo }: Props) => (
  <View>
    <View className="mb-3 self-start rounded-2xl bg-auth-elevated px-3 py-1.5 shadow-sm shadow-black/40">
      <Texto variante="caption" className="font-semibold uppercase tracking-widest text-acento">
        Nexora
      </Texto>
    </View>
    <Texto variante="titulo" className="text-3xl font-bold tracking-tight text-base">
      {titulo}
    </Texto>
    <Texto variante="caption" className="mt-2 max-w-sm text-base leading-5 text-auth-muted">
      {subtitulo}
    </Texto>
  </View>
)
