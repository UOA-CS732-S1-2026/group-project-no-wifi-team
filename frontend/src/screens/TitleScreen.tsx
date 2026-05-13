import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store'
import { resetGame } from '../slices/gameSlice'
import { logout } from '../slices/authSlice'

import {
  background as backgroundImg,
  titleBanner as titleBannerImg,
  student as studentImg,
  setting as settingImg,
} from '../assets/gamebegin'
import { AboutModal } from '../components/TitleScreen/AboutModal'
import { MainButtons } from '../components/TitleScreen/MainButtons'
import { SettingsModal } from '../components/TitleScreen/SettingsModal'
import { SignInModal } from '../components/TitleScreen/SignInModal'
import { useMusicContext } from '../contexts/MusicContext'


export function TitleScreen() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { musicEnabled, setMusicEnabled, sfxEnabled, setSfxEnabled } = useMusicContext()
  const auth = useSelector((s: RootState) => s.auth)

  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  function handleLogout() {
    dispatch(logout())
    dispatch(resetGame())
  }

  return (
    <main
      className="relative h-dvh w-full overflow-hidden bg-cover bg-center font-serif text-[#6b4427]"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,245,218,0.10),rgba(80,48,22,0.08)_58%,rgba(42,24,12,0.16))]" />

      <section className="relative z-20 h-dvh w-full overflow-hidden px-4 py-3 sm:px-8 sm:py-4">
        <div className="mx-auto flex w-full justify-center">
          <img
            src={titleBannerImg}
            alt="International Student Simulator"
            className="w-[96vw] max-w-[1050px] object-contain drop-shadow-[0_8px_16px_rgba(60,35,15,0.18)] sm:w-[88vw] lg:w-[78vw]"
          />
        </div>

        <img
          src={studentImg}
          alt="Student studying at a desk"
          className="absolute bottom-0 left-[57%] z-20 w-[136px] -translate-x-1/2 drop-shadow-[0_18px_18px_rgba(40,24,12,0.32)] sm:bottom-0 sm:left-[8%] sm:w-[182px] sm:translate-x-0 lg:w-[324px] xl:w-[363px]"
        />

        <div className="absolute left-1/2 top-[60%] z-30 -translate-x-1/2 -translate-y-1/2 sm:top-[60%]">
          <MainButtons
            onStart={() => { dispatch(resetGame()); navigate('/characters') }}
            onAbout={() => setShowAboutModal(true)}
            onSignIn={() => setShowSignInModal(true)}
            isLoggedIn={!!auth.token}
          />
          {auth.token && (
            <div className="mt-5 flex flex-col items-center gap-2">
              <p className="text-sm font-bold text-[#5a3010]">Welcome, {auth.username}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[#6b3f25] bg-[#f7e8c6] px-5 py-1 text-xs font-bold text-[#7a4b2b] cursor-pointer hover:bg-[#e8d5a8] transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          className="absolute bottom-[8%] right-[12%] z-30 w-[54px] transition duration-200 hover:rotate-45 hover:scale-110 active:scale-95 sm:right-[8%] sm:w-[74px] cursor-pointer"
          aria-label="Settings"
        >
          <img src={settingImg} alt="Settings" className="w-full drop-shadow-lg" />
        </button>
      </section>

      {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}

      {showSignInModal && <SignInModal onClose={() => setShowSignInModal(false)} />}

      {showSettingsModal && (
        <SettingsModal
          musicEnabled={musicEnabled}
          sfxEnabled={sfxEnabled}
          onMusicToggle={setMusicEnabled}
          onSfxToggle={setSfxEnabled}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </main>
  )
}
