import './global.css'
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { ProveedorAutenticacion } from './src/context/ContextoAutenticacion'
import { ProveedorSocket } from './src/context/ContextoSocket'
import { ProveedorNotificaciones } from './src/context/ContextoNotificaciones'
import NavegadorRaiz from './src/navigation/NavegadorRaiz'
import { IndicadorConexion } from './src/components'

export default function App() {
  return (
    <SafeAreaProvider>
      <ProveedorAutenticacion>
        <ProveedorSocket>
          <ProveedorNotificaciones>
            <View className="flex-1 w-full flex-col bg-fondo">
              <View className="min-h-0 w-full flex-1 flex-col">
                <NavegadorRaiz />
              </View>
              <IndicadorConexion />
              <StatusBar style="light" />
            </View>
            <Toast />
          </ProveedorNotificaciones>
        </ProveedorSocket>
      </ProveedorAutenticacion>
    </SafeAreaProvider>
  )
}
