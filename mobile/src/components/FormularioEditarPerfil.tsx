import React, { useEffect, useState } from 'react'
import { Alert, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import type { PerfilUsuario, RedesSociales } from '../types/perfil'
import { servicioPerfil } from '../services/servicioPerfil'
import Boton from './Boton'
import Entrada from './Entrada'
import Texto from './Texto'
import { colores } from '../styles/colores'

interface PropsFormularioEditarPerfil {
  perfil: PerfilUsuario
  token: string | null
  guardando: boolean
  onGuardar: (datos: {
    nombre: string
    username: string
    biografia: string | null
    fotoPerfilUrl: string | null
    fechaNacimiento: string | null
    redesSociales: RedesSociales
  }) => Promise<void>
  onFotoSubida?: (perfil: PerfilUsuario) => void
}

const estadoInicialRedes = (perfil: PerfilUsuario): RedesSociales => ({
  github: perfil.redesSociales.github ?? '',
  linkedin: perfil.redesSociales.linkedin ?? '',
  x: perfil.redesSociales.x ?? '',
  instagram: perfil.redesSociales.instagram ?? '',
  facebook: perfil.redesSociales.facebook ?? '',
  tiktok: perfil.redesSociales.tiktok ?? '',
  youtube: perfil.redesSociales.youtube ?? '',
  web: perfil.redesSociales.web ?? '',
})

const FormularioEditarPerfil = ({
  perfil,
  token,
  guardando,
  onGuardar,
  onFotoSubida,
}: PropsFormularioEditarPerfil) => {
  const [nombre, setNombre] = useState(perfil.nombre)
  const [username, setUsername] = useState(perfil.username)
  const [biografia, setBiografia] = useState(perfil.biografia ?? '')
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(perfil.fotoPerfilUrl ?? '')
  const [fechaNacimiento, setFechaNacimiento] = useState(perfil.fechaNacimiento ?? '')
  const [redes, setRedes] = useState<RedesSociales>(() => estadoInicialRedes(perfil))
  const [subiendoFoto, setSubiendoFoto] = useState(false)

  useEffect(() => {
    setNombre(perfil.nombre)
    setUsername(perfil.username)
    setBiografia(perfil.biografia ?? '')
    setFotoPerfilUrl(perfil.fotoPerfilUrl ?? '')
    setFechaNacimiento(perfil.fechaNacimiento ?? '')
    setRedes(estadoInicialRedes(perfil))
  }, [perfil])

  const actualizarRed = (clave: keyof RedesSociales, valor: string) => {
    setRedes(prev => ({ ...prev, [clave]: valor }))
  }

  const elegirFoto = async () => {
    if (!token) return
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permiso.granted) {
      Alert.alert('Permiso necesario', 'Permite acceso a la galería para elegir una foto.')
      return
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    })
    if (resultado.canceled || !resultado.assets[0]) return

    const asset = resultado.assets[0]
    setSubiendoFoto(true)
    try {
      const actualizado = await servicioPerfil.subirFotoPerfil(
        token,
        asset.uri,
        asset.mimeType ?? 'image/jpeg'
      )
      setFotoPerfilUrl(actualizado.fotoPerfilUrl ?? '')
      onFotoSubida?.(actualizado)
      Alert.alert('Foto actualizada', 'Tu foto de perfil se guardó correctamente.')
    } catch {
      Alert.alert('Error', 'No se pudo subir la imagen. También puedes pegar una URL.')
    } finally {
      setSubiendoFoto(false)
    }
  }

  const alGuardar = () => {
    const redesLimpias: RedesSociales = {}
    for (const [clave, valor] of Object.entries(redes)) {
      const v = valor?.trim()
      if (v) redesLimpias[clave as keyof RedesSociales] = v
    }
    void onGuardar({
      nombre: nombre.trim(),
      biografia: biografia.trim() === '' ? null : biografia.trim(),
      fotoPerfilUrl: fotoPerfilUrl.trim() === '' ? null : fotoPerfilUrl.trim(),
      fechaNacimiento: fechaNacimiento.trim() === '' ? null : fechaNacimiento.trim(),
      redesSociales: redesLimpias,
    })
  }

  return (
    <View className="mt-4">
      <Texto variante="subtitulo" className="mb-3">
        Editar perfil
      </Texto>

      <Boton variante="secundario" cargando={subiendoFoto} onPress={() => void elegirFoto()} className="mb-3">
        Elegir foto desde galería
      </Boton>

      <Entrada etiqueta="Nombre visible" value={nombre} onChangeText={setNombre} />
      <Entrada
        etiqueta="Username (@)"
        placeholder="usuario_unico"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <Entrada
        etiqueta="URL de foto de perfil (alternativa)"
        placeholder="https://ejemplo.com/foto.jpg"
        value={fotoPerfilUrl}
        onChangeText={setFotoPerfilUrl}
        autoCapitalize="none"
      />

      <Entrada
        etiqueta="Biografía"
        placeholder="Cuéntanos sobre ti (máx. 500 caracteres)"
        value={biografia}
        onChangeText={setBiografia}
        multiline
        numberOfLines={4}
        maxLength={500}
      />
      <Texto variante="caption" color={colores.textoDeshabilitado} className="-mt-2 mb-3 text-right">
        {biografia.length}/500
      </Texto>

      <Entrada
        etiqueta="Fecha de nacimiento"
        placeholder="AAAA-MM-DD"
        value={fechaNacimiento}
        onChangeText={setFechaNacimiento}
        autoCapitalize="none"
      />

      <Texto variante="etiqueta" className="mb-2 mt-2">
        Redes sociales (URL completa o dominio)
      </Texto>
      <Entrada
        etiqueta="GitHub"
        placeholder="github.com/usuario"
        value={redes.github ?? ''}
        onChangeText={v => actualizarRed('github', v)}
        autoCapitalize="none"
      />
      <Entrada
        etiqueta="LinkedIn"
        value={redes.linkedin ?? ''}
        onChangeText={v => actualizarRed('linkedin', v)}
        autoCapitalize="none"
      />
      <Entrada
        etiqueta="X (Twitter)"
        value={redes.x ?? ''}
        onChangeText={v => actualizarRed('x', v)}
        autoCapitalize="none"
      />
      <Entrada
        etiqueta="Instagram"
        value={redes.instagram ?? ''}
        onChangeText={v => actualizarRed('instagram', v)}
        autoCapitalize="none"
      />
      <Entrada
        etiqueta="Facebook"
        value={redes.facebook ?? ''}
        onChangeText={v => actualizarRed('facebook', v)}
        autoCapitalize="none"
      />
      <Entrada
        etiqueta="TikTok"
        value={redes.tiktok ?? ''}
        onChangeText={v => actualizarRed('tiktok', v)}
        autoCapitalize="none"
      />
      <Entrada
        etiqueta="YouTube"
        value={redes.youtube ?? ''}
        onChangeText={v => actualizarRed('youtube', v)}
        autoCapitalize="none"
      />
      <Entrada
        etiqueta="Sitio web"
        value={redes.web ?? ''}
        onChangeText={v => actualizarRed('web', v)}
        autoCapitalize="none"
      />

      <Boton cargando={guardando} onPress={alGuardar}>
        Guardar perfil
      </Boton>
    </View>
  )
}

export default FormularioEditarPerfil
