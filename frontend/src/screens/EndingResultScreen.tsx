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
const ALL_ACHIEVEMENTS = [
  { src: achGraduate,         rowClass: '[@media(orientation:landscape)]:w-[26vw] [@media(orientation:landscape)]:mb-[1vh]' },
  { src: achCulturalExplorer, rowClass: '[@media(orientation:landscape)]:w-[27vw] [@media(orientation:landscape)]:mb-[1.5vh]' },
  { src: achGlobalAdventurer, rowClass: '[@media(orientation:landscape)]:w-[26vw] [@media(orientation:landscape)]:mb-[1vh]' },
]
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

const BTN_ANIM = {
  whileHover: { scale: 1.05, transition: { duration: 0.15 } },
  whileTap:   { scale: 0.95, filter: 'drop-shadow(0 4px 16px rgba(40,20,5,0.65))', transition: { duration: 0.08 } },
}

// ── Component ─────────────────────────────────────────────────────────────────
export function EndingResultScreen() {
  const navigate          = useNavigate()
  const location          = useLocation()
  const dispatch          = useDispatch<AppDispatch>()
  const selectedCharacter = useSelector((s: RootState) => s.game.selectedCharacter)
  const [showRankingsNotice, setShowRankingsNotice] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const snapshot   = useMemo(() => readSnapshot(location.state),  [location.state])
  const ending     = useMemo(() => resolveEnding(snapshot),       [snapshot])
  const score      = useMemo(() => calculateScore(snapshot),      [snapshot])

  const playerName = selectedCharacter?.title
    ?? (location.state as EndingLocationState | null)?.playerName
    ?? 'Player'
  const characterId = selectedCharacter?.id ?? null

  const [resultId] = useState(() => generateId())

  const achCount = ACH_COUNT_BY_RANK[ending.rank] ?? 0

  // Deduplicate by resultId so re-mounts (e.g. StrictMode) don't double-submit.
  useEffect(() => {
    if (localStorage.getItem(LAST_RESULT_KEY) === resultId) return

    const now = Date.now()
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
  }, [dispatch, resultId, ending, score, snapshot, playerName, characterId, achCount])

  // Move focus into the dialog when it opens for keyboard/screen-reader accessibility.
  useEffect(() => {
    if (showRankingsNotice) closeButtonRef.current?.focus()
  }, [showRankingsNotice])


  // Shared spring ease
  const spring = { ease: [0.22, 1, 0.36, 1] as const }

  return (
    <div
      className="relative w-screen h-dvh overflow-hidden font-serif"
      style={{ backgroundImage: `url(${commonBg})`, backgroundSize: '100% 100%' }}
    >

      {/* ── Card ────────────────────────────────────────────────────────────── */}
      <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-10">
        <motion.div
          className="relative w-[89vw] h-[86vh] [background-size:100%_100%] pt-[14vh] px-[9vw] flex flex-col"
          style={{ backgroundImage: `url(${endingMiddleBg})` }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ...spring }}
        >
          {/* Title row + divider — wrapped so divider right-aligns with subtitle */}
          <motion.div
            className="grid grid-cols-[min-content] self-start shrink-0"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ...spring }}
          >
            <div className="flex items-baseline gap-[3.5vw]">
              <span className="text-[4vw] font-black uppercase text-[#3d2b1f] leading-none whitespace-nowrap tracking-wide [transform:scaleY(1.6)]" style={{ fontFamily: "Georgia, Cambria, serif" }}>ENDING</span>
              <span className="text-[2.6vw] font-bold text-[#4a3120] leading-none whitespace-nowrap tracking-wide [transform:scaleY(1.2)]" style={{ fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif' }}>{ending.title}</span>
            </div>
            <motion.hr
              className="w-full h-px bg-[#ae7437] border-0 mt-[3.5vh] mb-[3vh]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ transformOrigin: 'left' }}
              transition={{ duration: 0.5, delay: 0.28 }}
            />

            {/* Description — inside wrapper so right edge aligns with subtitle */}
            <motion.p
              className="text-[1.4vw] font-normal text-[#2D3A3A] leading-[1.4] m-0"
              style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.38 }}
            >
              {ending.description}
            </motion.p>
          </motion.div>

          {/* Achievement cards row */}
          <motion.div
            className="absolute bottom-[10vh] left-0 right-0 flex flex-col items-center [@media(orientation:landscape)]:flex-row [@media(orientation:landscape)]:justify-center [@media(orientation:landscape)]:items-end"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.48, ...spring }}
          >
            {ALL_ACHIEVEMENTS.slice(0, achCount).map(({ src, rowClass }, i) => (
              <img
                key={i}
                src={src}
                alt={`Achievement ${i + 1}`}
                className={`h-[16vh] w-auto [@media(orientation:landscape)]:h-auto ${rowClass} block transition-transform duration-[180ms] ease-out hover:-translate-y-[3px] hover:scale-[1.04] active:scale-[0.96]`}
              />
            ))}
          </motion.div>

        </motion.div>

        {/* ── Ranking List banner — anchored to card top-right corner ──────────── */}
        <motion.button
          className="absolute top-[6vh] right-[9vw] p-0 cursor-pointer"
          onClick={() => setShowRankingsNotice(true)}
          aria-label="Ranking List"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.15, ...spring } }}
          {...BTN_ANIM}
          style={{ filter: 'drop-shadow(0 4px 12px rgba(40,20,5,0.5))' }}
        >
          <img src={rankingListBanner} alt="Ranking List" className="h-[min(26vw,32vh)] block" />
        </motion.button>
      </div>

      {/* ── Achievement Collection button ────────────────────────────────────── */}
      <motion.button
        className="absolute right-[9.8vw] bottom-[9.6vh] z-[11] p-0 cursor-pointer"
        onClick={() => navigate('/endings')}
        aria-label="Achievement Collection"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.6 } }}
        {...BTN_ANIM}
      >
        <img src={btnAchCollection} alt="Achievement Collection" aria-hidden="true" className="w-[24vw] block" />
      </motion.button>

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
            <motion.button
              type="button"
              ref={closeButtonRef}
              onClick={() => setShowRankingsNotice(false)}
              className="mx-auto mt-5 block rounded-full border-2 border-[#6b3f25] bg-[#9a5f2d] px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fff3d2] shadow-md"
              {...BTN_ANIM}
            >
              Close
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}
