import './global.css'
import { StatusBar } from 'expo-status-bar'
import { ProveedorAutenticacion } from './src/context/ContextoAutenticacion'
import NavegadorRaiz from './src/navigation/NavegadorRaiz'

export default function App() {
  return (
    <ProveedorAutenticacion>
      <NavegadorRaiz />
      <StatusBar style="light" />
    </ProveedorAutenticacion>
  )
}
