import React from 'react'
import { View } from 'react-native'
import Texto from './Texto'

type VarianteInsignia = 'acento' | 'exito' | 'error' | 'info'

interface PropsInsignia {
  texto: string
  variante?: VarianteInsignia
}

const clasesFondo: Record<VarianteInsignia, string> = {
  acento: 'bg-acento/20',
  exito:  'bg-exito/20',
  error:  'bg-error/20',
  info:   'bg-info/20',
}

const coloresTexto: Record<VarianteInsignia, string> = {
  acento: '#6C63FF',
  exito:  '#4CAF50',
  error:  '#F44336',
  info:   '#2196F3',
}

const Insignia = ({ texto, variante = 'acento' }: PropsInsignia) => {
  return (
    <View className={`px-2 py-1 rounded-md self-start ${clasesFondo[variante]}`}>
      <Texto variante="etiqueta" color={coloresTexto[variante]}>
        {texto}
      </Texto>
    </View>
  )
}

export default Insignia
