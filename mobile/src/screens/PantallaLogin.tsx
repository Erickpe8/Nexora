import React from 'react'
import { View, SafeAreaView, Alert } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParamsAuth } from '../types/navegacion'
import { Boton, Entrada, Texto } from '../components'
import { useAutenticacion } from '../hooks/useAutenticacion'
import { RUTAS } from '../navigation/rutas'

type Props = NativeStackScreenProps<ParamsAuth, 'Login'>

const PantallaLogin = ({ navigation }: Props) => {
  const { iniciarSesion, cargando, error, limpiarError } = useAutenticacion()
  const [correo, setCorreo] = React.useState('')
  const [contrasena, setContrasena] = React.useState('')
  const [errores, setErrores] = React.useState<{ correo?: string; contrasena?: string }>({})

  const validarFormulario = (): boolean => {
    const nuevosErrores: { correo?: string; contrasena?: string } = {}

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

  const manejarLogin = async (): Promise<void> => {
    limpiarError()
    if (!validarFormulario()) return

    try {
      await iniciarSesion({
        correo: correo.trim().toLowerCase(),
        contrasena,
      })
    } catch {
      Alert.alert('Error de autenticación', 'No se pudo iniciar sesión con esas credenciales')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-fondo">
      <View className="flex-1 justify-center px-6">
        <Texto variante="titulo" className="mb-2">Iniciar sesión</Texto>
        <Texto variante="caption" className="mb-8">
          Accede para participar en las discusiones de Nexora
        </Texto>

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
          autoComplete="password"
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

        <Boton onPress={manejarLogin} cargando={cargando}>
          Ingresar
        </Boton>

        <Boton
          variante="fantasma"
          className="mt-3"
          onPress={() => navigation.navigate(RUTAS.REGISTRO)}
          disabled={cargando}
        >
          ¿No tienes cuenta? Regístrate
        </Boton>
      </View>
    </SafeAreaView>
  )
}

export default PantallaLogin
