import React from 'react'
import { Text, TextProps } from 'react-native'

type VarianteTexto = 'titulo' | 'subtitulo' | 'cuerpo' | 'caption' | 'etiqueta'

interface PropsTexto extends TextProps {
  variante?: VarianteTexto
  color?: string
  centrado?: boolean
  children: React.ReactNode
}

// Clases NativeWind por variante
const clasesPorVariante: Record<VarianteTexto, string> = {
  titulo:    'text-2xl font-bold text-base',
  subtitulo: 'text-xl font-semibold text-base',
  cuerpo:    'text-base font-normal text-base',
  caption:   'text-sm font-normal text-secundario',
  etiqueta:  'text-xs font-medium text-secundario',
}

const Texto = ({
  variante = 'cuerpo',
  color,
  centrado = false,
  children,
  className,
  style,
  ...props
}: PropsTexto) => {
  const claseVariante = clasesPorVariante[variante]
  const claseCentrado = centrado ? 'text-center' : ''

  return (
    <Text
      className={`${claseVariante} ${claseCentrado} ${className ?? ''}`}
      style={[color ? { color } : undefined, style]}
      {...props}
    >
      {children}
    </Text>
  )
}

export default Texto
