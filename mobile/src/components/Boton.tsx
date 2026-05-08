import React from 'react'
import { TouchableOpacity, ActivityIndicator, TouchableOpacityProps } from 'react-native'
import Texto from './Texto'

type VarianteBoton = 'primario' | 'secundario' | 'fantasma' | 'peligro'
type TamanoBoton = 'sm' | 'md' | 'lg'

interface PropsBoton extends TouchableOpacityProps {
  variante?: VarianteBoton
  tamano?: TamanoBoton
  cargando?: boolean
  children: React.ReactNode
}

const clasesFondo: Record<VarianteBoton, string> = {
  primario:   'bg-acento',
  secundario: 'bg-elevado border border-borde',
  fantasma:   'bg-transparent',
  peligro:    'bg-error',
}

const clasesTexto: Record<VarianteBoton, string> = {
  primario:   'text-white',
  secundario: 'text-base',
  fantasma:   'text-acento',
  peligro:    'text-white',
}

const clasesTamano: Record<TamanoBoton, string> = {
  sm: 'px-3 py-2 rounded-lg',
  md: 'px-5 py-3 rounded-xl',
  lg: 'px-6 py-4 rounded-xl',
}

const tamanoTexto: Record<TamanoBoton, 'caption' | 'cuerpo' | 'subtitulo'> = {
  sm: 'caption',
  md: 'cuerpo',
  lg: 'subtitulo',
}

const Boton = ({
  variante = 'primario',
  tamano = 'md',
  cargando = false,
  disabled,
  children,
  className,
  ...props
}: PropsBoton) => {
  const estaDeshabilitado = disabled || cargando

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={estaDeshabilitado}
      className={`
        flex-row items-center justify-center
        ${clasesFondo[variante]}
        ${clasesTamano[tamano]}
        ${estaDeshabilitado ? 'opacity-50' : ''}
        ${className ?? ''}
      `}
      {...props}
    >
      {cargando ? (
        <ActivityIndicator size="small" color="#F0F0F0" />
      ) : (
        <Texto
          variante={tamanoTexto[tamano]}
          color={variante === 'fantasma' ? '#6C63FF' : '#F0F0F0'}
          className="font-semibold"
        >
          {children}
        </Texto>
      )}
    </TouchableOpacity>
  )
}

export default Boton
