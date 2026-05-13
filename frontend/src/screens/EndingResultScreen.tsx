import { useEffect, useMemo, useState } from 'react'
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
import { fetchAchievements, getEarnedCategories } from '../api/achievements'
import { AchievementCategoryModal } from '../components/EndingResultScreen/AchievementCategoryModal'
import { RankingListModal } from '../components/EndingResultScreen/RankingListModal'
import { SettingsModal } from '../components/TitleScreen/SettingsModal'
import { endingBgm, useMusicContext } from '../contexts/MusicContext'

// ── Assets ────────────────────────────────────────────────────────────────────
import commonBg          from '../assets/CommonImage/common-background.png'
import backHomeBtnImg    from '../assets/CommonImage/back-home-btn.png'
import endingCollectBtnImg from '../assets/endingPage-image/button-endingcollect.png'
import settingImg        from '../assets/CommonImage/setting.png'
import endingMiddleBg    from '../assets/endingPage-image/ending-middle-bg.png'
import rankingListBanner from '../assets/endingPage-image/ranking-list-banner.png'
import achStudyImg   from '../assets/endingPage-image/achievement-study.png'
import achHealthImg  from '../assets/endingPage-image/achievement-health.png'
import achWealthImg  from '../assets/endingPage-image/achievement-wealth.png'
import achCrownImg   from '../assets/endingPage-image/achievement-crown.png'
import { endingReplayButton } from '../assets/EndingCollection'

// ── Category definitions ──────────────────────────────────────────────────────
const CATEGORY_BUTTONS: Record<string, { label: string; src: string }> = {
  Study:  { label: 'Study',  src: achStudyImg },
  Health: { label: 'Health', src: achHealthImg },
  Wealth: { label: 'Wealth', src: achWealthImg },
  Crown:  { label: 'Crown',  src: achCrownImg },
}
const CATEGORY_ORDER = ['Study', 'Health', 'Wealth', 'Crown']

// ── Location state ────────────────────────────────────────────────────────────
interface EndingLocationState {
  snapshot?:   Partial<AttributeSnapshot>
  playerName?: string
}

const FALLBACK_SNAPSHOT: AttributeSnapshot = { intelligence: 7, health: 6, wealth: 6 }

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

// ── Unified button animations ─────────────────────────────────────────────────
const baseBtnFilter = 'drop-shadow(0 4px 12px rgba(40,20,5,0.4)) brightness(1)'
const hoverBtnFilter = 'drop-shadow(0 6px 18px rgba(40,20,5,0.6)) brightness(1.1)'
const tapBtnFilter = 'drop-shadow(0 2px 6px rgba(40,20,5,0.4)) brightness(0.9)'

