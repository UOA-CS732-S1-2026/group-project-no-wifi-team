import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { post } from '../../utils/request'
import { loginButton, popupLogin, loginEnter } from '../../assets/gamebegin'
import { setInitialAchievements } from '../../slices/gameSlice'
import type { AppDispatch } from '../../store'

export function SignInModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    const name = username.trim()
    if (!name) {
      setError('Please enter a username')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await post<{ username: string; userId: string; achievements: string[] }>('/user/login', { username: name })
      localStorage.setItem('username', data.username)
      localStorage.setItem('guestId', data.userId)
      dispatch(setInitialAchievements(data.achievements ?? []))
      onClose()
      navigate('/characters')
    } catch {
      setError('Login failed, please try again')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={popupLogin} alt="login popup" className="w-[420px] select-none" draggable={false} />

        {/* Input overlaid in the centre of the popup image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pb-5">
          <div className="relative flex items-center justify-center">
            <img src={loginEnter} alt="" className="w-64 select-none" draggable={false} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter username"
              maxLength={30}
              className="absolute inset-0 w-full bg-transparent px-4 text-center text-sm font-semibold text-[#5a3010] placeholder-[#c4a068] outline-none"
            />
          </div>
          {error && <p className="text-xs font-bold text-red-600">{error}</p>}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="mt-7 transition active:scale-95 disabled:opacity-60"
          >
            <img src={loginButton} alt="Login" className="w-36 select-none" draggable={false} />
          </button>
        </div>
      </div>
    </div>
  )
}
