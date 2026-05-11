import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { post } from '../../utils/request'
import { popupLogin, loginEnter } from '../../assets/gamebegin'
import { loginSuccess } from '../../slices/authSlice'
import type { AppDispatch } from '../../store'

interface AuthResponse {
  token: string
  userId: string
  username: string
  email: string
  achievements?: string[]
  endings?: string[]
  totalPlays?: number
}

export function SignInModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function resetForm() {
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  function switchTab(t: 'login' | 'register') {
    setTab(t)
    resetForm()
  }

  async function handleLogin() {
    setError('')
    if (!email.trim()) { setError('Please enter your email'); return }
    if (!password) { setError('Please enter your password'); return }

    setLoading(true)
    try {
      const data = await post<AuthResponse>('/user/login', {
        email: email.trim(),
        password,
      })
      dispatch(loginSuccess(data))
      onClose()
      navigate('/characters')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Login failed, please try again')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister() {
    setError('')
    if (!username.trim()) { setError('Please enter a username'); return }
    if (!email.trim()) { setError('Please enter your email'); return }
    if (!password) { setError('Please enter a password'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }

    setLoading(true)
    try {
      const data = await post<AuthResponse>('/user/register', {
        username: username.trim(),
        email: email.trim(),
        password,
      })
      dispatch(loginSuccess(data))
      onClose()
      navigate('/characters')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Registration failed, please try again')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      tab === 'login' ? handleLogin() : handleRegister()
    }
  }

  const isLogin = tab === 'login'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background popup image */}
        <img src={popupLogin} alt="" className="w-[420px] select-none pointer-events-none" draggable={false} />

        {/* Tab toggle — z-30 above the form overlay */}
        <div className="absolute top-[16%] z-30 flex gap-1">
          <button
            type="button"
            onClick={() => switchTab('login')}
            className={`px-5 py-1 text-[12px] font-bold rounded-full transition cursor-pointer ${
              isLogin
                ? 'bg-[#7a4b2b] text-[#fff3d2] shadow-md'
                : 'bg-[#e8d5a8]/70 text-[#9a6a3e] hover:bg-[#e8d5a8]'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchTab('register')}
            className={`px-5 py-1 text-[12px] font-bold rounded-full transition cursor-pointer ${
              !isLogin
                ? 'bg-[#7a4b2b] text-[#fff3d2] shadow-md'
                : 'bg-[#e8d5a8]/70 text-[#9a6a3e] hover:bg-[#e8d5a8]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form overlay — pointer-events-none so clicks pass through to tabs */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[24%] gap-[0.2vh] pointer-events-none">
          {/* Username field (register only) */}
          {!isLogin && (
            <div className="relative flex items-center justify-center pointer-events-auto">
              <img src={loginEnter} alt="" className="w-64 select-none" draggable={false} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Username"
                maxLength={30}
                className="absolute inset-0 w-full bg-transparent px-4 text-center text-sm font-semibold text-[#5a3010] placeholder-[#c4a068] outline-none"
              />
            </div>
          )}

          {/* Email field */}
          <div className="relative flex items-center justify-center pointer-events-auto">
            <img src={loginEnter} alt="" className="w-64 select-none" draggable={false} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Email"
              maxLength={60}
              className="absolute inset-0 w-full bg-transparent px-4 text-center text-sm font-semibold text-[#5a3010] placeholder-[#c4a068] outline-none"
            />
          </div>

          {/* Password field */}
          <div className="relative flex items-center justify-center pointer-events-auto">
            <img src={loginEnter} alt="" className="w-64 select-none" draggable={false} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Password"
              maxLength={60}
              className="absolute inset-0 w-full bg-transparent px-4 text-center text-sm font-semibold text-[#5a3010] placeholder-[#c4a068] outline-none"
            />
          </div>

          {/* Confirm password (register only) */}
          {!isLogin && (
            <div className="relative flex items-center justify-center pointer-events-auto">
              <img src={loginEnter} alt="" className="w-64 select-none" draggable={false} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Confirm Password"
                maxLength={60}
                className="absolute inset-0 w-full bg-transparent px-4 text-center text-sm font-semibold text-[#5a3010] placeholder-[#c4a068] outline-none"
              />
            </div>
          )}

          {error && <p className="text-xs font-bold text-red-600 px-4 text-center pointer-events-auto">{error}</p>}

          {/* Submit button — text button that changes based on tab */}
          <button
            type="button"
            onClick={isLogin ? handleLogin : handleRegister}
            disabled={loading}
            className="pointer-events-auto mt-1 cursor-pointer rounded-full border-2 border-[#6b3f25] bg-[#9a5f2d] px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#fff3d2] shadow-md hover:scale-105 active:scale-95 disabled:opacity-60 transition"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
