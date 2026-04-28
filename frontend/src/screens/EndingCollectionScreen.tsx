import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import endingBg from '../assets/ending-collection/ending-bg.png'
import endingBackHome from '../assets/ending-collection/ending-back-home.png'
import endingCardFrame from '../assets/ending-collection/ending-card-frame.png'
import endingCardLockedFrame from '../assets/ending-collection/ending-card-locked-frame.png'
import endingReplayButton from '../assets/ending-collection/ending-replay-button.png'
import endingTitleBanner from '../assets/ending-collection/ending-title-banner.png'
import endingViewAchievements from '../assets/ending-collection/ending-view-achievements.png'

type BackendEndingItem = {
  _id?: string
  endingId: string
  title: string
  status: 'Unlocked' | 'Locked'
  category?: string
  description?: string
  image?: string
}

type AchievementItem = {
  id: string
  title: string
  description: string
  unlocked: boolean
}

type EndingsApiResponse = {
  success: boolean
  total: number
  unlocked: number
  locked: number
  data: BackendEndingItem[]
  message?: string
}

const API_BASE_URL = 'http://localhost:3000'

const STAGE_WIDTH = 1500
const STAGE_HEIGHT = 1060
const MOBILE_BREAKPOINT = 900

function useResponsiveStageScale() {
  const [layout, setLayout] = useState({
    scale: 1,
    isMobile: false,
  })

  useEffect(() => {
    function updateLayout() {
      const viewportWidth = window.innerWidth
      const isMobile = viewportWidth < MOBILE_BREAKPOINT

      if (!isMobile) {
        setLayout({
          scale: 1,
          isMobile: false,
        })
        return
      }

      // 手机端按宽度缩放，保留上下滚动
      const safePadding = 8
      const scale = Math.min((viewportWidth - safePadding) / STAGE_WIDTH, 1)

      setLayout({
        scale,
        isMobile: true,
      })
    }

    updateLayout()

    window.addEventListener('resize', updateLayout)
    window.addEventListener('orientationchange', updateLayout)

    return () => {
      window.removeEventListener('resize', updateLayout)
      window.removeEventListener('orientationchange', updateLayout)
    }
  }, [])

  return layout
}

const achievements: AchievementItem[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Started your international student journey.',
    unlocked: true,
  },
  {
    id: 'study-hard',
    title: 'Study Hard',
    description: 'Improved your intelligence through study tasks.',
    unlocked: true,
  },
  {
    id: 'healthy-life',
    title: 'Healthy Life',
    description: 'Kept your health in a good condition.',
    unlocked: true,
  },
  {
    id: 'smart-budget',
    title: 'Smart Budget',
    description: 'Managed your wealth carefully.',
    unlocked: false,
  },
  {
    id: 'new-friends',
    title: 'New Friends',
    description: 'Built meaningful social connections.',
    unlocked: false,
  },
  {
    id: 'perfect-balance',
    title: 'Perfect Balance',
    description: 'Balanced intelligence, health, and wealth.',
    unlocked: false,
  },
]

function EndingCard({ ending }: { ending: BackendEndingItem }) {
  const isUnlocked = ending.status === 'Unlocked'
  const frameImage = isUnlocked ? endingCardFrame : endingCardLockedFrame

  return (
    <article className="relative h-[305px] w-[295px] shrink-0 transition duration-200 hover:-translate-y-1 hover:scale-[1.02]">
      {/* Card frame */}
      <img
        src={frameImage}
        alt=""
        className="absolute inset-0 h-full w-full object-fill drop-shadow-[0_8px_12px_rgba(83,45,18,0.22)]"
      />

      {/* Badge */}
      <div
        className={`absolute left-[19px] top-[7px] z-20 flex h-[50px] w-[36px] items-center justify-center rounded-b-[9px] border border-[#7a4b2b] text-[18px] shadow-md ${
          isUnlocked ? 'bg-[#78944a] text-[#fff5d4]' : 'bg-[#9a6b3a] text-[#fff5d4]'
        }`}
      >
        {isUnlocked ? '★' : '🔒'}
      </div>

      {/* Ending image placeholder */}
      <div className="absolute left-[43px] top-[33px] h-[156px] w-[206px] overflow-hidden rounded-[10px] border border-[#d6b27c] bg-[#f5e2bd]">
        <div
          className={`flex h-full w-full items-center justify-center px-3 text-center text-[13px] font-bold leading-[1.3] ${
            isUnlocked ? 'bg-[#f7e8c7] text-[#8a5a32]' : 'bg-[#8b8071]/45 text-[#4f4439]'
          }`}
        >
          {isUnlocked ? 'Put Ending Image Here' : 'Locked Ending Image'}
        </div>
      </div>

      {/* Title */}
      <h3 className="absolute left-[50px] top-[190px] flex h-[60px] w-[188px] items-center justify-center text-center text-[15px] font-bold leading-[1.05] text-[#5a3218]">
        {ending.title}
      </h3>

      {/* Status */}
      <div
        className={`absolute bottom-[1px] left-[70px] flex h-[100px] w-[155px] items-center justify-center text-[14px] font-bold ${
          isUnlocked ? 'text-[#526b37]' : 'text-[#6b4427]'
        }`}
      >
        {ending.status}
      </div>
    </article>
  )
}

