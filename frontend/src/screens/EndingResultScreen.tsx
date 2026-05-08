import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'motion/react'
import type { AppDispatch, RootState } from '../store'

import {
  type AttributeSnapshot,
  resolveEnding,
  calculateScore,
} from '../utils/endingResult'
import { addRecord, LAST_RESULT_KEY } from '../store/gameHistorySlice'
import { generateId, type GameResult } from '../utils/gameResultTypes'
import { post } from '../utils/request'

// ── Assets ────────────────────────────────────────────────────────────────────
import commonBg            from '../assets/CommonImage/common-background.png'
import endingMiddleBg      from '../assets/endingPage-image/ending-middle-bg.png'
import rankingListBanner   from '../assets/endingPage-image/ranking-list-banner.png'
import achGraduate         from '../assets/endingPage-image/achievement-card-graduate.png'
import achCulturalExplorer from '../assets/endingPage-image/achievement-card-cultural-explorer.png'
import achGlobalAdventurer from '../assets/endingPage-image/achievement-card-global-adventurer.png'
import btnAchCollection    from '../assets/endingPage-image/button-achievement-collection.png'

// ── Achievement pool — order matches unlock priority ──────────────────────────
const ALL_ACHIEVEMENTS = [achGraduate, achCulturalExplorer, achGlobalAdventurer]
const ACHIEVEMENT_IDS = ['graduate', 'cultural-explorer', 'global-adventurer']
const ACH_COUNT_BY_RANK: Record<string, number> = { S: 3, A: 2, B: 1, C: 0 }

// ── Location state ────────────────────────────────────────────────────────────
interface EndingLocationState {
  snapshot?:   Partial<AttributeSnapshot>
  playerName?: string
}

const FALLBACK_SNAPSHOT: AttributeSnapshot = { intelligence: 70, health: 65, wealth: 60 }

function readSnapshot(state: unknown): AttributeSnapshot {
  const incoming = (state as EndingLocationState | null)?.snapshot
  if (!incoming) return FALLBACK_SNAPSHOT
  return {
    intelligence: numOr(incoming.intelligence, FALLBACK_SNAPSHOT.intelligence),
    health:       numOr(incoming.health,        FALLBACK_SNAPSHOT.health),
    wealth:       numOr(incoming.wealth,        FALLBACK_SNAPSHOT.wealth),
  }
}

