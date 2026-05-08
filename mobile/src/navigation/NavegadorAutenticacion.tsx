import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { ParamsAuth } from '../types/navegacion'
import PantallaLogin from '../screens/PantallaLogin'
import PantallaRegistro from '../screens/PantallaRegistro'

const Stack = createNativeStackNavigator<ParamsAuth>()

// Stack de autenticación — sin header, sin tabs
const NavegadorAutenticacion = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={PantallaLogin} />
      <Stack.Screen name="Registro" component={PantallaRegistro} />
    </Stack.Navigator>
  )
}

export default NavegadorAutenticacion
