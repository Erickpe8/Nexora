import { useCallback, useEffect, useRef } from 'react'
import { AppState } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { socketDisponibleEnEntorno } from '../utils/socketDisponible'

/** Refresco periódico y al volver a la app cuando no hay WebSocket (Vercel / web). */
export const usePollingSinSocket = (
  onRefetch: () => void | Promise<void>,
  intervaloMs = 45_000,
  habilitado = true
) => {
  const callbackRef = useRef(onRefetch)
  callbackRef.current = onRefetch
  const sinSocket = !socketDisponibleEnEntorno()

  const ejecutar = useCallback(() => {
    void callbackRef.current()
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (!sinSocket || !habilitado) return
      ejecutar()
      const id = setInterval(ejecutar, intervaloMs)
      return () => clearInterval(id)
    }, [sinSocket, habilitado, intervaloMs, ejecutar])
  )

  useEffect(() => {
    if (!sinSocket || !habilitado) return
    const sub = AppState.addEventListener('change', estado => {
      if (estado === 'active') ejecutar()
    })
    return () => sub.remove()
  }, [sinSocket, habilitado, ejecutar])
}
