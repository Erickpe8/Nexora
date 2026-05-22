import { urlBaseApi } from '../services/api'

/**
 * Socket.IO solo existe con `backend/src/server.ts` (proceso persistente).
 * En Vercel/serverless no hay servidor de sockets → la app usa polling HTTP.
 */
export const socketDisponibleEnEntorno = (): boolean => {
  if (process.env.EXPO_PUBLIC_ENABLE_SOCKET === 'false') return false

  const url = urlBaseApi.toLowerCase()
  if (url.includes('vercel.app') || url.includes('vercel.com')) return false

  return true
}