function numOr(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

// ── Component ─────────────────────────────────────────────────────────────────
export function EndingResultScreen() {
  const navigate          = useNavigate()
  const location          = useLocation()
  const dispatch          = useDispatch<AppDispatch>()
  const selectedCharacter = useSelector((s: RootState) => s.game.selectedCharacter)
  const [showRankingsNotice, setShowRankingsNotice] = useState(false)
  const hasFired       = useRef(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const snapshot   = useMemo(() => readSnapshot(location.state),  [location.state])
  const ending     = useMemo(() => resolveEnding(snapshot),       [snapshot])
  const score      = useMemo(() => calculateScore(snapshot),      [snapshot])

  const playerName = selectedCharacter?.title
    ?? (location.state as EndingLocationState | null)?.playerName
    ?? 'Player'
  const characterId = selectedCharacter?.id ?? null

  const [resultId] = useState(() => generateId())

  // Guard prevents the double-invocation React 18 StrictMode causes in dev.
  useEffect(() => {
    if (hasFired.current) return
    hasFired.current = true

    const now = Date.now()
    const achCount = ACH_COUNT_BY_RANK[ending.rank] ?? 0
    const achievements = ACHIEVEMENT_IDS.slice(0, achCount)

    const record: GameResult = {
      id:          resultId,
      characterId,
      playerName,
      score,
      endingId:    ending.id,
      endingTitle: ending.title,
      endingRank:  ending.rank,
      endingTheme: ending.theme,
      snapshot,
      achievements,
      timestamp:   now,
    }
    dispatch(addRecord(record))
    try { localStorage.setItem(LAST_RESULT_KEY, resultId) } catch { /* quota */ }

    // Persist result to backend and auto-unlock the collection ending (fire-and-forget)
    const userId = localStorage.getItem('guestId') || localStorage.getItem('guest_id') || null
    post('/game/result', {
      userId,
      characterId,
      playerName,
      score,
      endingId:    ending.id,
      endingTitle: ending.title,
      endingRank:  ending.rank,
      endingTheme: ending.theme,
      snapshot,
      achievements,
      timestamp:   now,
    }).catch(() => { /* offline or server unavailable — localStorage copy remains */ })
  }, [dispatch, resultId, ending, score, snapshot, playerName, characterId])

  // Move focus into the dialog when it opens for keyboard/screen-reader accessibility.
  useEffect(() => {
    if (showRankingsNotice) closeButtonRef.current?.focus()
  }, [showRankingsNotice])

  const achievementImages = ALL_ACHIEVEMENTS.slice(0, ACH_COUNT_BY_RANK[ending.rank] ?? 0)

  // Shared spring ease
  const spring = { ease: [0.22, 1, 0.36, 1] as const }

  return (
    <div className="er-screen">

      {/* ── Background ─────────────────────────────────────────────────────── */}
      <img src={commonBg} alt="" aria-hidden="true" className="er-bg" />

      {/* ── Ranking List banner (viewport-relative) ─────────────────────────── */}
      <motion.button
        className="er-banner"
        onClick={() => setShowRankingsNotice(true)}
        aria-label="Ranking List"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ...spring }}
      >
        <img src={rankingListBanner} alt="Ranking List" />
      </motion.button>

      {/* ── Card position wrapper (centering via CSS transform) ─────────────── */}
      <div className="er-card-wrap">
        <motion.div
          className="er-card"
          style={{ backgroundImage: `url(${endingMiddleBg})` }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ...spring }}
        >
          {/* Title row */}
          <motion.div
            className="er-title-row"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ...spring }}
          >
            <span className="er-title-ending">ENDING</span>
            <span className="er-title-name">{ending.title}</span>
          </motion.div>

          {/* Gold divider */}
          <motion.hr
            className="er-divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{ transformOrigin: 'left' }}
            transition={{ duration: 0.5, delay: 0.28 }}
          />

          {/* Description */}
          <motion.p
            className="er-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.38 }}
          >
            {ending.description}
          </motion.p>

          {/* Achievement cards (margin-top:auto pushes to card bottom) */}
          {achievementImages.length > 0 && (
            <motion.div
              className="er-achievements"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.48, ...spring }}
            >
              {achievementImages.map((src, i) => (
                <img key={i} src={src} alt={`Achievement ${i + 1}`} />
              ))}
            </motion.div>
          )}

          {/* Achievement Collection button — inside card, centered at bottom */}
          <motion.button
            className="er-collect-btn"
            onClick={() => navigate('/endings')}
            aria-label="Achievement Collection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <img src={btnAchCollection} alt="" aria-hidden="true" />
          </motion.button>
        </motion.div>
      </div>

      {/* ── Rankings "not available" notice ──────────────────────────────────── */}
      {showRankingsNotice && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="rankings-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm"
          onKeyDown={(e) => { if (e.key === 'Escape') setShowRankingsNotice(false) }}
        >
          <div className="relative w-full max-w-sm rounded-[2rem] border-4 border-[#7a4b2b] bg-[#f7e8c6] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] text-center">
            <div className="rounded-[1.5rem] border-2 border-[#c49a61] bg-[#fff7df]/80 px-5 py-5 shadow-inner">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#9a6a3e]">Ranking List</p>
              <h2 id="rankings-dialog-title" className="mt-2 text-2xl font-bold text-[#7a4b2b]">Coming Soon</h2>
              <p className="mx-auto mt-3 text-sm leading-relaxed text-[#8a6446]">
                This feature is not available yet. Check back later!
              </p>
            </div>
            <button
              type="button"
              ref={closeButtonRef}
              onClick={() => setShowRankingsNotice(false)}
              className="mx-auto mt-5 block rounded-full border-2 border-[#6b3f25] bg-[#9a5f2d] px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fff3d2] shadow-md transition hover:-translate-y-0.5 hover:bg-[#7a4b2b] active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
