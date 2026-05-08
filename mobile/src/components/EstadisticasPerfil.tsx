import React from 'react'
import Tarjeta from './Tarjeta'
import Texto from './Texto'

interface PropsEstadisticasPerfil {
  totalComentarios: number
}

const EstadisticasPerfil = ({ totalComentarios }: PropsEstadisticasPerfil) => {
  return (
    <Tarjeta className="mt-4 items-center">
      <Texto variante="titulo">{totalComentarios}</Texto>
      <Texto variante="caption">Comentarios realizados</Texto>
    </Tarjeta>
  )
}

export default EstadisticasPerfil
