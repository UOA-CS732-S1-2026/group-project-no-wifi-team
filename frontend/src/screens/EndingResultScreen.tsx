import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  AttributeStat,
  Banner,
  NotebookPanel,
  PaperButton,
} from '../components/common'
import { CountUp } from '../utils/CountUp'
import {
  type AttributeSnapshot,
  type Ending,
  resolveEnding,
  calculateScore,
  TOTAL_SCORE,
} from '../utils/endingResult'

interface EndingLocationState {
  snapshot?: Partial<AttributeSnapshot>
}

const FALLBACK_SNAPSHOT: AttributeSnapshot = {
  intelligence: 70,
  health: 65,
  wealth: 60,
}

function readSnapshot(state: unknown): AttributeSnapshot {
  const incoming = (state as EndingLocationState | null)?.snapshot
  if (!incoming) return FALLBACK_SNAPSHOT
  return {
    intelligence: numberOr(incoming.intelligence, FALLBACK_SNAPSHOT.intelligence),
    health: numberOr(incoming.health, FALLBACK_SNAPSHOT.health),
    wealth: numberOr(incoming.wealth, FALLBACK_SNAPSHOT.wealth),
  }
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function EndingResultScreen() {
  const navigate = useNavigate()
  const location = useLocation()

  const snapshot = useMemo(() => readSnapshot(location.state), [location.state])
  const ending = useMemo(() => resolveEnding(snapshot), [snapshot])
  const score = useMemo(() => calculateScore(snapshot), [snapshot])

  const isHappy = ending.theme === 'happy'

  return (
    <div
      className={`
        flex min-h-dvh w-full items-center justify-center overflow-y-auto px-4 py-8
        ${isHappy
          ? 'bg-[radial-gradient(ellipse_at_30%_60%,var(--color-desk-light)_0%,var(--color-desk-mid)_50%,var(--color-desk-dark)_100%)]'
          : 'bg-[radial-gradient(ellipse_at_30%_60%,#6b5840_0%,#4a3a28_55%,#2c2117_100%)]'}
      `}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="w-full max-w-2xl"
      >
        <NotebookPanel
          spiral={false}
          ruled
          className="rounded-sm px-6 py-10 sm:px-12 sm:py-12"
        >
          <EndingHeader ending={ending} />
          <EndingNarrative ending={ending} />
          <AttributeRow snapshot={snapshot} />
          <ScoreBlock score={score} theme={ending.theme} />
          <ActionRow
            onPlayAgain={() => navigate('/')}
            onViewOthers={() => navigate('/endings')}
          />
        </NotebookPanel>
      </motion.div>
    </div>
  )
}

function EndingHeader({ ending }: { ending: Ending }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Banner tone={ending.theme} className="w-72 sm:w-80">
        <div className="flex items-center justify-center gap-2 text-base sm:text-lg">
          <RankBadge rank={ending.rank} />
          <span>{ending.title}</span>
        </div>
      </Banner>
      <p className="font-serif text-xs uppercase tracking-[0.25em] text-desk-mid">
        {ending.type}
      </p>
    </div>
  )
}

function RankBadge({ rank }: { rank: Ending['rank'] }) {
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-btn-text/60 bg-paper/20 font-serif text-sm font-bold text-btn-text">
      {rank}
    </span>
  )
}

function EndingNarrative({ ending }: { ending: Ending }) {
  return (
    <div className="mt-7 space-y-3 text-center">
      <p className="font-serif text-base leading-relaxed text-desk-dark sm:text-lg">
        {ending.description}
      </p>
      <p className="font-serif text-sm italic leading-relaxed text-desk-mid sm:text-base">
        “{ending.unlockText}”
      </p>
    </div>
  )
}

function AttributeRow({ snapshot }: { snapshot: AttributeSnapshot }) {
  return (
    <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
      <AttributeStat kind="intelligence" value={snapshot.intelligence} />
      <AttributeStat kind="health" value={snapshot.health} />
      <AttributeStat kind="wealth" value={snapshot.wealth} />
    </div>
  )
}

function ScoreBlock({ score, theme }: { score: number; theme: 'happy' | 'bad' }) {
  const accent = theme === 'happy' ? 'text-emerald-800' : 'text-red-800'
  return (
    <div className="mt-8 flex flex-col items-center gap-1 border-t border-desk-light/60 pt-6">
      <p className="font-serif text-xs uppercase tracking-[0.25em] text-desk-mid">
        Final Score
      </p>
      <p className={`font-serif text-5xl font-bold ${accent} sm:text-6xl`}>
        <CountUp from={0} to={score} duration={1.4} />
        <span className="font-serif text-2xl text-desk-mid sm:text-3xl"> / {TOTAL_SCORE}</span>
      </p>
    </div>
  )
}

function ActionRow({
  onPlayAgain,
  onViewOthers,
}: {
  onPlayAgain: () => void
  onViewOthers: () => void
}) {
  return (
    <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5">
      <PaperButton variant="primary" size="lg" onClick={onPlayAgain}>
        Play Again
      </PaperButton>
      <PaperButton variant="secondary" size="lg" onClick={onViewOthers}>
        View Others
      </PaperButton>
    </div>
  )
}
