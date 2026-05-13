import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useGoogleLogin } from '@react-oauth/google'
import { post } from '../../utils/request'
import { loginSuccess } from '../../slices/authSlice'
import type { AppDispatch } from '../../store'
import { aboutUs as aboutUsImg, signIn as signInImg, signout as signoutImg, startGame as startGameImg } from '../../assets/gamebegin'

interface AuthResponse {
  token: string
  userId: string
  username: string
  email: string
  achievements?: string[]
  endings?: string[]
  totalPlays?: number
}

const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string)?.trim() || ''

function GoogleSignInButton() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const googleLogin = useGoogleLogin({
    scope: 'email profile openid',
    onSuccess: async (tokenResponse) => {
      try {
        const data = await post<AuthResponse>('/user/google', {
          access_token: tokenResponse.access_token
        })
        dispatch(loginSuccess(data))
        navigate('/characters')
      } catch {
        // silently ignore
      }
    },
  })

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      className="w-[90px] transition duration-200 hover:scale-105 active:scale-95 sm:w-[100px] cursor-pointer"
      aria-label="Sign In"
    >
      <img src={signInImg} alt="Sign In" className="w-full scale-125 drop-shadow-md sm:scale-140" />
    </button>
  )
}

export function MainButtons({
  onStart,
  onAbout,
  onLogout,
  isLoggedIn,
}: {
  onStart: () => void
  onAbout: () => void
  onLogout: () => void
  isLoggedIn?: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <button
        type="button"
        onClick={onStart}
        className="w-[240px] transition duration-200 hover:scale-105 active:scale-95 sm:w-[340px] lg:w-[390px] cursor-pointer"
        aria-label="Start Game"
      >
        <img
          src={startGameImg}
          alt="Start Game"
          className="w-full drop-shadow-[0_10px_12px_rgba(72,41,17,0.32)]"
        />
      </button>

      <div className="mt-4 flex items-center justify-center gap-10 sm:mt-5">
        <button
          type="button"
          onClick={onAbout}
          className="w-[118px] transition duration-200 hover:scale-105 active:scale-95 sm:w-[160px] cursor-pointer"
          aria-label="About Us"
        >
          <img src={aboutUsImg} alt="About Us" className="w-full scale-125 drop-shadow-md sm:scale-140" />
        </button>

        {!isLoggedIn ? (
          googleClientId ? <GoogleSignInButton /> : null
        ) : (
          <button
            type="button"
            onClick={onLogout}
            className="w-[90px] transition duration-200 hover:scale-105 active:scale-95 sm:w-[100px] cursor-pointer"
            aria-label="Sign Out"
          >
            <img src={signoutImg} alt="Sign Out" className="w-full scale-125 drop-shadow-md sm:scale-140" />
          </button>
        )}
      </div>
    </div>
  )
}
