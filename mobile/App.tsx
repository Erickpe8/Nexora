import './global.css'
import { StatusBar } from 'expo-status-bar'
import { ProveedorAutenticacion } from './src/context/ContextoAutenticacion'
import { ProveedorSocket } from './src/context/ContextoSocket'
import { ProveedorNotificaciones } from './src/context/ContextoNotificaciones'
import NavegadorRaiz from './src/navigation/NavegadorRaiz'
import { IndicadorConexion } from './src/components'

export default function App() {
  return (
    <ProveedorAutenticacion>
      <ProveedorSocket>
        <ProveedorNotificaciones>
          <NavegadorRaiz />
          <IndicadorConexion />
          <StatusBar style="light" />
        </ProveedorNotificaciones>
      </ProveedorSocket>
    </ProveedorAutenticacion>
  )
}
