import { endingViewAchievements } from '../../assets/EndingCollection'

type ProgressPanelProps = {
  playerName: string
  unlockedCount: number
  totalCount: number
  lockedCount: number
  achievementCount: number
  achievementTotal: number
  progressPercent: number
  onViewAchievements: () => void
}

export function ProgressPanel({
  playerName,
  unlockedCount,
  totalCount,
  lockedCount,
  achievementCount,
  achievementTotal,
  progressPercent,
  onViewAchievements,
}: ProgressPanelProps) {
  return (
    <section className="absolute left-1/2 top-[270px] z-20 grid h-[86px] w-[1090px] -translate-x-1/2 grid-cols-[120px_245px_255px_165px_190px] items-center gap-x-[20px] rounded-[14px] border-[2px] border-[#cfa472] bg-[#fff2d4]/80 px-[24px] shadow-[0_5px_10px_rgba(70,35,12,0.10)]">
      <div>
        <p className="text-[15px] font-bold uppercase tracking-[0.1em] text-[#7a4c29]">Player</p>

        <p className="mt-1 truncate text-[17px] font-bold text-[#5a3218]">{playerName}</p>
      </div>

      <div>
        <p className="text-[15px] font-bold uppercase tracking-[0.1em] text-[#7a4c29]">
          Overall Progress
        </p>

        <div className="mt-1 flex items-center gap-3">
          <span className="text-[17px] font-bold">
            ★ {unlockedCount} / {totalCount}
          </span>

          <div className="h-[12px] w-[150px] overflow-hidden rounded-full border border-[#b88b55] bg-[#ead5ad]">
            <div className="h-full rounded-full bg-[#879450]" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div>
        <p className="whitespace-nowrap text-[15px] font-bold uppercase tracking-[0.05em] text-[#7a4c29]">
          Achievements Collected
        </p>

        <p className="mt-1 text-[17px] font-bold">
          🪶 {achievementCount} / {achievementTotal}
        </p>
      </div>

      <div>
        <p className="whitespace-nowrap text-[15px] font-bold uppercase tracking-[0.05em] text-[#7a4c29]">
          Locked Endings
        </p>

        <p className="mt-1 text-[17px] font-bold">🔒 {lockedCount}</p>
      </div>

      <button
        type="button"
        onClick={onViewAchievements}
        className="mx-auto w-[205px] -translate-x-[0px] cursor-pointer outline-none"
        aria-label="View Achievements"
      >
        <img src={endingViewAchievements} alt="View Achievements" className="w-full" />
      </button>
    </section>
  )
}