function AchievementModal({ onClose }: { onClose: () => void }) {
  const unlockedCount = achievements.filter((item) => item.unlocked).length

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="max-h-[90vh] w-full max-w-[900px] overflow-y-auto rounded-[28px] border-[3px] border-[#b98755] bg-[#fff0cf] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.38)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-5 flex items-start justify-between gap-4 border-b border-[#d7b783] pb-4">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#9a6840]">
              International Student Simulator
            </p>

            <h2 className="mt-1 text-[34px] font-bold leading-none text-[#5c3318]">
              Achievement Collection
            </h2>

            <p className="mt-2 text-[15px] text-[#7a5030]">
              Achievements Earned: {unlockedCount} / {achievements.length}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-2 border-[#8a5a32] bg-[#d9b16f] px-4 py-2 text-[14px] font-bold text-[#5c3318] transition hover:scale-105 active:scale-95"
          >
            Close
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <article
              key={achievement.id}
              className={`rounded-[18px] border-[2px] p-4 shadow-sm ${
                achievement.unlocked
                  ? 'border-[#cfa472] bg-[#fff8e8]'
                  : 'border-[#b9a28b] bg-[#e9dfd0]'
              }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={`flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 text-[22px] ${
                    achievement.unlocked
                      ? 'border-[#73864f] bg-[#dfe8b8]'
                      : 'border-[#8a6a4a] bg-[#c9b69d]'
                  }`}
                >
                  {achievement.unlocked ? '★' : '🔒'}
                </div>

                <div>
                  <h3 className="text-[18px] font-bold leading-tight text-[#5c3318]">
                    {achievement.title}
                  </h3>

                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a6840]">
                    {achievement.unlocked ? 'Unlocked' : 'Locked'}
                  </p>
                </div>
              </div>

              <p className="min-h-[72px] rounded-[12px] bg-[#f4e4c8]/80 px-3 py-3 text-[14px] leading-[1.45] text-[#714729]">
                {achievement.unlocked
                  ? achievement.description
                  : 'This achievement is still locked. Continue playing to unlock it.'}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export function EndingCollectionScreen() {
  const navigate = useNavigate()
  const { scale: stageScale, isMobile } = useResponsiveStageScale()

  const [showAchievements, setShowAchievements] = useState(false)
  const [endings, setEndings] = useState<BackendEndingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchEndings() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_BASE_URL}/api/endings`)

        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`)
        }

        const result = (await response.json()) as EndingsApiResponse

        if (!result.success) {
          throw new Error(result.message || 'Failed to load endings')
        }

        setEndings(result.data)
      } catch (err) {
        console.error(err)
        setError('Failed to load ending collection from backend.')
      } finally {
        setLoading(false)
      }
    }

    fetchEndings()
  }, [])

  const unlockedCount = useMemo(() => {
    return endings.filter((ending) => ending.status === 'Unlocked').length
  }, [endings])

  const lockedCount = endings.length - unlockedCount

  const progressPercent =
    endings.length === 0 ? 0 : Math.round((unlockedCount / endings.length) * 100)

  if (loading) {
    return (
      <main className="min-h-dvh w-full overflow-auto bg-[#4b2f1e] font-serif text-[#5a3218]">
        <div
          className="min-h-dvh bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${endingBg})` }}
        >
          <div className="flex min-h-dvh items-center justify-center">
            <div className="rounded-[22px] border-[3px] border-[#cfa472] bg-[#fff2d4]/90 px-10 py-7 text-center shadow-[0_12px_25px_rgba(70,35,12,0.25)]">
              <p className="text-[24px] font-bold">Loading ending collection...</p>
              <p className="mt-2 text-[15px] text-[#7a5030]">Connecting to backend server.</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-dvh w-full overflow-auto bg-[#4b2f1e] font-serif text-[#5a3218]">
        <div
          className="min-h-dvh bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${endingBg})` }}
        >
          <div className="flex min-h-dvh items-center justify-center">
            <div className="max-w-[520px] rounded-[22px] border-[3px] border-[#cfa472] bg-[#fff2d4]/90 px-10 py-7 text-center shadow-[0_12px_25px_rgba(70,35,12,0.25)]">
              <p className="text-[24px] font-bold">Failed to load data</p>

              <p className="mt-3 text-[15px] leading-[1.6] text-[#7a5030]">{error}</p>

              <p className="mt-3 text-[14px] leading-[1.6] text-[#7a5030]">
                Please make sure your backend is running at:
                <br />
                <span className="font-bold">http://localhost:3000/api/endings</span>
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-full border-2 border-[#8a5a32] bg-[#d9b16f] px-6 py-2 text-[14px] font-bold text-[#5c3318] transition hover:scale-105 active:scale-95"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh w-full overflow-auto bg-[#4b2f1e] font-serif text-[#5a3218]">
      {/*
        手机端：
        - 外层大小 = 缩放后的舞台大小
        - 内层舞台 = 原始 1365 x 1040
        - 背景和组件都在内层舞台，所以会一起滚动、一起缩放
      */}
      <div
        className="relative mx-auto"
        style={{
          width: isMobile ? `${STAGE_WIDTH * stageScale}px` : `${STAGE_WIDTH}px`,
          height: isMobile ? `${STAGE_HEIGHT * stageScale}px` : `${STAGE_HEIGHT}px`,
          minWidth: isMobile ? `${STAGE_WIDTH * stageScale}px` : `${STAGE_WIDTH}px`,
          minHeight: isMobile ? `${STAGE_HEIGHT * stageScale}px` : `${STAGE_HEIGHT}px`,
        }}
      >
        <div
          className="relative origin-top bg-cover bg-center bg-no-repeat"
          style={{
            width: `${STAGE_WIDTH}px`,
            height: `${STAGE_HEIGHT}px`,
            backgroundImage: `url(${endingBg})`,
            transform: isMobile ? `scale(${stageScale})` : 'scale(1)',
            transformOrigin: 'top center',
          }}
        >
          {/* Back Home */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="absolute left-[-100px] top-[-40px] z-30 w-[450px] transition duration-200 hover:scale-105 active:scale-95"
            aria-label="Back to Home"
          >
            <img src={endingBackHome} alt="Back to Home" className="w-full" />
          </button>

          {/* Title Banner */}
          <div className="absolute left-1/2 top-[40px] z-20 w-[850px] -translate-x-1/2">
            <img
              src={endingTitleBanner}
              alt="Ending Collection"
              className="w-full object-contain drop-shadow-[0_8px_14px_rgba(72,41,17,0.22)]"
            />
          </div>

          {/* Progress Panel */}
          <section className="absolute left-1/2 top-[270px] z-20 grid h-[86px] w-[1050px] -translate-x-1/2 grid-cols-[1.1fr_1fr_1fr_190px] items-center rounded-[14px] border-[2px] border-[#cfa472] bg-[#fff2d4]/80 px-[24px] shadow-[0_5px_10px_rgba(70,35,12,0.10)]">
            <div>
              <p className="text-[15px] font-bold uppercase tracking-[0.1em] text-[#7a4c29]">
                Overall Progress
              </p>

              <div className="mt-1 flex items-center gap-3">
                <span className="text-[17px] font-bold">
                  ★ {unlockedCount} / {endings.length}
                </span>

                <div className="h-[12px] w-[150px] overflow-hidden rounded-full border border-[#b88b55] bg-[#ead5ad]">
                  <div
                    className="h-full rounded-full bg-[#879450]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-[15px] font-bold uppercase tracking-[0.1em] text-[#7a4c29]">
                Ending Discovered
              </p>

              <p className="mt-1 text-[17px] font-bold">
                🪶 {unlockedCount} / {endings.length}
              </p>
            </div>

            <div>
              <p className="text-[15px] font-bold uppercase tracking-[0.1em] text-[#7a4c29]">
                Locked Endings
              </p>

              <p className="mt-1 text-[17px] font-bold">🔒 {lockedCount}</p>
            </div>

            <button
              type="button"
              onClick={() => setShowAchievements(true)}
              className="mx-auto w-[205px] transition duration-200 hover:scale-105 active:scale-95"
              aria-label="View Achievements"
            >
              <img src={endingViewAchievements} alt="View Achievements" className="w-full" />
            </button>
          </section>

          {/* Ending Cards Area */}
          <section className="absolute left-1/2 top-[360px] z-20 w-[1080px] -translate-x-1/2">
            <div className="grid grid-cols-4 justify-items-center gap-x-[0px] gap-y-[0px]">
              {endings.map((ending) => (
                <EndingCard key={ending.endingId} ending={ending} />
              ))}
            </div>
          </section>

          {/* Bottom Message */}
          <div className="absolute bottom-[-10px] left-1/2 z-20 w-[560px] -translate-x-1/2 rounded-[14px] border border-[#c89b61] bg-[#f2dfb5]/90 px-10 py-4 text-center text-[19px] italic leading-[1.35] text-[#7b5433] shadow-sm">
            Not every ending is a failure.
            <br />
            Some are just a different kind of success.
          </div>

          {/* Replay Journey */}
          <button
            type="button"
            onClick={() => navigate('/characters')}
            className="absolute bottom-[30px] right-[80px] z-30 w-[180px] transition duration-200 hover:scale-105 active:scale-95"
            aria-label="Replay Journey"
          >
            <img src={endingReplayButton} alt="Replay Journey" className="w-full" />
          </button>
        </div>
      </div>

      {showAchievements && <AchievementModal onClose={() => setShowAchievements(false)} />}
    </main>
  )
}

export default EndingCollectionScreen
