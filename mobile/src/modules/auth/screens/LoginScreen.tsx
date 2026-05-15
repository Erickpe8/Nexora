import React, { useCallback, useEffect, useState } from 'react'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParamsAuth } from '../../../types/navegacion'
import { RUTAS } from '../../../navigation/rutas'
import { useAutenticacion } from '../hooks/useAutenticacion'
import { leerPreferenciaRecordar, guardarPreferenciaRecordar } from '../services/authStorage'
import { validarContrasena, validarCorreo } from '../validators/credenciales'
import { AuthLayout } from '../components/AuthLayout'
import { AuthMarcaCabecera } from '../components/AuthMarcaCabecera'
import { AuthCampoTexto } from '../components/AuthCampoTexto'
import { AuthBotonPrincipal } from '../components/AuthBotonPrincipal'
import { AuthInterruptorRecordar, AuthEnlacePie } from '../components/AuthPieAcciones'
import { EnvoltorioFormularioWeb } from '../components/EnvoltorioFormularioWeb'

type Props = NativeStackScreenProps<ParamsAuth, 'Login'>

const LoginScreen = ({ navigation }: Props) => {
  const { iniciarSesion, cargando } = useAutenticacion()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [recordar, setRecordar] = useState(true)
  const [tocado, setTocado] = useState({ correo: false, contrasena: false })
  const [intentoEnviado, setIntentoEnviado] = useState(false)

  useEffect(() => {
    void leerPreferenciaRecordar().then(setRecordar)
  }, [])

  const mostrarErrCorreo = tocado.correo || intentoEnviado
  const mostrarErrPass = tocado.contrasena || intentoEnviado

  const rCorreo = validarCorreo(correo)
  const rPass = validarContrasena(contrasena)

  const alEnviar = useCallback(async () => {
    if (cargando) return
    setIntentoEnviado(true)
    setTocado({ correo: true, contrasena: true })
    const vc = validarCorreo(correo)
    const vp = validarContrasena(contrasena)
    if (!vc.valido || !vp.valido) return
    try {
      await iniciarSesion(
        { correo: correo.trim().toLowerCase(), contrasena },
        { recordar }
      )
    } catch {
      /* errores vía Toast en useAutenticacion */
    }
  }, [cargando, correo, contrasena, iniciarSesion, recordar])

  const pie = (
    <AuthEnlacePie onPress={() => navigation.navigate(RUTAS.REGISTRO)} deshabilitado={cargando}>
      ¿No tienes cuenta? Regístrate
    </AuthEnlacePie>
  )

  return (
    <AuthLayout
      cabecera={
        <AuthMarcaCabecera
          titulo="Entrar"
          subtitulo="¿Sin sesión? Entra con tu correo. Si aún no tienes cuenta, regístrate abajo."
        />
      }
      pie={pie}
    >
      <EnvoltorioFormularioWeb alEnviar={() => void alEnviar()}>
        <AuthInterruptorRecordar
          valor={recordar}
          alCambiar={v => {
            setRecordar(v)
            void guardarPreferenciaRecordar(v)
          }}
          deshabilitado={cargando}
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
          error={mostrarErrCorreo && !rCorreo.valido ? rCorreo.mensaje : undefined}
          editable={!cargando}
        />

        <AuthCampoTexto
          etiqueta="Contraseña"
          tipo="contrasena"
          autoComplete="password"
          value={contrasena}
          onChangeText={t => {
            setContrasena(t)
            if (intentoEnviado) setIntentoEnviado(false)
          }}
          onBlur={() => setTocado(s => ({ ...s, contrasena: true }))}
          error={mostrarErrPass && !rPass.valido ? rPass.mensaje : undefined}
          editable={!cargando}
        />

        <AuthBotonPrincipal onPress={() => void alEnviar()} cargando={cargando}>
          Continuar
        </AuthBotonPrincipal>
      </EnvoltorioFormularioWeb>
    </AuthLayout>
  )
}

export default LoginScreen
