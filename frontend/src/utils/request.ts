import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { store } from '../store'
import { logout } from '../slices/authSlice'
import { showToast } from '../components/common/Toast'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token if present
instance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch { /* localStorage unavailable */ }
  return config
})

// Response interceptor — unwrap data or handle errors centrally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try { localStorage.removeItem('auth_token') } catch { /* ignore */ }
      store.dispatch(logout())
      const message = error.response.data?.message || error.response.data?.error || 'Session expired'
      showToast(message + '. You are now as a guest. Please login again.')
    }
    return Promise.reject(error)
  },
)

export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  instance.get<T>(url, config).then((res) => res.data)

export const post = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => instance.post<T>(url, data, config).then((res) => res.data)

export default instance
