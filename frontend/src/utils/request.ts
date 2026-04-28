import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token if present
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — unwrap data or handle errors centrally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: handle 401/403 globally (e.g. redirect to login)
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
