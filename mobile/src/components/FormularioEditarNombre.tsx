import React, { useState } from 'react'
import { View } from 'react-native'
import Boton from './Boton'
import Entrada from './Entrada'

interface PropsFormularioEditarNombre {
  nombreActual: string
  guardando: boolean
  onGuardar: (nombre: string) => Promise<void>
}

const FormularioEditarNombre = ({ nombreActual, guardando, onGuardar }: PropsFormularioEditarNombre) => {
  const [nombre, setNombre] = useState(nombreActual)

  return (
    <View className="mt-4">
      <Entrada etiqueta="Editar nombre" value={nombre} onChangeText={setNombre} />
      <Boton cargando={guardando} onPress={() => void onGuardar(nombre)}>
        Guardar nombre
      </Boton>
    </View>
  )
}

export default FormularioEditarNombre
