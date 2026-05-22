import { Platform } from 'react-native'
import { urlBaseApi } from '../services/api'

/** Socket.IO solo funciona con `server.ts` local; no en web ni en Vercel serverless. */
export const socketDisponibleEnEntorno = (): boolean => {
  if (Platform.OS === 'web') return false
  if (process.env.EXPO_PUBLIC_ENABLE_SOCKET === 'false') return false
  return !urlBaseApi.toLowerCase().includes('vercel.app')
}
