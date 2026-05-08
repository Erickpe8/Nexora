import React from 'react'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { ParamsRaiz } from '../types/navegacion'
import { useContextoAuth } from '../context/ContextoAutenticacion'
import NavegadorAutenticacion from './NavegadorAutenticacion'
import NavegadorPrincipal from './NavegadorPrincipal'
import RutaProtegida from './RutaProtegida'
import { Cargador } from '../components'
import { colores } from '../styles'

const Stack = createNativeStackNavigator<ParamsRaiz>()

// Tema de navegación alineado con el sistema de diseño de Nexora
const temaNexora = {
  dark: true,
  colors: {
    primary:      colores.acento,
    background:   colores.fondoPrincipal,
    card:         colores.fondoTarjeta,
    text:         colores.textoBase,
    border:       colores.borde,
    notification: colores.acento,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium:  { fontFamily: 'System', fontWeight: '500' as const },
    bold:    { fontFamily: 'System', fontWeight: '700' as const },
    heavy:   { fontFamily: 'System', fontWeight: '900' as const },
  },
}

const NavegadorRaiz = () => {
  const { usuario, cargando } = useContextoAuth()

  // Mostrar pantalla de carga mientras se verifica la sesión persistida
  if (cargando) {
    return (
      <View style={{ flex: 1, backgroundColor: colores.fondoPrincipal }}>
        <Cargador centrado />
      </View>
    )
  }

  return (
    <NavigationContainer theme={temaNexora}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
        {usuario ? (
          <Stack.Screen name="Principal">
            {() => (
              <RutaProtegida>
                <NavegadorPrincipal />
              </RutaProtegida>
            )}
          </Stack.Screen>
        ) : (
          // Sin sesión → mostrar stack de autenticación
          <Stack.Screen name="Auth" component={NavegadorAutenticacion} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default NavegadorRaiz