// ── Component ─────────────────────────────────────────────────────────────────
export function EndingResultScreen() {
  const navigate           = useNavigate()
  const location          = useLocation()
  const dispatch          = useDispatch<AppDispatch>()
  const selectedCharacter = useSelector((s: RootState) => s.game.selectedCharacter)
  const earnedAchievements = useSelector((s: RootState) => s.game.earnedAchievements)
  const auth = useSelector((s: RootState) => s.auth)
  const { musicEnabled, setMusicEnabled, sfxEnabled, setSfxEnabled, setCustomBgm } = useMusicContext()

  useEffect(() => {
    setCustomBgm(endingBgm)
    return () => setCustomBgm(null)
  }, [setCustomBgm])

  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showRankingsModal, setShowRankingsModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [earnedCategories, setEarnedCategories] = useState<string[]>([])

  // Typewriter state
  const [revealedLen, setRevealedLen] = useState(0)
  const [descFullyRevealed, setDescFullyRevealed] = useState(false)

  const snapshot   = useMemo(() => readSnapshot(location.state),  [location.state])
  const ending     = useMemo(() => resolveEnding(snapshot),       [snapshot])
  const score      = useMemo(() => calculateScore(snapshot),      [snapshot])

  const playerName = selectedCharacter?.title
    ?? (location.state as EndingLocationState | null)?.playerName
    ?? 'Player'
  const characterId = selectedCharacter?.id ?? null

  const [resultId] = useState(() => generateId())

  // Resolve earned categories from achievement keys
  useEffect(() => {
    fetchAchievements().finally(() => {
      setEarnedCategories(getEarnedCategories(earnedAchievements))
    })
  }, [earnedAchievements])

  // Sorted categories for display
  const visibleCategories = useMemo(
    () => CATEGORY_ORDER.filter((c) => earnedCategories.includes(c)),
    [earnedCategories],
  )

  // Typewriter effect for description text
  const descText = ending.description
  useEffect(() => {
    if (descFullyRevealed) {
      setRevealedLen(descText.length)
      return
    }
    setRevealedLen(0)
    let intervalId: ReturnType<typeof setInterval>
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setRevealedLen((prev) => {
          if (prev >= descText.length) {
            clearInterval(intervalId)
            return prev
          }
          return prev + 1
        })
      }, 30)
    }, 700)
    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [descText, descFullyRevealed])

  // Deduplicate by resultId so re-mounts (e.g. StrictMode) don't double-submit.
  useEffect(() => {
    if (localStorage.getItem(LAST_RESULT_KEY) === resultId) return

    const now = Date.now()

    const record: GameResult = {
      id:          resultId,
      characterId,
      playerName,
      userId:      auth.userId,
      score,
      endingId:    ending.id,
      endingTitle: ending.title,
      endingRank:  ending.rank,
      endingTheme: ending.theme,
      snapshot,
      achievements: earnedAchievements,
      timestamp:   now,
    }
    dispatch(addRecord(record))
    try { localStorage.setItem(LAST_RESULT_KEY, resultId) } catch { /* quota */ }

    // Logged-in players persist to backend; guests keep their results in local game history only.
    if (auth.token) {
      post('/game/result', {
        characterId,
        playerName,
        score,
        endingId:    ending.id,
        endingTitle: ending.title,
        endingRank:  ending.rank,
        endingTheme: ending.theme,
        snapshot,
        achievements: earnedAchievements,
        timestamp:   now,
      }).catch(() => { /* offline or server unavailable — localStorage copy remains */ })
    }
  }, [dispatch, resultId, ending, score, snapshot, playerName, characterId, earnedAchievements, auth.token])

  // Inject button-filter styles once instead of re-creating on every render
  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = `
      .btn-filter { filter: ${baseBtnFilter}; transition: filter 0.1s ease, transform 0.1s ease, rotate 0.2s ease; }
      .btn-filter:hover { filter: ${hoverBtnFilter}; }
      .btn-filter:active { filter: ${tapBtnFilter}; }
    `
    document.head.appendChild(el)
    return () => { el.remove() }
  }, [])

  // Shared spring ease
  const spring = { type: 'spring' as const, stiffness: 300, damping: 20 }

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
          {/* Title row + divider + description — individual entry animations */}
          <div className="grid grid-cols-[min-content] self-start shrink-0">
            <div className="flex flex-col items-start gap-[2.2vh]">
              {/* Wave 1: main title */}
              <motion.span
                className="pl-[0.2vw] text-[4vw] font-black uppercase text-[#3d2b1f] leading-none whitespace-nowrap tracking-wide"
                style={{ fontFamily: "Georgia, Cambria, serif" }}
                initial={{ opacity: 0, x: -8, scaleY: 1.2 }}
                animate={{ opacity: 1, x: 0, scaleY: 1.2 }}
                transition={{ duration: 0.5, delay: 0.1, ...spring }}
              >
                ENDING
              </motion.span>
              {/* Wave 2: subtitle */}
              <motion.span
                className="pl-[0.3vw] text-[2.8vw] font-bold text-[#4a3120] leading-none whitespace-nowrap tracking-wide"
                style={{ fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif' }}
                initial={{ opacity: 0, x: -4, scaleY: 1.1 }}
                animate={{ opacity: 1, x: 0, scaleY: 1.1 }}
                transition={{ duration: 0.5, delay: 0.4, ...spring }}
              >
                {ending.title}
              </motion.span>
            </div>
            {/* Wave 3: divider */}
            <motion.hr
              className="w-[calc(100%+4vw)] h-px bg-[#ae7437] border-0 mt-[1.8vh] mb-[1.8vh]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ transformOrigin: 'left' }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
            {/* Wave 3: streaming description */}
            <motion.p
              className="pl-[0.6vw] text-[1.4vw] font-normal text-[#2D3A3A] leading-[1.5] m-0 w-[calc(100%+4vw)] select-none"
              style={{
                fontFamily: 'Georgia, Cambria, "Times New Roman", serif',
                cursor: descFullyRevealed ? 'default' : 'pointer',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              onClick={() => {
                if (!descFullyRevealed) setDescFullyRevealed(true)
              }}
            >
              {descFullyRevealed ? descText : descText.slice(0, revealedLen)}
              {!descFullyRevealed && revealedLen < descText.length && (
                <span className="animate-pulse text-[#ae7437]">|</span>
              )}
            </motion.p>
          </div>

          {/* Achievement category buttons */}
          {visibleCategories.length > 0 && (
            <motion.div
              className="absolute bottom-[18vh] left-0 right-0 flex flex-col md:flex-row justify-center items-center md:items-end gap-[1.5vh] md:gap-[1.5vw] px-[4vw]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8, ...spring }}
            >
              {visibleCategories.map((cat) => (
                <button
                  key={cat}
                  className="p-0 cursor-pointer btn-filter hover:scale-105 active:scale-95"
                  onClick={() => setSelectedCategory(cat)}
                  aria-label={`${cat} Achievements`}
                  style={{ filter: baseBtnFilter }}
                >
                  <img
                    src={CATEGORY_BUTTONS[cat].src}
                    alt={CATEGORY_BUTTONS[cat].label}
                    className="h-[min(16vh,22vw)] md:h-[min(18vh,14vw)] w-auto block"
                  />
                </button>
              ))}
            </motion.div>
          )}

        </motion.div>

        {/* Ranking List banner */}
        <motion.button
          className="absolute top-[4.5vh] right-[9vw] p-0 cursor-pointer btn-filter hover:scale-105 active:scale-95"
          onClick={() => setShowRankingsModal(true)}
          aria-label="Ranking List"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ...spring }}
          style={{ filter: baseBtnFilter }}
        >
          <img src={rankingListBanner} alt="Ranking List" className="h-[min(26vw,34vh)] block" />
        </motion.button>
      </div>

      {/* ── Navigation Buttons ─────────────────────────────────────── */}
      <motion.button
        className="absolute top-[3vh] left-[2vw] z-30 p-0 cursor-pointer btn-filter hover:scale-105 active:scale-95"
        onClick={() => navigate('/')}
        aria-label="Back to Home"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ...spring }}
      >
        <img src={backHomeBtnImg} alt="Back to Home" className="h-[min(10vh,8vw)] w-auto block" />
      </motion.button>

      <motion.button
        className="absolute top-[1.5vh] right-[2vw] z-30 p-0 cursor-pointer btn-filter hover:scale-105 active:scale-95"
        onClick={() => navigate('/endings')}
        aria-label="Ending Collection"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.8, ...spring }}
      >
        <img src={endingCollectBtnImg} alt="Ending Collection" className="h-[min(12vh,10vw)] w-auto block" />
      </motion.button>

      {/* Replay — bottom-center */}
      <motion.button
        className="absolute bottom-[4vh] left-1/2 -translate-x-1/2 z-30 p-0 cursor-pointer btn-filter hover:scale-105 active:scale-95"
        onClick={() => navigate('/')}
        aria-label="Replay"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8, ...spring }}
      >
        <img src={endingReplayButton} alt="Replay" className="h-[min(12vh,10vw)] w-auto block" />
      </motion.button>

      {/* Settings — bottom-right */}
      <button
        type="button"
        onClick={() => setShowSettingsModal(true)}
        className="fixed bottom-[2vh] right-[2vw] z-30 w-[54px] transition duration-200 hover:rotate-45 hover:scale-110 active:scale-95 sm:w-[74px]"
        aria-label="Settings"
      >
        <img src={settingImg} alt="Settings" className="w-full drop-shadow-lg" />
      </button>

      {/* ── Rankings modal ────────────────────────────────────────────────── */}
      {showRankingsModal && (
        <RankingListModal onClose={() => setShowRankingsModal(false)} />
      )}

      {/* ── Achievement category detail modal ──────────────────────────────── */}
      {selectedCategory && (
        <AchievementCategoryModal
          category={selectedCategory}
          earnedKeys={earnedAchievements}
          onClose={() => setSelectedCategory(null)}
        />
      )}

      {/* ── Settings modal ────────────────────────────────────────────────── */}
      {showSettingsModal && (
        <SettingsModal
          musicEnabled={musicEnabled}
          sfxEnabled={sfxEnabled}
          onMusicToggle={setMusicEnabled}
          onSfxToggle={setSfxEnabled}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  )
}
