import React, { useState } from 'react'
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import Texto from './Texto'
import Boton from './Boton'
import { colores } from '../styles'
import type { MotivosDenuncia } from '../types/moderacion'

interface PropsModalDenuncia {
  visible: boolean
  comentarioId: number
  enviando: boolean
  enviada: boolean
  error: string | null
  onDenunciar: (motivo: MotivosDenuncia, detalle?: string) => Promise<void>
  onCerrar: () => void
}

const MOTIVOS: { valor: MotivosDenuncia; etiqueta: string }[] = [
  { valor: 'spam', etiqueta: 'Spam o publicidad' },
  { valor: 'acoso', etiqueta: 'Acoso o intimidación' },
  { valor: 'contenido_inapropiado', etiqueta: 'Contenido inapropiado' },
  { valor: 'desinformacion', etiqueta: 'Desinformación' },
  { valor: 'otro', etiqueta: 'Otro motivo' },
]

const ModalDenuncia = ({
  visible,
  enviando,
  enviada,
  error,
  onDenunciar,
  onCerrar,
}: PropsModalDenuncia) => {
  const [motivoSeleccionado, setMotivoSeleccionado] = useState<MotivosDenuncia | null>(null)
  const [detalle, setDetalle] = useState('')

  const alEnviar = async () => {
    if (!motivoSeleccionado) return
    await onDenunciar(motivoSeleccionado, detalle.trim() || undefined)
  }

  const alCerrar = () => {
    setMotivoSeleccionado(null)
    setDetalle('')
    onCerrar()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={alCerrar}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={alCerrar}
        style={{ flex: 1, backgroundColor: colores.overlay, justifyContent: 'flex-end' }}
      >
        <TouchableOpacity activeOpacity={1}>
          <View
            style={{
              backgroundColor: colores.fondoTarjeta,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 24,
              paddingBottom: 40,
            }}
          >
            {/* Cabecera */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Texto variante="subtitulo">Denunciar comentario</Texto>
              <TouchableOpacity onPress={alCerrar} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Texto variante="cuerpo" color={colores.textoSecundario}>✕</Texto>
              </TouchableOpacity>
            </View>

            {enviada ? (
              /* Estado confirmación */
              <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                <Texto variante="subtitulo" color={colores.exito} style={{ marginBottom: 8 }}>
                  Denuncia enviada
                </Texto>
                <Texto variante="cuerpo" color={colores.textoSecundario} style={{ textAlign: 'center' }}>
                  Revisaremos el contenido. Gracias por ayudar a mantener la comunidad.
                </Texto>
                <Boton variante="secundario" tamano="md" onPress={alCerrar} style={{ marginTop: 20 }}>
                  Cerrar
                </Boton>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Texto variante="caption" color={colores.textoSecundario} style={{ marginBottom: 12 }}>
                  ¿Por qué denuncias este comentario?
                </Texto>

                {/* Motivos */}
                {MOTIVOS.map(({ valor, etiqueta }) => {
                  const seleccionado = motivoSeleccionado === valor
                  return (
                    <TouchableOpacity
                      key={valor}
                      onPress={() => setMotivoSeleccionado(valor)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        marginBottom: 8,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: seleccionado ? colores.acento : colores.borde,
                        backgroundColor: seleccionado ? `${colores.acento}18` : colores.fondoElevado,
                      }}
                    >
                      <View
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          borderWidth: 2,
                          borderColor: seleccionado ? colores.acento : colores.textoSecundario,
                          marginRight: 12,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {seleccionado && (
                          <View
                            style={{
                              width: 9,
                              height: 9,
                              borderRadius: 5,
                              backgroundColor: colores.acento,
                            }}
                          />
                        )}
                      </View>
                      <Texto variante="cuerpo">{etiqueta}</Texto>
                    </TouchableOpacity>
                  )
                })}

                {/* Detalle opcional */}
                <Texto variante="caption" color={colores.textoSecundario} style={{ marginTop: 12, marginBottom: 6 }}>
                  Detalle adicional (opcional)
                </Texto>
                <TextInput
                  value={detalle}
                  onChangeText={t => setDetalle(t.slice(0, 500))}
                  placeholder="Describe el problema..."
                  placeholderTextColor={colores.textoDeshabilitado}
                  multiline
                  numberOfLines={3}
                  style={{
                    backgroundColor: colores.fondoElevado,
                    borderWidth: 1,
                    borderColor: colores.borde,
                    borderRadius: 10,
                    padding: 12,
                    color: colores.textoBase,
                    minHeight: 72,
                    textAlignVertical: 'top',
                    marginBottom: 4,
                  }}
                />
                <Texto variante="caption" color={colores.textoDeshabilitado} style={{ textAlign: 'right', marginBottom: 16 }}>
                  {detalle.length}/500
                </Texto>

                {/* Error */}
                {error ? (
                  <Texto variante="caption" color={colores.error} style={{ marginBottom: 12 }}>
                    {error}
                  </Texto>
                ) : null}

                {/* Botón enviar */}
                <Boton
                  variante="peligro"
                  tamano="md"
                  onPress={() => void alEnviar()}
                  disabled={!motivoSeleccionado || enviando}
                  cargando={enviando}
                >
                  {enviando ? 'Enviando...' : 'Enviar denuncia'}
                </Boton>
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}

export default ModalDenuncia
