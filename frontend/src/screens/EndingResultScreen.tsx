import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'motion/react'

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
  const navigate  = useNavigate()
  const location  = useLocation()
  const dispatch  = useDispatch()

  const snapshot   = useMemo(() => readSnapshot(location.state),  [location.state])
  const ending     = useMemo(() => resolveEnding(snapshot),       [snapshot])
  const score      = useMemo(() => calculateScore(snapshot),      [snapshot])
  const playerName = (location.state as EndingLocationState | null)?.playerName ?? 'Player'

  const [resultId] = useState(() => generateId())

  useEffect(() => {
    const now = Date.now()
    const record: GameResult = {
      id:          resultId,
      playerName,
      score,
      endingId:    ending.id,
      endingTitle: ending.title,
      endingRank:  ending.rank,
      endingTheme: ending.theme,
      snapshot,
      timestamp:   now,
    }
    dispatch(addRecord(record))
    try { localStorage.setItem(LAST_RESULT_KEY, resultId) } catch { /* quota */ }

    // Persist result to backend and auto-unlock the collection ending (fire-and-forget)
    const userId = localStorage.getItem('guestId') || localStorage.getItem('guest_id') || null
    post('/game/result', {
      userId,
      playerName,
      score,
      endingId:    ending.id,
      endingTitle: ending.title,
      endingRank:  ending.rank,
      endingTheme: ending.theme,
      snapshot,
      timestamp:   now,
    }).catch(() => { /* offline or server unavailable — localStorage copy remains */ })
  }, [dispatch, resultId])

  const achievements = ALL_ACHIEVEMENTS.slice(0, ACH_COUNT_BY_RANK[ending.rank] ?? 0)

  // Shared spring ease
  const spring = { ease: [0.22, 1, 0.36, 1] as const }

  return (
    <div className="er-screen">

      {/* ── Background ─────────────────────────────────────────────────────── */}
      <img src={commonBg} alt="" aria-hidden="true" className="er-bg" />

      {/* ── Ranking List banner (viewport-relative) ─────────────────────────── */}
      <motion.button
        className="er-banner"
        onClick={() => navigate('/rankings')}
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
          {achievements.length > 0 && (
            <motion.div
              className="er-achievements"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.48, ...spring }}
            >
              {achievements.map((src, i) => (
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

    </div>
  )
}
