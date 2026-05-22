import React, { useState } from 'react'
import {
  Modal,
  View,
  TouchableOpacity,
  Share,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native'
import Texto from './Texto'
import Boton from './Boton'
import Icono from './Icono'
import { colores } from '../styles'
import {
  construirUrlPublicacion,
  urlFacebook,
  urlWhatsApp,
  urlX,
} from '../utils/urlCompartir'
import type { CanalCompartir } from '../services/servicioEngagement'

interface PropsModalCompartir {
  visible: boolean
  titulo: string
  slug: string
  comentarioId?: number
  compartidosCount?: number
  enviando: boolean
  onCompartir: (canal: CanalCompartir) => Promise<{ url: string }>
  onCerrar: () => void
}

const copiarTexto = async (texto: string): Promise<boolean> => {
  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(texto)
    return true
  }
  try {
    await Share.share({ message: texto })
    return true
  } catch {
    return false
  }
}

const ModalCompartir = ({
  visible,
  titulo,
  slug,
  comentarioId,
  compartidosCount = 0,
  enviando,
  onCompartir,
  onCerrar,
}: PropsModalCompartir) => {
  const [urlActual, setUrlActual] = useState(() => construirUrlPublicacion(slug, comentarioId))
  const [copiado, setCopiado] = useState(false)

  const registrarYAbrir = async (canal: CanalCompartir, abrir?: (url: string) => void) => {
    const { url } = await onCompartir(canal)
    setUrlActual(url)
    if (abrir) abrir(url)
  }

  const alCopiar = async () => {
    const { url } = await onCompartir('copy')
    setUrlActual(url)
    await copiarTexto(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const alWebShare = async () => {
    const { url } = await onCompartir('web_share')
    setUrlActual(url)
    if (Platform.OS !== 'web') {
      await Share.share({ message: `${titulo}\n${url}`, url, title: titulo })
    } else if (navigator.share) {
      await navigator.share({ title: titulo, url, text: titulo })
    } else {
      await copiarTexto(url)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCerrar}>
      <View className="flex-1 justify-end bg-black/60">
        <View className="rounded-t-2xl bg-fondoTarjeta px-4 pb-8 pt-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Texto variante="subtitulo">Compartir</Texto>
            <TouchableOpacity onPress={onCerrar} accessibilityLabel="Cerrar">
              <Icono nombre="cerrar" />
            </TouchableOpacity>
          </View>

          <Texto variante="caption" className="mb-2" numberOfLines={2}>
            {titulo}
          </Texto>
          <Texto variante="etiqueta" color={colores.textoSecundario} className="mb-4">
            {compartidosCount} compartidos
          </Texto>

          <Texto variante="caption" className="mb-4" numberOfLines={2}>
            {urlActual}
          </Texto>

          {enviando ? <ActivityIndicator color={colores.acento} className="mb-4" /> : null}

          <View className="gap-2">
            <Boton onPress={() => void alCopiar()} disabled={enviando}>
              {copiado ? 'Enlace copiado' : 'Copiar enlace'}
            </Boton>
            <Boton variante="secundario" onPress={() => void alWebShare()} disabled={enviando}>
              Compartir…
            </Boton>
            <Boton
              variante="secundario"
              onPress={() =>
                void registrarYAbrir('whatsapp', u => void Linking.openURL(urlWhatsApp(u, titulo)))
              }
              disabled={enviando}
            >
              WhatsApp
            </Boton>
            <Boton
              variante="secundario"
              onPress={() => void registrarYAbrir('x', u => void Linking.openURL(urlX(u, titulo)))}
              disabled={enviando}
            >
              X (Twitter)
            </Boton>
            <Boton
              variante="secundario"
              onPress={() => void registrarYAbrir('facebook', u => void Linking.openURL(urlFacebook(u)))}
              disabled={enviando}
            >
              Facebook
            </Boton>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ModalCompartir
