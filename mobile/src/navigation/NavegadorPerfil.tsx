import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { ParamsPerfil } from '../types/navegacion'
import PantallaPerfil from '../screens/PantallaPerfil'
import { colores } from '../styles'

const Stack = createNativeStackNavigator<ParamsPerfil>()

const NavegadorPerfil = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colores.fondoTarjeta },
        headerTintColor: colores.textoBase,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Perfil"
        component={PantallaPerfil}
        options={{ title: 'Mi Perfil' }}
      />
    </Stack.Navigator>
  )
}

export default NavegadorPerfil
