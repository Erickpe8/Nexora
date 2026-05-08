import React from 'react'
import { useContextoAuth } from '../context/ContextoAutenticacion'

interface PropsRutaProtegida {
  children: React.ReactNode
}

const RutaProtegida = ({ children }: PropsRutaProtegida) => {
  const { usuario } = useContextoAuth()

  if (!usuario) {
    return null
  }

  return <>{children}</>
}

export default RutaProtegida
