import { achievements } from './constants'

type AchievementModalProps = {
  onClose: () => void
}

export function AchievementModal({ onClose }: AchievementModalProps) {
  const unlockedCount = achievements.filter((item) => item.unlocked).length

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="max-h-[90vh] w-full max-w-[900px] overflow-y-auto rounded-[28px] border-[3px] border-[#b98755] bg-[#fff0cf] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.38)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-5 flex items-start justify-between gap-4 border-b border-[#d7b783] pb-4">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#9a6840]">
              International Student Simulator
            </p>

            <h2 className="mt-1 text-[34px] font-bold leading-none text-[#5c3318]">
              Achievement Collection
            </h2>

            <p className="mt-2 text-[15px] text-[#7a5030]">
              Achievements Earned: {unlockedCount} / {achievements.length}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-2 border-[#8a5a32] bg-[#d9b16f] px-4 py-2 text-[14px] font-bold text-[#5c3318] transition hover:scale-105 active:scale-95"
          >
            Close
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <article
              key={achievement.id}
              className={`rounded-[18px] border-[2px] p-4 shadow-sm ${
                achievement.unlocked
                  ? 'border-[#cfa472] bg-[#fff8e8]'
                  : 'border-[#b9a28b] bg-[#e9dfd0]'
              }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={`flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 text-[22px] ${
                    achievement.unlocked
                      ? 'border-[#73864f] bg-[#dfe8b8]'
                      : 'border-[#8a6a4a] bg-[#c9b69d]'
                  }`}
                >
                  {achievement.unlocked ? '★' : '🔒'}
                </div>

                <div>
                  <h3 className="text-[18px] font-bold leading-tight text-[#5c3318]">
                    {achievement.title}
                  </h3>

                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a6840]">
                    {achievement.unlocked ? 'Unlocked' : 'Locked'}
                  </p>
                </div>
              </div>

              <p className="min-h-[72px] rounded-[12px] bg-[#f4e4c8]/80 px-3 py-3 text-[14px] leading-[1.45] text-[#714729]">
                {achievement.unlocked
                  ? achievement.description
                  : 'This achievement is still locked. Continue playing to unlock it.'}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
