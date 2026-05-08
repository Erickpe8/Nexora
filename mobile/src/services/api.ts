import axios from 'axios'

export const urlBaseApi = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'

export const clienteApi = axios.create({
  baseURL: urlBaseApi,
  timeout: 10000,
})

export interface RespuestaDatos<T> {
  datos: T
}
