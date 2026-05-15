import React, { useCallback, useState } from 'react'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParamsAuth } from '../../../types/navegacion'
import { RUTAS } from '../../../navigation/rutas'
import { useAutenticacion } from '../hooks/useAutenticacion'
import {
  validarContrasena,
  validarCorreo,
  validarNombreUsuario,
} from '../validators/credenciales'
import { AuthLayout } from '../components/AuthLayout'
import { AuthMarcaCabecera } from '../components/AuthMarcaCabecera'
import { AuthCampoTexto } from '../components/AuthCampoTexto'
import { AuthBotonPrincipal } from '../components/AuthBotonPrincipal'
import { AuthEnlacePie } from '../components/AuthPieAcciones'
import { EnvoltorioFormularioWeb } from '../components/EnvoltorioFormularioWeb'

type Props = NativeStackScreenProps<ParamsAuth, 'Registro'>

const RegisterScreen = ({ navigation }: Props) => {
  const { registrar, cargando } = useAutenticacion()
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [tocado, setTocado] = useState({ nombre: false, correo: false, contrasena: false })
  const [intentoEnviado, setIntentoEnviado] = useState(false)

  const mostrar = {
    nombre: tocado.nombre || intentoEnviado,
    correo: tocado.correo || intentoEnviado,
    contrasena: tocado.contrasena || intentoEnviado,
  }

  const rNombre = validarNombreUsuario(nombre)
  const rCorreo = validarCorreo(correo)
  const rPass = validarContrasena(contrasena)

  const alEnviar = useCallback(async () => {
    if (cargando) return
    setIntentoEnviado(true)
    setTocado({ nombre: true, correo: true, contrasena: true })
    const vn = validarNombreUsuario(nombre)
    const vc = validarCorreo(correo)
    const vp = validarContrasena(contrasena)
    if (!vn.valido || !vc.valido || !vp.valido) return
    try {
      await registrar({
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        contrasena,
      })
    } catch {
      /* Toast en hook */
    }
  }, [cargando, contrasena, correo, nombre, registrar])

  const pie = (
    <AuthEnlacePie onPress={() => navigation.navigate(RUTAS.LOGIN)} deshabilitado={cargando}>
      ¿Ya tienes cuenta? Iniciar sesión
    </AuthEnlacePie>
  )

  return (
    <AuthLayout
      cabecera={
        <AuthMarcaCabecera
          titulo="Crear cuenta"
          subtitulo="Elige un nombre público y accede al feed en segundos."
        />
      }
      pie={pie}
    >
      <EnvoltorioFormularioWeb alEnviar={() => void alEnviar()}>
        <AuthCampoTexto
          etiqueta="Nombre de usuario"
          value={nombre}
          onChangeText={t => {
            setNombre(t.replace(/\s/g, ''))
            if (intentoEnviado) setIntentoEnviado(false)
          }}
          onBlur={() => setTocado(s => ({ ...s, nombre: true }))}
          error={mostrar.nombre && !rNombre.valido ? rNombre.mensaje : undefined}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!cargando}
        />

        <AuthCampoTexto
          etiqueta="Correo"
          tipo="email"
          autoComplete="email"
          value={correo}
          onChangeText={t => {
            setCorreo(t)
            if (intentoEnviado) setIntentoEnviado(false)
          }}
          onBlur={() => setTocado(s => ({ ...s, correo: true }))}
          error={mostrar.correo && !rCorreo.valido ? rCorreo.mensaje : undefined}
          editable={!cargando}
        />

        <AuthCampoTexto
          etiqueta="Contraseña"
          tipo="contrasena"
          autoComplete="password-new"
          value={contrasena}
          onChangeText={t => {
            setContrasena(t)
            if (intentoEnviado) setIntentoEnviado(false)
          }}
          onBlur={() => setTocado(s => ({ ...s, contrasena: true }))}
          error={mostrar.contrasena && !rPass.valido ? rPass.mensaje : undefined}
          editable={!cargando}
        />

        <AuthBotonPrincipal onPress={() => void alEnviar()} cargando={cargando}>
          Crear cuenta
        </AuthBotonPrincipal>
      </EnvoltorioFormularioWeb>
    </AuthLayout>
  )
}

export default RegisterScreen
