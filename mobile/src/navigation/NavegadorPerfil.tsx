import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { ParamsPerfil } from '../types/navegacion'
import PantallaPerfil from '../screens/PantallaPerfil'
import PantallaDetalle from '../screens/PantallaDetalle'
import PantallaPerfilPublico from '../screens/PantallaPerfilPublico'
import PantallaModeracion from '../screens/PantallaModeracion'
import PantallaGuardados from '../screens/PantallaGuardados'
import { colores } from '../styles'

const Stack = createNativeStackNavigator<ParamsPerfil>()

const opcionesPantalla = {
  headerStyle: { backgroundColor: colores.fondoTarjeta },
  headerTintColor: colores.textoBase,
  headerTitleStyle: { fontWeight: '600' as const },
  headerShadowVisible: false,
}

const NavegadorPerfil = () => {
  return (
    <Stack.Navigator screenOptions={opcionesPantalla}>
      <Stack.Screen name="Perfil" component={PantallaPerfil} options={{ title: 'Mi Perfil' }} />
      <Stack.Screen name="Guardados" component={PantallaGuardados} options={{ title: 'Guardados' }} />
      <Stack.Screen name="Detalle" component={PantallaDetalle} options={{ title: 'Publicación' }} />
      <Stack.Screen name="PerfilPublico" component={PantallaPerfilPublico} options={{ title: 'Perfil' }} />
      <Stack.Screen name="Moderacion" component={PantallaModeracion} options={{ title: 'Moderación' }} />
    </Stack.Navigator>
  )
}

export default NavegadorPerfil
