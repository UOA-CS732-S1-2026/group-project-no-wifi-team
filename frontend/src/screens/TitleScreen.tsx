import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

export function TitleScreen() {
  const navigate = useNavigate()

  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [musicVolume, setMusicVolume] = useState(50)
  const [sfxVolume, setSfxVolume] = useState(70)

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
          className="absolute bottom-[-2%] left-1/2 z-20 w-[310px] -translate-x-1/2 drop-shadow-[0_18px_18px_rgba(40,24,12,0.32)] sm:bottom-[-14%] sm:left-[1%] sm:w-[380px] sm:translate-x-0 lg:w-[500px] xl:w-[560px]"
        />

        <MainButtons
          onStart={() => navigate('/characters')}
          onAbout={() => setShowAboutModal(true)}
          onSignIn={() => setShowSignInModal(true)}
        />

        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          className="absolute bottom-[7%] right-[8%] z-30 w-[54px] transition duration-200 hover:rotate-45 hover:scale-110 active:scale-95 sm:right-[6%] sm:w-[74px]"
          aria-label="Settings"
        >
          <img src={settingImg} alt="Settings" className="w-full drop-shadow-lg" />
        </button>
      </section>

      {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}

      {showSignInModal && <SignInModal onClose={() => setShowSignInModal(false)} />}

      {showSettingsModal && (
        <SettingsModal
          musicVolume={musicVolume}
          sfxVolume={sfxVolume}
          onMusicChange={setMusicVolume}
          onSfxChange={setSfxVolume}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </main>
  )
}
