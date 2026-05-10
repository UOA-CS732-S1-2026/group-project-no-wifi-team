import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {
  buttonBack,
  endingBg,
  endingReplayButton,
  endingTitleBanner,
} from '../assets/EndingCollection'
import {
  AchievementModal,
  EndingCard,
  ProgressPanel,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  StatusStateView,
  useResponsiveStageScale,
  type BackendEndingItem,
  type EndingsApiResponse,
  type LatestGameResultResponse,
} from '../components/EndingCollectionScreen'
import { get } from '../utils/request'
import type { RootState } from '../store'

type UserAchievementsResponse = {
  achievements: string[]
}

export function EndingCollectionScreen() {
  const navigate = useNavigate()
  const { scale: stageScale, isMobile } = useResponsiveStageScale()
  const reduxEarnedAchievements = useSelector((s: RootState) => s.game.earnedAchievements)
  const localResults = useSelector((s: RootState) => s.gameHistory.records)
  const latestLocalResult = localResults[localResults.length - 1] ?? null

  const [showAchievements, setShowAchievements] = useState(false)
  const [endings, setEndings] = useState<BackendEndingItem[]>([])
  const [latestEndingId, setLatestEndingId] = useState<string | null>(null)
  const [latestAchievements, setLatestAchievements] = useState<string[]>([])
  const [storedAchievements, setStoredAchievements] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchEndings() {
      try {
        setLoading(true)
        setError('')

        const userId = localStorage.getItem('guestId') || localStorage.getItem('guest_id')
        const username = localStorage.getItem('username')
        const userHeaders = userId ? { headers: { 'x-user-id': userId } } : undefined
        const guestUnlockedEndingIds = new Set(
          userId ? [] : localResults.map((record) => record.endingId),
        )

        const result = await get<EndingsApiResponse>('/endings', userHeaders)

        if (!result.success) {
          throw new Error(result.message || 'Failed to load endings')
        }

        let currentEndingId: string | null = latestLocalResult?.endingId ?? null
        let currentAchievements: string[] = latestLocalResult?.achievements ?? []

        if (!currentEndingId && userHeaders) {
          try {
            const latest = await get<LatestGameResultResponse>(
              '/game/result/latest',
              userHeaders,
            )
            currentEndingId = latest.data.endingId
            currentAchievements = latest.data.achievements ?? []
          } catch {
            // No saved result yet; keep the full collection locked as returned by backend.
          }
        }

        setLatestEndingId(currentEndingId)
        setLatestAchievements(currentAchievements)

        if (username) {
          try {
            const userAchievements = await get<UserAchievementsResponse>(
              `/user/achievements/${encodeURIComponent(username)}`,
            )
            setStoredAchievements(userAchievements.achievements ?? [])
          } catch {
            setStoredAchievements([])
          }
        } else {
          setStoredAchievements([])
        }

        setEndings(
          result.data.map((ending) =>
            ending.endingId === currentEndingId || guestUnlockedEndingIds.has(ending.endingId)
              ? { ...ending, status: 'Unlocked' as const }
              : ending,
          ),
        )
      } catch (err) {
        console.error(err)
        setError('Failed to load ending collection from backend.')
      } finally {
        setLoading(false)
      }
    }

    fetchEndings()
  }, [latestLocalResult, localResults])

  const unlockedCount = useMemo(() => {
    return endings.filter((ending) => ending.status === 'Unlocked').length
  }, [endings])

  const lockedCount = endings.length - unlockedCount

  const progressPercent =
    endings.length === 0 ? 0 : Math.round((unlockedCount / endings.length) * 100)
  const playerName = localStorage.getItem('username') || 'Guest'
  const earnedAchievementKeys = useMemo(
    () => {
      const hasLoggedInUser = Boolean(localStorage.getItem('guestId') || localStorage.getItem('guest_id'))
      const guestAchievements = hasLoggedInUser
        ? []
        : localResults.flatMap((record) => record.achievements)

      return Array.from(new Set([
        ...reduxEarnedAchievements,
        ...latestAchievements,
        ...storedAchievements,
        ...guestAchievements,
      ]))
    },
    [reduxEarnedAchievements, latestAchievements, storedAchievements, localResults],
  )
  const handleBackToResult = () => {
    navigate('/ending-result', {
      state: latestLocalResult
        ? {
            snapshot: latestLocalResult.snapshot,
            playerName: latestLocalResult.playerName,
          }
        : undefined,
    })
  }

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
              Please make sure your backend is running and reachable at the configured API URL:
              <br />
              <span className="font-bold">/api/endings</span>
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
        Mobile optimization:
        - Outer size = scaled stage size
        - Inner stage = original 1365 x 1040
        - Background and components scale together
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
          {/* Back */}
          <button
            type="button"
            onClick={handleBackToResult}
            className="absolute left-[100px] top-[10px] z-30 w-[210px] transition duration-200 hover:scale-105 active:scale-95"
            aria-label="Back to Ending Result"
          >
            <img src={buttonBack} alt="Back to Ending Result" className="w-full" />
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
            playerName={playerName}
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
                <EndingCard
                  key={ending.endingId}
                  ending={ending}
                  isCurrent={ending.endingId === latestEndingId}
                />
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

      {showAchievements && (
        <AchievementModal
          earnedKeys={earnedAchievementKeys}
          onClose={() => setShowAchievements(false)}
        />
      )}
    </main>
  )
}

export default EndingCollectionScreen
