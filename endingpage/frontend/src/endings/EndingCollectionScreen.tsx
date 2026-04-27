import { useNavigate } from 'react-router-dom'
import backgroundImg from '../assets/background.jpg'

type Ending = {
  id: string
  title: string
  rank: 'S' | 'A' | 'B' | '?'
  unlocked: boolean
  icon: string
  description: string
  requirement: string
}

const endings: Ending[] = [
  {
    id: 'graduate',
    title: 'Academic Graduate',
    rank: 'S',
    unlocked: true,
    icon: '🎓',
    description: 'You kept your grades high, submitted every assignment on time, and survived the semester like a legend.',
    requirement: 'High intelligence + stable health',
  },
  {
    id: 'social',
    title: 'Social Connector',
    rank: 'A',
    unlocked: true,
    icon: '☕',
    description: 'You built a strong friend group, joined events, and somehow knew everyone on campus.',
    requirement: 'High social score',
  },
  {
    id: 'broke',
    title: 'Broke Survivor',
    rank: 'B',
    unlocked: true,
    icon: '📱',
    description: 'Your bank balance suffered, but your survival skills became terrifyingly strong.',
    requirement: 'Low wealth + completed month',
  },
  {
    id: 'health',
    title: 'Health Comeback',
    rank: 'S',
    unlocked: true,
    icon: '🏃',
    description: 'You fixed your sleep schedule, exercised regularly, and stopped treating coffee as a food group.',
    requirement: 'Excellent health',
  },
  {
    id: 'worker',
    title: 'Part-time Hero',
    rank: 'A',
    unlocked: true,
    icon: '💼',
    description: 'You balanced lectures, shifts, and deadlines. Your time management skill reached max level.',
    requirement: 'Work route + balanced stats',
  },
  {
    id: 'hidden-campus',
    title: 'Hidden Campus Route',
    rank: '?',
    unlocked: false,
    icon: '🔒',
    description: 'A secret ending waiting behind a very specific set of choices.',
    requirement: 'Locked',
  },
  {
    id: 'flatmate',
    title: 'Mysterious Flatmate Story',
    rank: '?',
    unlocked: false,
    icon: '🔒',
    description: 'The details are still unknown. Try different social and housing decisions.',
    requirement: 'Locked',
  },
  {
    id: 'easter-egg',
    title: 'Final Easter Egg',
    rank: '?',
    unlocked: false,
    icon: '🔒',
    description: 'Only players who explore unusual choices can discover this ending.',
    requirement: 'Locked',
  },
]

function rankClass(rank: Ending['rank']) {
  if (rank === 'S') return 'bg-yellow-200 text-yellow-900 border-yellow-700'
  if (rank === 'A') return 'bg-orange-100 text-orange-900 border-orange-700'
  if (rank === 'B') return 'bg-stone-200 text-stone-800 border-stone-700'
  return 'bg-stone-300 text-stone-700 border-stone-600'
}

function DecorationLayer() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* book */}
      <div className="absolute left-[4%] top-[11%] hidden h-32 w-44 -rotate-12 rounded-xl border-4 border-[#6b3f25] bg-[#7e3f2a] shadow-[0_12px_20px_rgba(0,0,0,0.28)] md:block">
        <div className="ml-6 h-full w-3 bg-[#d6b36a]/70" />
      </div>

      {/* coffee */}
      <div className="absolute right-[7%] top-[12%] hidden h-28 w-28 rotate-12 rounded-full border-[10px] border-[#f0e8d0] bg-[#4a2c1c] shadow-[0_12px_20px_rgba(0,0,0,0.28)] md:block">
        <div className="absolute -right-8 top-9 h-10 w-10 rounded-full border-[8px] border-[#f0e8d0]" />
        <div className="absolute left-7 top-5 h-5 w-10 rounded-full bg-white/20 blur-sm" />
      </div>

      {/* paper */}
      <div className="absolute bottom-[9%] left-[7%] hidden h-36 w-28 rotate-6 rounded-md bg-[#f7edcf] shadow-[0_10px_18px_rgba(0,0,0,0.25)] lg:block">
        <div className="mx-4 mt-7 h-2 rounded bg-[#b8956a]/45" />
        <div className="mx-4 mt-4 h-2 rounded bg-[#b8956a]/35" />
        <div className="mx-4 mt-4 h-2 rounded bg-[#b8956a]/35" />
      </div>

      {/* photo */}
      <div className="absolute bottom-[8%] right-[8%] hidden h-32 w-40 -rotate-6 rounded-md border-[8px] border-[#f7edcf] bg-gradient-to-br from-[#9fc4df] to-[#6c8f6a] shadow-[0_10px_18px_rgba(0,0,0,0.25)] lg:block">
        <div className="absolute bottom-3 left-3 h-8 w-24 rounded-full bg-[#4f6f3b]/70" />
        <div className="absolute right-5 top-5 h-8 w-8 rounded-full bg-[#ffe28a]" />
      </div>
    </div>
  )
}

