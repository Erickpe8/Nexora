import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { ParamsFeed } from '../types/navegacion'
import PantallaFeed from '../screens/PantallaFeed'
import PantallaDetalle from '../screens/PantallaDetalle'
import PantallaPerfilPublico from '../screens/PantallaPerfilPublico'
import { colores } from '../styles'

const Stack = createNativeStackNavigator<ParamsFeed>()

const NavegadorFeed = () => {
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
        name="Feed"
        component={PantallaFeed}
        options={{ title: 'Nexora' }}
      />
      <Stack.Screen
        name="Detalle"
        component={PantallaDetalle}
        options={{ title: 'Publicación' }}
      />
      <Stack.Screen
        name="PerfilPublico"
        component={PantallaPerfilPublico}
        options={{ title: 'Perfil' }}
      />
    </Stack.Navigator>
  )
}

export default NavegadorFeed
