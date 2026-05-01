import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  endingBackHome,
  endingBg,
  endingReplayButton,
  endingTitleBanner,
} from '../assets/ending-collection'
import {
  AchievementModal,
  API_BASE_URL,
  EndingCard,
  ProgressPanel,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  StatusStateView,
  useResponsiveStageScale,
  type BackendEndingItem,
  type EndingsApiResponse,
} from '../components/EndingCollectionScreen'

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
      <StatusStateView
        title="Loading ending collection..."
        description="Connecting to backend server."
      />
    )
  }

  if (error) {
    return (
      <StatusStateView
        title="Failed to load data"
        description={error}
        extra={
          <>
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
          </>
        }
      />
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

          <ProgressPanel
            unlockedCount={unlockedCount}
            totalCount={endings.length}
            lockedCount={lockedCount}
            progressPercent={progressPercent}
            onViewAchievements={() => setShowAchievements(true)}
          />

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
