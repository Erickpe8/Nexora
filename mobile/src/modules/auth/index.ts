/**
 * Módulo de autenticación (pantallas, API, persistencia, validadores).
 * Punto de entrada sugerido: `screens/LoginScreen`, `hooks/useAutenticacion`, `context/AuthProvider` vía `ProveedorAutenticacion`.
 */
export { default as LoginScreen } from './screens/LoginScreen'
export { default as RegisterScreen } from './screens/RegisterScreen'
export { useAutenticacion } from './hooks/useAutenticacion'
export { ProveedorAutenticacion, useContextoAuth } from './context/AuthProvider'
export type { ContextoAuthTipo, OpcionesGuardarSesion } from './context/AuthProvider'
