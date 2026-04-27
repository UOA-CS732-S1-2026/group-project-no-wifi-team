import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backgroundImg from '../assets/background.jpg'

type Character = {
  id: string
  title: string
  subtitle: string
  icon: string
  description: string
  playStyle: string
  stats: {
    intelligence: string
    health: string
    wealth: string
    social: string
  }
}

const characters: Character[] = [
  {
    id: 'scholar',
    title: 'Academic Star',
    subtitle: 'Study-focused route',
    icon: '🎓',
    description: 'You live in the library, submit assignments early, and aim for the best academic ending.',
    playStyle: 'Best for players who want strong grades but must manage health and social life carefully.',
    stats: {
      intelligence: 'Excellent',
      health: 'Average',
      wealth: 'Average',
      social: 'Normal',
    },
  },
  {
    id: 'rich',
    title: 'Rich Kid',
    subtitle: 'Money-friendly route',
    icon: '💳',
    description: 'You start with stronger financial support, which makes rent, food, and daily choices easier.',
    playStyle: 'Best for players who want more freedom and less money pressure at the beginning.',
    stats: {
      intelligence: 'Average',
      health: 'Normal',
      wealth: 'Excellent',
      social: 'Good',
    },
  },
  {
    id: 'fitness',
    title: 'Fitness Lover',
    subtitle: 'Health-focused route',
    icon: '💪',
    description: 'You recover from stress quickly, keep a strong routine, and rarely get destroyed by deadlines.',
    playStyle: 'Best for players who want high health while slowly building study and money skills.',
    stats: {
      intelligence: 'Normal',
      health: 'Excellent',
      wealth: 'Average',
      social: 'Good',
    },
  },
  {
    id: 'normal',
    title: 'Ordinary Student',
    subtitle: 'Balanced beginner route',
    icon: '🧳',
    description: 'No special bonus, no special weakness. A realistic starting point for a new international student.',
    playStyle: 'Best for first-time players who want a balanced and flexible experience.',
    stats: {
      intelligence: 'Average',
      health: 'Average',
      wealth: 'Average',
      social: 'Average',
    },
  },
]

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-desk-light/40 py-2 last:border-b-0">
      <span>{label}</span>
      <span className="font-bold text-desk-dark">{value}</span>
    </div>
  )
}

export function CharacterSelectScreen() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(characters[0].id)

  const selectedCharacter = useMemo(
    () => characters.find((character) => character.id === selectedId) ?? characters[0],
    [selectedId],
  )

  const startJourney = () => {
    window.localStorage.setItem('selectedCharacter', selectedCharacter.title)
    window.alert(`You selected ${selectedCharacter.title}. The game journey page can be added after this step.`)
  }

  return (
    <div
      className="relative min-h-dvh w-full overflow-hidden bg-cover bg-center px-4 py-6 text-desk-dark sm:px-8"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <button
        onClick={() => navigate('/')}
        className="absolute left-5 top-5 z-20 rounded-full border border-desk-dark bg-paper/95 px-5 py-2 font-serif text-xs font-bold shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-all hover:brightness-105 active:scale-95 sm:text-sm"
      >
        ← Back to Home
      </button>

      <main className="mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center gap-5 py-10">
        <section className="text-center font-serif">
          <div className="mx-auto mb-3 w-fit rounded-2xl border border-desk-dark bg-paper/95 px-8 py-4 shadow-[0_5px_16px_rgba(0,0,0,0.28)]">
            <p className="text-xs uppercase tracking-[0.35em] text-desk-mid">New Journey</p>
            <h1 className="mt-1 text-3xl font-bold sm:text-5xl">Choose Your Character</h1>
          </div>
          <p className="rounded-full bg-paper/80 px-5 py-2 text-sm shadow-[0_2px_6px_rgba(0,0,0,0.15)] sm:text-base">
            Pick a starting identity. Each character changes your initial attributes.
          </p>
        </section>

        <section className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {characters.map((character) => {
              const isSelected = selectedId === character.id
              return (
                <button
                  key={character.id}
                  onClick={() => setSelectedId(character.id)}
                  className={`group rounded-2xl border p-4 text-left font-serif shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-1 hover:brightness-105 active:scale-[0.98] ${
                    isSelected
                      ? 'border-desk-dark bg-btn text-btn-text ring-4 ring-paper/70'
                      : 'border-desk-light bg-paper/90 text-desk-dark'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-desk-dark bg-paper/85 text-4xl shadow-inner">
                      {character.icon}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold">{character.title}</h2>
                        {isSelected && <span className="rounded-full bg-paper/25 px-2 py-0.5 text-xs">Selected</span>}
                      </div>
                      <p className={isSelected ? 'text-sm text-btn-text/85' : 'text-sm text-desk-mid'}>
                        {character.subtitle}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed">{character.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <aside className="rounded-3xl border border-desk-dark bg-paper/95 p-5 font-serif shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-desk-dark bg-btn text-6xl shadow-inner">
                {selectedCharacter.icon}
              </div>
              <h2 className="mt-3 text-2xl font-bold">{selectedCharacter.title}</h2>
              <p className="text-sm text-desk-mid">{selectedCharacter.subtitle}</p>
            </div>

            <div className="mt-5 rounded-xl border border-desk-light bg-white/35 p-4 text-sm">
              <StatRow label="Intelligence" value={selectedCharacter.stats.intelligence} />
              <StatRow label="Health" value={selectedCharacter.stats.health} />
              <StatRow label="Wealth" value={selectedCharacter.stats.wealth} />
              <StatRow label="Social" value={selectedCharacter.stats.social} />
            </div>

            <p className="mt-4 rounded-xl bg-desk-dark/10 p-3 text-sm leading-relaxed">
              {selectedCharacter.playStyle}
            </p>

            <button
              onClick={startJourney}
              className="mt-5 w-full rounded-xl border border-desk-dark bg-btn px-6 py-3 text-lg font-bold text-btn-text shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all hover:brightness-110 active:scale-95"
            >
              Confirm Character
            </button>
          </aside>
        </section>
      </main>
    </div>
  )
}
