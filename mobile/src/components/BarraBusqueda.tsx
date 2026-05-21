import React, { useState, useRef } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { colores } from '../styles/colores'
import { tipografia } from '../styles/tipografia'
import { espaciado } from '../styles/espaciado'
import Texto from './Texto'

interface PropsBarraBusqueda {
  valor: string
  onBuscar: (termino: string) => void
  onLimpiar: () => void
  placeholder?: string
}

const BarraBusqueda = ({
  valor,
  onBuscar,
  onLimpiar,
  placeholder = 'Buscar publicaciones...',
}: PropsBarraBusqueda) => {
  const [texto, setTexto] = useState(valor)
  const inputRef = useRef<TextInput>(null)

  const alEnviar = () => {
    const termino = texto.trim()
    if (termino.length > 0) {
      onBuscar(termino)
    }
  }

  const alLimpiar = () => {
    setTexto('')
    onLimpiar()
    inputRef.current?.blur()
  }

  const alCambiarTexto = (nuevoTexto: string) => {
    setTexto(nuevoTexto)
    if (nuevoTexto.trim() === '') {
      onLimpiar()
    }
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colores.fondoElevado,
        borderRadius: layout.radiosBorde.md,
        borderWidth: 1,
        borderColor: texto.length > 0 ? colores.bordeFoco : colores.borde,
        paddingHorizontal: espaciado.md,
        paddingVertical: espaciado.sm,
        marginHorizontal: espaciado.lg,
        marginBottom: espaciado.sm,
      }}
    >
      {/* Ícono lupa */}
      <Texto
        style={{
          fontSize: tipografia.tamanos.base,
          marginRight: espaciado.sm,
          color: colores.textoSecundario,
        }}
      >
        🔍
      </Texto>

      <TextInput
        ref={inputRef}
        value={texto}
        onChangeText={alCambiarTexto}
        onSubmitEditing={alEnviar}
        placeholder={placeholder}
        placeholderTextColor={colores.textoDeshabilitado}
        returnKeyType="search"
        style={{
          flex: 1,
          fontSize: tipografia.tamanos.sm,
          color: colores.textoBase,
          padding: 0,
        }}
      />

      {texto.length > 0 ? (
        <TouchableOpacity onPress={alLimpiar} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Texto
            style={{
              fontSize: tipografia.tamanos.base,
              color: colores.textoSecundario,
              marginLeft: espaciado.sm,
            }}
          >
            ✕
          </Texto>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

// layout local para no importar todo el módulo
const layout = {
  radiosBorde: { sm: 6, md: 10, lg: 16, xl: 24 },
}

export default BarraBusqueda
