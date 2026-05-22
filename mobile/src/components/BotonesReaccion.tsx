import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import type { TipoReaccion } from '../types'
import { colores } from '../styles/colores'
import { espaciado } from '../styles/espaciado'
import Texto from './Texto'
import Icono, { iconoPorReaccion } from './Icono'

const REACCIONES: { tipo: TipoReaccion; etiqueta: string }[] = [
  { tipo: 'me_gusta', etiqueta: 'Me gusta' },
  { tipo: 'fuego', etiqueta: 'Fuego' },
  { tipo: 'mente_explotada', etiqueta: 'Increíble' },
  { tipo: 'curioso', etiqueta: 'Curioso' },
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
      {REACCIONES.map(({ tipo, etiqueta }) => {
        const activo = miReaccion === tipo
        return (
          <TouchableOpacity
            key={tipo}
            onPress={() => onAlternar(tipo)}
            disabled={enviando}
            accessibilityRole="button"
            accessibilityLabel={etiqueta}
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
            <Icono
              nombre={iconoPorReaccion(tipo)}
              tamano={18}
              color={activo ? colores.acento : colores.textoSecundario}
            />
          </TouchableOpacity>
        )
      })}

      {total > 0 ? (
        <Texto
          style={{
            fontSize: 12,
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
