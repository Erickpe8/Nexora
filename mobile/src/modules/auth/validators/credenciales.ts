import type { ResultadoValidacion } from '../types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validarCorreo = (valor: string): ResultadoValidacion => {
  const v = valor.trim()
  if (!v) return { valido: false, mensaje: 'El correo es obligatorio' }
  if (!EMAIL_RE.test(v)) return { valido: false, mensaje: 'Introduce un correo válido' }
  return { valido: true }
}

export const validarCorreoRelajado = (valor: string): ResultadoValidacion => {
  if (!valor.trim()) return { valido: true }
  return validarCorreo(valor)
}

export const validarContrasena = (valor: string): ResultadoValidacion => {
  if (!valor) return { valido: false, mensaje: 'La contraseña es obligatoria' }
  if (valor.length < 8) return { valido: false, mensaje: 'Mínimo 8 caracteres' }
  if (valor.length > 128) return { valido: false, mensaje: 'Contraseña demasiado larga' }
  return { valido: true }
}

export const validarContrasenaRelajada = (valor: string): ResultadoValidacion => {
  if (!valor) return { valido: true }
  return validarContrasena(valor)
}

/** Nombre público: sin espacios internos, 3–30, alfanumérico + guion bajo. */
export const validarNombreUsuario = (valor: string): ResultadoValidacion => {
  const v = valor.trim()
  if (!v) return { valido: false, mensaje: 'El nombre es obligatorio' }
  if (/\s/.test(v)) return { valido: false, mensaje: 'No uses espacios en el nombre' }
  if (v.length < 3 || v.length > 30) return { valido: false, mensaje: 'Entre 3 y 30 caracteres' }
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_]+$/.test(v)) {
    return { valido: false, mensaje: 'Solo letras, números y guion bajo' }
  }
  return { valido: true }
}

export const validarNombreUsuarioRelajado = (valor: string): ResultadoValidacion => {
  if (!valor.trim()) return { valido: true }
  return validarNombreUsuario(valor)
}
