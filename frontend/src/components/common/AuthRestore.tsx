import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import { setStats } from '../../slices/authSlice'
import { get } from '../../utils/request'

interface MeResponse {
  userId: string
  username: string
  email: string
  achievements: string[]
  endings: string[]
  totalPlays: number
}

export function AuthRestore() {
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((s: RootState) => s.auth.token)

  useEffect(() => {
    if (!token) return

    get<MeResponse>('/user/me')
      .then((data) => {
        dispatch(setStats({
          achievements: data.achievements,
          endings: data.endings,
          totalPlays: data.totalPlays,
        }))
      })
      .catch(() => { /* offline or token expired — use cached profile */ })
  }, [dispatch, token])

  return null
}
