import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import type { PerfilUsuario, RedesSociales } from '../types/perfil'
import Boton from './Boton'
import Entrada from './Entrada'
import Texto from './Texto'
import { colores } from '../styles/colores'

interface PropsFormularioEditarPerfil {
  perfil: PerfilUsuario
  guardando: boolean
  onGuardar: (datos: {
    nombre: string
    biografia: string | null
    fotoPerfilUrl: string | null
    fechaNacimiento: string | null
    redesSociales: RedesSociales
  }) => Promise<void>
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

const FormularioEditarPerfil = ({ perfil, guardando, onGuardar }: PropsFormularioEditarPerfil) => {
  const [nombre, setNombre] = useState(perfil.nombre)
  const [biografia, setBiografia] = useState(perfil.biografia ?? '')
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(perfil.fotoPerfilUrl ?? '')
  const [fechaNacimiento, setFechaNacimiento] = useState(perfil.fechaNacimiento ?? '')
  const [redes, setRedes] = useState<RedesSociales>(() => estadoInicialRedes(perfil))

  useEffect(() => {
    setNombre(perfil.nombre)
    setBiografia(perfil.biografia ?? '')
    setFotoPerfilUrl(perfil.fotoPerfilUrl ?? '')
    setFechaNacimiento(perfil.fechaNacimiento ?? '')
    setRedes(estadoInicialRedes(perfil))
  }, [perfil])

  const actualizarRed = (clave: keyof RedesSociales, valor: string) => {
    setRedes(prev => ({ ...prev, [clave]: valor }))
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

      <Entrada etiqueta="Nombre de usuario" value={nombre} onChangeText={setNombre} />

      <Entrada
        etiqueta="URL de foto de perfil"
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
