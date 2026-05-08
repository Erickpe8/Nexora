import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { ParamsNotificaciones } from '../types/navegacion'
import PantallaNotificaciones from '../screens/PantallaNotificaciones'
import { colores } from '../styles'

const Stack = createNativeStackNavigator<ParamsNotificaciones>()

const NavegadorNotificaciones = () => {
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
        name="Notificaciones"
        component={PantallaNotificaciones}
        options={{ title: 'Notificaciones' }}
      />
    </Stack.Navigator>
  )
}

export default NavegadorNotificaciones
