import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Platform } from 'react-native'
import type { ParamsAuth } from '../types/navegacion'
import LoginScreen from '../modules/auth/screens/LoginScreen'
import RegisterScreen from '../modules/auth/screens/RegisterScreen'

const Stack = createNativeStackNavigator<ParamsAuth>()

const NavegadorAutenticacion = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
        contentStyle: { backgroundColor: '#09090b' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registro" component={RegisterScreen} />
    </Stack.Navigator>
  )
}

export default NavegadorAutenticacion
