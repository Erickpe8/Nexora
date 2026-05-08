import React from 'react'
import { View, SafeAreaView, Alert } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParamsAuth } from '../types/navegacion'
import { Boton, Entrada, Texto } from '../components'
import { useAutenticacion } from '../hooks/useAutenticacion'
import { RUTAS } from '../navigation/rutas'

type Props = NativeStackScreenProps<ParamsAuth, 'Registro'>

const PantallaRegistro = ({ navigation }: Props) => {
  const { registrar, cargando, error, limpiarError } = useAutenticacion()
  const [nombre, setNombre] = React.useState('')
  const [correo, setCorreo] = React.useState('')
  const [contrasena, setContrasena] = React.useState('')
  const [errores, setErrores] = React.useState<{ nombre?: string; correo?: string; contrasena?: string }>({})

  const validarFormulario = (): boolean => {
    const nuevosErrores: { nombre?: string; correo?: string; contrasena?: string } = {}

    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio'
    } else if (nombre.trim().length < 3 || nombre.trim().length > 30) {
      nuevosErrores.nombre = 'El nombre debe tener entre 3 y 30 caracteres'
    }

    if (!correo.trim()) {
      nuevosErrores.correo = 'El correo es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      nuevosErrores.correo = 'Ingresa un correo válido'
    }

    if (!contrasena) {
      nuevosErrores.contrasena = 'La contraseña es obligatoria'
    } else if (contrasena.length < 8) {
      nuevosErrores.contrasena = 'La contraseña debe tener mínimo 8 caracteres'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const manejarRegistro = async (): Promise<void> => {
    limpiarError()
    if (!validarFormulario()) return

    try {
      await registrar({
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        contrasena,
      })
    } catch {
      Alert.alert('Error de registro', 'No se pudo crear la cuenta. Revisa los datos ingresados.')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-fondo">
      <View className="flex-1 justify-center px-6">
        <Texto variante="titulo" className="mb-2">Crear cuenta</Texto>
        <Texto variante="caption" className="mb-8">
          Regístrate para comentar y debatir sobre tecnología
        </Texto>

        <Entrada
          etiqueta="Nombre de usuario"
          value={nombre}
          onChangeText={setNombre}
          autoCapitalize="words"
          error={errores.nombre}
          editable={!cargando}
        />

        <Entrada
          etiqueta="Correo electrónico"
          tipo="email"
          autoComplete="email"
          value={correo}
          onChangeText={setCorreo}
          error={errores.correo}
          editable={!cargando}
        />

        <Entrada
          etiqueta="Contraseña"
          tipo="contrasena"
          autoComplete="password-new"
          value={contrasena}
          onChangeText={setContrasena}
          error={errores.contrasena}
          editable={!cargando}
        />

        {error ? (
          <Texto variante="caption" color="#F44336" className="mb-4">
            {error}
          </Texto>
        ) : null}

        <Boton onPress={manejarRegistro} cargando={cargando}>
          Crear cuenta
        </Boton>

        <Boton
          variante="fantasma"
          className="mt-3"
          onPress={() => navigation.navigate(RUTAS.LOGIN)}
          disabled={cargando}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Boton>
      </View>
    </SafeAreaView>
  )
}

export default PantallaRegistro