export function EndingCollectionScreen() {
  const navigate = useNavigate()
  const unlockedCount = endings.filter((ending) => ending.unlocked).length
  const totalCount = endings.length

  return (
    <div
      className="relative min-h-dvh w-full overflow-hidden bg-cover bg-center px-4 py-6 text-desk-dark sm:px-8"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* Background layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(240,232,208,0.38),rgba(122,92,58,0.20)_45%,rgba(58,34,18,0.45))]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:42px_42px] opacity-30" />

      {/* Decoration layer */}
      <DecorationLayer />

      {/* Main container */}
      <main className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center gap-6 py-10 font-serif">
        <section className="w-full rounded-[2.2rem] border-2 border-desk-dark bg-paper/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-7">
          {/* Header */}
          <header className="relative overflow-hidden rounded-[1.7rem] border border-desk-light bg-white/35 px-6 py-6 text-center shadow-inner">
            <button
              onClick={() => navigate('/')}
              className="mb-5 rounded-full border border-desk-dark bg-paper/95 px-5 py-2 text-xs font-bold shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-all hover:brightness-105 active:scale-95 sm:absolute sm:left-5 sm:top-5 sm:mb-0 sm:text-sm"
            >
              ← Back to Home
            </button>

            <p className="text-xs uppercase tracking-[0.35em] text-desk-mid">Achievement Archive</p>
            <h1 className="mt-2 text-4xl font-bold sm:text-6xl">Ending Collection</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-desk-mid sm:text-base">
              Review the endings you have unlocked and discover which routes are still hidden.
            </p>

            <div className="mx-auto mt-5 flex max-w-md items-center gap-3 rounded-full border border-desk-light bg-paper/70 px-4 py-3 shadow-inner">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-desk-light/35">
                <div
                  className="h-full rounded-full bg-btn"
                  style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold">
                {unlockedCount}/{totalCount} Unlocked
              </span>
            </div>
          </header>

          {/* Grid */}
          <section className="mt-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {endings.map((ending) => (
              <article
                key={ending.id}
                className={`group relative overflow-hidden rounded-[1.7rem] border p-4 shadow-[0_7px_18px_rgba(0,0,0,0.22)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_26px_rgba(0,0,0,0.28)] ${
                  ending.unlocked
                    ? 'border-desk-dark bg-[#fff7dc]'
                    : 'border-desk-light bg-stone-300/80 grayscale'
                }`}
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/35" />
                <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-desk-light/20" />

                <div className="relative rounded-2xl border border-desk-light bg-white/50 p-4 text-center shadow-inner">
                  <div className="flex h-28 items-center justify-center text-6xl transition-transform duration-200 group-hover:scale-110">
                    {ending.unlocked ? ending.icon : '🔒'}
                  </div>
                </div>

                <div
                  className={`absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border text-xl font-bold shadow ${rankClass(
                    ending.rank,
                  )}`}
                >
                  {ending.rank}
                </div>

                <h2 className="relative mt-4 min-h-14 text-center text-xl font-bold leading-tight">
                  {ending.unlocked ? ending.title : 'Locked Ending'}
                </h2>
                <p className="relative text-center text-xs uppercase tracking-[0.18em] text-desk-mid">
                  {ending.unlocked ? ending.requirement : 'Keep playing to unlock'}
                </p>
                <p className="relative mt-3 min-h-24 rounded-xl bg-desk-dark/10 p-3 text-sm leading-relaxed">
                  {ending.unlocked
                    ? ending.description
                    : 'This ending is still hidden. Try another character or a different life choice route.'}
                </p>
              </article>
            ))}
          </section>
        </section>
      </main>
    </div>
  )
}
