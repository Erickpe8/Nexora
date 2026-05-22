import React, { useState } from 'react'
import { View, TouchableOpacity, ActivityIndicator } from 'react-native'
import type { Publicacion } from '../types'
import Texto from './Texto'
import Icono from './Icono'
import ModalCompartir from './ModalCompartir'
import { useGuardarPublicacion } from '../hooks/useGuardarPublicacion'
import { useContextoAuth } from '../context/ContextoAutenticacion'
import { servicioEngagement, type CanalCompartir } from '../services/servicioEngagement'
import { colores } from '../styles/colores'

interface PropsAccionesEngagement {
  publicacion: Publicacion
  onCompartidosActualizados?: (total: number) => void
}

const AccionesEngagement = ({ publicacion, onCompartidosActualizados }: PropsAccionesEngagement) => {
  const { token } = useContextoAuth()
  const [modalCompartir, setModalCompartir] = useState(false)
  const [compartidos, setCompartidos] = useState(publicacion.compartidosCount ?? 0)
  const [enviandoShare, setEnviandoShare] = useState(false)

  const { guardado, leerDespues, enviando, alternarGuardado, marcarLeerDespues } = useGuardarPublicacion(
    token,
    publicacion.id,
    publicacion.guardadoPorMi ?? false,
    publicacion.leerDespues ?? false
  )

  const alCompartir = async (canal: CanalCompartir) => {
    if (!token) return { url: '' }
    setEnviandoShare(true)
    try {
      const res = await servicioEngagement.compartirPublicacion(token, publicacion.id, canal)
      setCompartidos(res.compartidosCount)
      onCompartidosActualizados?.(res.compartidosCount)
      return res
    } finally {
      setEnviandoShare(false)
    }
  }

  return (
    <View className="mt-3 flex-row flex-wrap items-center gap-4">
      <TouchableOpacity
        onPress={() => void alternarGuardado()}
        disabled={enviando || !token}
        className="flex-row items-center gap-1"
        accessibilityLabel={guardado ? 'Quitar de guardados' : 'Guardar'}
      >
        {enviando ? (
          <ActivityIndicator size="small" color={colores.acento} />
        ) : (
          <Icono nombre={guardado ? 'guardado' : 'guardar'} color={guardado ? colores.acento : colores.textoSecundario} />
        )}
        <Texto variante="etiqueta">{guardado ? 'Guardado' : 'Guardar'}</Texto>
      </TouchableOpacity>

      {guardado ? (
        <TouchableOpacity
          onPress={() => void marcarLeerDespues(!leerDespues)}
          disabled={enviando}
          className="flex-row items-center gap-1"
        >
          <Icono nombre="leer-despues" color={leerDespues ? colores.acento : colores.textoSecundario} />
          <Texto variante="etiqueta">{leerDespues ? 'Leer después ✓' : 'Leer después'}</Texto>
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity
        onPress={() => setModalCompartir(true)}
        disabled={!token}
        className="flex-row items-center gap-1"
        accessibilityLabel="Compartir"
      >
        <Icono nombre="compartir" />
        <Texto variante="etiqueta">Compartir · {compartidos}</Texto>
      </TouchableOpacity>

      <ModalCompartir
        visible={modalCompartir}
        titulo={publicacion.titulo}
        slug={publicacion.slug}
        compartidosCount={compartidos}
        enviando={enviandoShare}
        onCompartir={alCompartir}
        onCerrar={() => setModalCompartir(false)}
      />
    </View>
  )
}

export default AccionesEngagement
