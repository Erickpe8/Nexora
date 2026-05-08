import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text } from 'react-native'
import type { ParamsTabs } from '../types/navegacion'
import NavegadorFeed from './NavegadorFeed'
import NavegadorNotificaciones from './NavegadorNotificaciones'
import NavegadorPerfil from './NavegadorPerfil'
import { colores } from '../styles'

const Tab = createBottomTabNavigator<ParamsTabs>()

// Íconos de texto simples hasta integrar una librería de íconos
const IconoTab = ({ emoji, enfocado }: { emoji: string; enfocado: boolean }) => (
  <Text style={{ fontSize: 20, opacity: enfocado ? 1 : 0.5 }}>{emoji}</Text>
)

const NavegadorPrincipal = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colores.fondoTarjeta,
          borderTopColor: colores.borde,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colores.acento,
        tabBarInactiveTintColor: colores.textoSecundario,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tab.Screen
        name="TabFeed"
        component={NavegadorFeed}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ focused }) => <IconoTab emoji="🏠" enfocado={focused} />,
        }}
      />
      <Tab.Screen
        name="TabNotificaciones"
        component={NavegadorNotificaciones}
        options={{
          tabBarLabel: 'Notificaciones',
          tabBarIcon: ({ focused }) => <IconoTab emoji="🔔" enfocado={focused} />,
          // El badge se conectará en Fase 7 (Notificaciones)
        }}
      />
      <Tab.Screen
        name="TabPerfil"
        component={NavegadorPerfil}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused }) => <IconoTab emoji="👤" enfocado={focused} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default NavegadorPrincipal
