import axios from 'axios'
import { CAIXINHA_SERVICE } from '@/constants/ApiConts'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || CAIXINHA_SERVICE

function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.data != null) {
    const d = error.response.data as { message?: unknown }
    if (typeof d.message === 'string') return d.message
  }
  if (error instanceof Error) return error.message
  return 'Erro na requisição'
}

export const caixinhaHttp = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
})

caixinhaHttp.interceptors.response.use(
  (r) => r,
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[caixinha]', axios.isAxiosError(error) ? error.response?.data ?? error.message : error)
    }
    return Promise.reject(new Error(errorMessage(error)))
  }
)

export function getCaixinhaBaseUrl() {
  return BASE_URL
}
