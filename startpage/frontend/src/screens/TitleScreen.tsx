import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backgroundImg from '../assets/background.jpg'

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
      <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.3.07-.62.07-.94s-.03-.63-.07-.95l2.03-1.58c.18-.14.23-.41.12-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.62l2.03 1.58c-.04.32-.07.64-.07.95s.03.66.07.96l-2.03 1.58c-.18.14-.23.41-.12.62l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.62l-2.03-1.58z" />
    </svg>
  )
}

export function TitleScreen() {
  const navigate = useNavigate()
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [musicVolume, setMusicVolume] = useState(50)
  const [sfxVolume, setSfxVolume] = useState(70)

  return (
    <div
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImg})`,
      }}
    >
      {/* Content — vertically centered, responsive spacing */}
      <div className="flex flex-col items-center justify-center gap-6 px-6 py-10 sm:gap-7 sm:px-10 sm:py-12">
          {/* Title banner */}
          <div className="relative flex w-64 items-center justify-center py-5 sm:w-72">
            <div className="absolute inset-0 bg-banner shadow-[0_3px_10px_rgba(0,0,0,0.3)] [clip-path:polygon(5%_0%,95%_0%,100%_50%,95%_100%,5%_100%,0%_50%)]" />
            <p className="relative z-10 text-center font-serif text-base font-bold leading-snug text-btn-text sm:text-lg">
              International Student
              <br />
              Simulator
            </p>
          </div>

        {/* Start button */}
        <button
          onClick={() => navigate('/characters')}
          className="w-48 border border-desk-dark bg-btn py-3 font-serif text-sm text-btn-text shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition-all duration-150 active:scale-95 sm:w-56 sm:text-base"
        >
          Start Game
        </button>

        {/* About us + Sign in */}
        <div className="flex gap-4 sm:gap-5">
          <button
            onClick={() => setShowAboutModal(true)}
            className="rounded-full border border-desk-dark bg-btn px-6 py-2 font-serif text-xs text-btn-text shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-150 hover:brightness-110 active:scale-95 sm:px-7 sm:text-sm"
          >
            about us
          </button>
          <button
            onClick={() => setShowSignInModal(true)}
            className="rounded-full border border-desk-dark bg-btn px-6 py-2 font-serif text-xs text-btn-text shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-150 hover:brightness-110 active:scale-95 sm:px-7 sm:text-sm"
          >
            sign in
          </button>
        </div>
      </div>

      {/* Gear icon */}
      <button
        onClick={() => setShowSettingsModal(true)}
        className="absolute right-50 bottom-40 text-desk-dark opacity-70 transition-opacity hover:opacity-100"
      >
        <GearIcon />
      </button>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="mx-4 max-w-md rounded-lg border border-desk-dark bg-paper p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-desk-dark">About Us</h2>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-desk-dark hover:text-desk-mid"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 font-serif text-sm text-desk-dark">
              <p>Zhengyi Hao (zhao761@aucklanduni.ac.nz)</p>
              <p>Baiyi He (bhe783@aucklanduni.ac.nz)</p>
              <p>Grace Liao (jila776@aucklanduni.ac.nz)</p>
              <p>Huijing Men (hmen498@aucklanduni.ac.nz)</p>
              <p>Shiying Yang (syan634@aucklanduni.ac.nz)</p>
              <p>Alvin Zhu (jzhu528@aucklanduni.ac.nz)</p>
            </div>
            <div className="mt-6 text-center">
              <p className="font-serif text-xs text-desk-mid">CS732 Project - Team No WiFi Team</p>
            </div>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="mx-4 max-w-md rounded-lg border border-desk-dark bg-paper p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-desk-dark">Sign In</h2>
              <button
                onClick={() => setShowSignInModal(false)}
                className="text-desk-dark hover:text-desk-mid"
              >
                ✕
              </button>
            </div>
            <div className="text-center">
              <p className="font-serif text-sm text-desk-dark">Coming Soon</p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="mx-4 max-w-sm rounded-lg border border-desk-dark bg-paper p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-desk-dark">Settings</h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-desk-dark hover:text-desk-mid"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Music Volume */}
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm text-desk-dark">Music</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMusicVolume(Math.max(0, musicVolume - 10))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-desk-dark bg-btn text-desk-dark shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-150 hover:brightness-110 active:scale-95"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-serif text-sm text-desk-dark">{musicVolume}%</span>
                  <button
                    onClick={() => setMusicVolume(Math.min(100, musicVolume + 10))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-desk-dark bg-btn text-desk-dark shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-150 hover:brightness-110 active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* SFX Volume */}
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm text-desk-dark">Sound Effects</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSfxVolume(Math.max(0, sfxVolume - 10))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-desk-dark bg-btn text-desk-dark shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-150 hover:brightness-110 active:scale-95"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-serif text-sm text-desk-dark">{sfxVolume}%</span>
                  <button
                    onClick={() => setSfxVolume(Math.min(100, sfxVolume + 10))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-desk-dark bg-btn text-desk-dark shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-150 hover:brightness-110 active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}