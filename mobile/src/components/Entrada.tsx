import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native'
import Texto from './Texto'

type TipoEntrada = 'texto' | 'contrasena' | 'email'

interface PropsEntrada extends Omit<TextInputProps, 'secureTextEntry'> {
  etiqueta?: string
  error?: string
  tipo?: TipoEntrada
}

const Entrada = ({
  etiqueta,
  error,
  tipo = 'texto',
  className,
  ...props
}: PropsEntrada) => {
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [enfocado, setEnfocado] = useState(false)

  const esContrasena = tipo === 'contrasena'
  const esEmail = tipo === 'email'

  return (
    <View className="mb-4">
      {etiqueta && (
        <Texto variante="etiqueta" className="mb-1 text-secundario">
          {etiqueta}
        </Texto>
      )}

      <View
        className={`
          flex-row items-center
          bg-elevado rounded-xl px-4
          border
          ${enfocado ? 'border-borde-foco' : 'border-borde'}
          ${error ? 'border-error' : ''}
        `}
      >
        <TextInput
          className={`flex-1 py-3 text-base text-base ${className ?? ''}`}
          placeholderTextColor="#555555"
          secureTextEntry={esContrasena && !mostrarContrasena}
          keyboardType={esEmail ? 'email-address' : 'default'}
          autoCapitalize={esEmail || esContrasena ? 'none' : 'sentences'}
          autoCorrect={false}
          onFocus={() => setEnfocado(true)}
          onBlur={() => setEnfocado(false)}
          {...props}
        />

        {esContrasena && (
          <TouchableOpacity
            onPress={() => setMostrarContrasena(!mostrarContrasena)}
            activeOpacity={0.7}
            className="pl-2"
          >
            <Texto variante="caption" color="#9A9A9A">
              {mostrarContrasena ? 'Ocultar' : 'Ver'}
            </Texto>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Texto variante="caption" color="#F44336" className="mt-1">
          {error}
        </Texto>
      )}
    </View>
  )
}

export default Entrada
