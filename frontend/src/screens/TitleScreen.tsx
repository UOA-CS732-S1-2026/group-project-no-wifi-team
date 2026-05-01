import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import backgroundImg from '../assets/gamebegin/background.jpg'
import titleBannerImg from '../assets/gamebegin/title-banner.png'
import startGameImg from '../assets/gamebegin/startgame.png'
import studentImg from '../assets/gamebegin/student.png'
import signInImg from '../assets/gamebegin/signin.png'
import settingImg from '../assets/gamebegin/setting.png'
import aboutUsImg from '../assets/gamebegin/aboutus.png'

const teamMembers = [
  'Zhengyi Hao (zhao761@aucklanduni.ac.nz)',
  'Baiyi He (bhe783@aucklanduni.ac.nz)',
  'Grace Liao (jila776@aucklanduni.ac.nz)',
  'Huijing Men (hmen498@aucklanduni.ac.nz)',
  'Shiying Yang (syan634@aucklanduni.ac.nz)',
  'Alvin Zhu (jzhu528@aucklanduni.ac.nz)',
]

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
      {/* Soft overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,245,218,0.10),rgba(80,48,22,0.08)_58%,rgba(42,24,12,0.16))]" />

      <section className="relative z-20 h-dvh w-full overflow-hidden px-4 py-3 sm:px-8 sm:py-4">
        {/* title banner image */}
        <div className="mx-auto flex w-full justify-center">
          <img
            src={titleBannerImg}
            alt="International Student Simulator"
            className="w-[96vw] max-w-[1050px] object-contain drop-shadow-[0_8px_16px_rgba(60,35,15,0.18)] sm:w-[88vw] lg:w-[78vw]"
          />
        </div>

        {/* Student image */}
        <img
          src={studentImg}
          alt="Student studying at a desk"
          className="absolute bottom-[-2%] left-1/2 z-20 w-[310px] -translate-x-1/2 drop-shadow-[0_18px_18px_rgba(40,24,12,0.32)] sm:bottom-[-14%] sm:left-[1%] sm:w-[380px] sm:translate-x-0 lg:w-[500px] xl:w-[560px]"
        />

        {/* Main buttons */}
        <div className="absolute left-1/2 top-[49%] z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center sm:top-[55%]">
          <button
            type="button"
            onClick={() => navigate('/characters')}
            className="w-[240px] transition duration-200 hover:scale-105 active:scale-95 sm:w-[340px] lg:w-[390px]"
            aria-label="Start Game"
          >
            <img
              src={startGameImg}
              alt="Start Game"
              className="w-full drop-shadow-[0_10px_12px_rgba(72,41,17,0.32)]"
            />
          </button>

          <div className="mt-4 flex items-center justify-center gap-5 sm:mt-5">
            <button
              type="button"
              onClick={() => setShowAboutModal(true)}
              className="w-[118px] transition duration-200 hover:scale-105 active:scale-95 sm:w-[160px]"
              aria-label="About Us"
            >
              <img
                src={aboutUsImg}
                alt="About Us"
                className="w-full scale-125 drop-shadow-md sm:scale-140"
              />
            </button>

            <button
              type="button"
              onClick={() => setShowSignInModal(true)}
              className="w-[118px] transition duration-200 hover:scale-105 active:scale-95 sm:w-[160px]"
              aria-label="Sign In"
            >
              <img
                src={signInImg}
                alt="Sign In"
                className="w-full scale-125 drop-shadow-md sm:scale-140"
              />
            </button>
          </div>
        </div>

        {/* Settings button */}
        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          className="absolute bottom-[7%] right-[8%] z-30 w-[54px] transition duration-200 hover:rotate-45 hover:scale-110 active:scale-95 sm:right-[6%] sm:w-[74px]"
          aria-label="Settings"
        >
          <img src={settingImg} alt="Settings" className="w-full drop-shadow-lg" />
        </button>
      </section>

      {/* About Us Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/35 px-4 backdrop-blur-sm">
          <div className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border-4 border-[#7a4b2b] bg-[#f7e8c6] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-6">
            <div className="rounded-[1.5rem] border-2 border-[#c49a61] bg-[#fff7df]/80 px-5 py-5 text-center shadow-inner sm:px-6">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#9a6a3e]">
                About Us
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#7a4b2b] sm:text-4xl">Team No WiFi</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#8a6446]">
                CS732 Project - International Student Simulator
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {teamMembers.map((member) => (
                <div
                  key={member}
                  className="break-words rounded-2xl border-2 border-[#c49a61]/70 bg-[#fff7df]/75 px-4 py-3 text-sm font-bold text-[#6b4427] shadow-sm"
                >
                  {member}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAboutModal(false)}
              className="mx-auto mt-6 block rounded-full border-2 border-[#6b3f25] bg-[#9a5f2d] px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fff3d2] shadow-md transition hover:-translate-y-0.5 hover:bg-[#7a4b2b] active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border-4 border-[#7a4b2b] bg-[#f7e8c6] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#9a6a3e]">Sign In</p>
            <h2 className="mt-2 text-3xl font-bold text-[#7a4b2b]">Coming Soon</h2>
            <p className="mt-3 text-sm text-[#8a6446]">
              Account login will be connected to MongoDB later.
            </p>

            <button
              type="button"
              onClick={() => setShowSignInModal(false)}
              className="mt-6 rounded-full border-2 border-[#6b3f25] bg-[#9a5f2d] px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fff3d2] shadow-md transition hover:-translate-y-0.5 hover:bg-[#7a4b2b] active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border-4 border-[#7a4b2b] bg-[#f7e8c6] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#9a6a3e]">
                Settings
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#7a4b2b]">Game Settings</h2>
            </div>

            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between rounded-2xl border-2 border-[#c49a61]/70 bg-[#fff7df]/75 px-4 py-3">
                <span className="font-bold text-[#6b4427]">Music</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMusicVolume(Math.max(0, musicVolume - 10))}
                    className="h-8 w-8 rounded-full border border-[#6b3f25] bg-[#d9bd87] font-bold"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-bold">{musicVolume}%</span>
                  <button
                    type="button"
                    onClick={() => setMusicVolume(Math.min(100, musicVolume + 10))}
                    className="h-8 w-8 rounded-full border border-[#6b3f25] bg-[#d9bd87] font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border-2 border-[#c49a61]/70 bg-[#fff7df]/75 px-4 py-3">
                <span className="font-bold text-[#6b4427]">Sound Effects</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSfxVolume(Math.max(0, sfxVolume - 10))}
                    className="h-8 w-8 rounded-full border border-[#6b3f25] bg-[#d9bd87] font-bold"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-bold">{sfxVolume}%</span>
                  <button
                    type="button"
                    onClick={() => setSfxVolume(Math.min(100, sfxVolume + 10))}
                    className="h-8 w-8 rounded-full border border-[#6b3f25] bg-[#d9bd87] font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="mx-auto mt-6 block rounded-full border-2 border-[#6b3f25] bg-[#9a5f2d] px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fff3d2] shadow-md transition hover:-translate-y-0.5 hover:bg-[#7a4b2b] active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
