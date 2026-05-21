import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import type { TipoReaccion } from '../types'
import { colores } from '../styles/colores'
import { tipografia } from '../styles/tipografia'
import { espaciado } from '../styles/espaciado'
import Texto from './Texto'

const REACCIONES: { tipo: TipoReaccion; emoji: string; etiqueta: string }[] = [
  { tipo: 'me_gusta',       emoji: '👍', etiqueta: 'Me gusta' },
  { tipo: 'fuego',          emoji: '🔥', etiqueta: 'Fuego' },
  { tipo: 'mente_explotada', emoji: '🤯', etiqueta: 'Increíble' },
  { tipo: 'curioso',        emoji: '🤔', etiqueta: 'Curioso' },
]

interface PropsBotonesReaccion {
  miReaccion: TipoReaccion | null
  total: number
  enviando: boolean
  onAlternar: (tipo: TipoReaccion) => void
}

const BotonesReaccion = ({ miReaccion, total, enviando, onAlternar }: PropsBotonesReaccion) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: espaciado.xs,
        marginTop: espaciado.sm,
      }}
    >
      {REACCIONES.map(({ tipo, emoji }) => {
        const activo = miReaccion === tipo
        return (
          <TouchableOpacity
            key={tipo}
            onPress={() => onAlternar(tipo)}
            disabled={enviando}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: espaciado.sm,
              paddingVertical: espaciado.xs,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: activo ? colores.acento : colores.borde,
              backgroundColor: activo ? `${colores.acento}22` : colores.fondoElevado,
              opacity: enviando ? 0.6 : 1,
            }}
          >
            <Texto style={{ fontSize: tipografia.tamanos.base }}>{emoji}</Texto>
          </TouchableOpacity>
        )
      })}

      {total > 0 ? (
        <Texto
          style={{
            fontSize: tipografia.tamanos.xs,
            color: colores.textoSecundario,
            marginLeft: espaciado.xs,
          }}
        >
          {total} {total === 1 ? 'reacción' : 'reacciones'}
        </Texto>
      ) : null}
    </View>
  )
}

export default BotonesReaccion
