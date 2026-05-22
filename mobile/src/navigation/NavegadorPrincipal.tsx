import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View } from 'react-native'
import type { ParamsTabs } from '../types/navegacion'
import NavegadorFeed from './NavegadorFeed'
import NavegadorNotificaciones from './NavegadorNotificaciones'
import NavegadorPerfil from './NavegadorPerfil'
import { colores } from '../styles'
import { BadgeNotificaciones, Icono } from '../components'
import type { NombreIcono } from '../components/Icono'

const Tab = createBottomTabNavigator<ParamsTabs>()

const IconoTab = ({ nombre, enfocado }: { nombre: NombreIcono; enfocado: boolean }) => (
  <Icono
    nombre={nombre}
    tamano={22}
    color={enfocado ? colores.acento : colores.textoSecundario}
    enfocado={enfocado}
  />
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
          tabBarIcon: ({ focused }) => <IconoTab nombre="inicio" enfocado={focused} />,
        }}
      />
      <Tab.Screen
        name="TabNotificaciones"
        component={NavegadorNotificaciones}
        options={{
          tabBarLabel: 'Notificaciones',
          tabBarIcon: ({ focused }) => (
            <View>
              <IconoTab nombre="notificaciones" enfocado={focused} />
              <BadgeNotificaciones />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="TabPerfil"
        component={NavegadorPerfil}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused }) => <IconoTab nombre="perfil" enfocado={focused} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default NavegadorPrincipal
