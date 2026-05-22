import React, { useState } from 'react'
import {
  View,
  TextInput,
  TextInputProps,
  Pressable,
  Platform,
} from 'react-native'
import Texto from '../../../components/Texto'
import Icono from '../../../components/Icono'

type TipoCampo = 'texto' | 'email' | 'contrasena'

interface Props extends Omit<TextInputProps, 'secureTextEntry'> {
  etiqueta: string
  tipo?: TipoCampo
  error?: string
  indicadorFuerza?: React.ReactNode
}

const altura = Platform.select({ web: 52, default: 52 })

export const AuthCampoTexto = ({
  etiqueta,
  tipo = 'texto',
  error,
  indicadorFuerza,
  editable = true,
  className,
  ...props
}: Props) => {
  const [enfocado, setEnfocado] = useState(false)
  const [mostrar, setMostrar] = useState(false)
  const esPass = tipo === 'contrasena'
  const esEmail = tipo === 'email'
  const deshabilitado = editable === false

  const borde = error
    ? 'border-error/80'
    : enfocado
      ? 'border-acento'
      : 'border-auth-stroke'

  return (
    <View className={`mb-5 ${className ?? ''}`}>
      <Texto variante="etiqueta" className="mb-2 font-medium text-auth-subtle">
        {etiqueta}
      </Texto>
      <View
        className={`flex-row items-stretch overflow-hidden rounded-2xl border bg-auth-surface shadow-sm shadow-black/30 ${borde} ${
          deshabilitado ? 'opacity-50' : ''
        }`}
        style={{ minHeight: altura }}
      >
        <TextInput
          className="flex-1 px-4 py-3.5 text-base text-base"
          placeholderTextColor="#71717a"
          editable={editable}
          secureTextEntry={esPass && !mostrar}
          keyboardType={esEmail ? 'email-address' : 'default'}
          autoCapitalize={esEmail || esPass ? 'none' : 'sentences'}
          autoCorrect={false}
          textContentType={esPass ? 'password' : esEmail ? 'emailAddress' : 'none'}
          onFocus={() => setEnfocado(true)}
          onBlur={() => setEnfocado(false)}
          {...props}
        />
        {esPass ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onPress={() => setMostrar(m => !m)}
            className="justify-center border-l border-auth-stroke px-3 active:bg-auth-elevated"
          >
            <Icono nombre={mostrar ? 'ojo-cerrado' : 'ojo'} tamano={22} color="#a1a1aa" />
          </Pressable>
        ) : null}
      </View>
      {indicadorFuerza}
      {error ? (
        <View className="mt-2 flex-row items-start gap-1.5 rounded-xl bg-error/10 px-3 py-2">
          <Icono nombre="alerta" tamano={16} color="#f87171" />
          <Texto variante="caption" className="flex-1 leading-5 text-red-300">
            {error}
          </Texto>
        </View>
      ) : null}
    </View>
  )
}
