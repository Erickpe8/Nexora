import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native'
import Texto from './Texto'
import Icono from './Icono'

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
        className={`flex-row items-center bg-elevado rounded-xl px-4 border ${
          error ? 'border-error' : enfocado ? 'border-borde-foco' : 'border-borde'
        }`}
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
            accessibilityRole="button"
            accessibilityLabel={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <Icono
              nombre={mostrarContrasena ? 'ojo-cerrado' : 'ojo'}
              tamano={20}
              color="#9A9A9A"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View className="mt-1 flex-row items-center gap-1">
          <Icono nombre="alerta" tamano={14} color="#F44336" />
          <Texto variante="caption" color="#F44336" className="flex-1">
            {error}
          </Texto>
        </View>
      )}
    </View>
  )
}

export default Entrada
