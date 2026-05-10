import { useEffect, useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { fetchAchievements, type BackendAchievement } from '../../api/achievements'

interface Props {
  category: string
  earnedKeys: string[]
  onClose: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  Study: 'Study',
  Health: 'Health',
  Wealth: 'Wealth',
  Crown: 'Crown',
}

export function AchievementCategoryModal({ category, earnedKeys, onClose }: Props) {
  const [allAchievements, setAllAchievements] = useState<BackendAchievement[]>([])

  useEffect(() => {
    fetchAchievements()
      .then(setAllAchievements)
      .catch(() => setAllAchievements([]))
  }, [])

  const earnedSet = useMemo(() => new Set(earnedKeys), [earnedKeys])

  const categoryAchievements = useMemo(
    () => allAchievements.filter((a) => a.category === category),
    [allAchievements, category],
  )
  const earnedCount = categoryAchievements.filter((a) => earnedSet.has(a.achievementKey)).length

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievement-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
    >
      <motion.section
        className="max-h-[85vh] w-full max-w-[780px] overflow-y-auto rounded-[28px] border-[3px] border-[#b98755] bg-[#fff0cf] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.38)]"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="mb-5 flex items-start justify-between gap-4 border-b border-[#d7b783] pb-4">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#9a6840]">
              Achievement Details
            </p>
            <h2 id="achievement-modal-title" className="mt-1 text-[30px] font-bold leading-none text-[#5c3318]">
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <p className="mt-2 text-[15px] text-[#7a5030]">
              Earned: {earnedCount} / {categoryAchievements.length}
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

        <div className="grid grid-cols-3 gap-4">
          {categoryAchievements.map((achievement) => {
            const isUnlocked = earnedSet.has(achievement.achievementKey)

            return (
              <article
                key={achievement.achievementKey}
                className={`rounded-[18px] border-[2px] p-4 shadow-sm ${
                  isUnlocked
                    ? 'border-[#cfa472] bg-[#fff8e8]'
                    : 'border-[#b9a28b] bg-[#e9dfd0]'
                }`}
              >
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a6840]">
                  {isUnlocked ? 'Unlocked' : 'Locked'}
                </p>
                <h3 className="text-[16px] font-bold leading-tight text-[#5c3318]">
                  {achievement.title}
                </h3>
                <p className="mt-2 min-h-[60px] rounded-[10px] bg-[#f4e4c8]/80 px-3 py-2 text-[13px] leading-[1.45] text-[#714729]">
                  {isUnlocked
                    ? achievement.description
                    : 'This achievement is still locked. Continue playing to unlock it.'}
                </p>
                {achievement.conditionText && (
                  <p className="mt-3 rounded-[10px] bg-[#e9d0a8] px-3 py-2 text-[11px] leading-[1.4] text-[#6b4427]">
                    {achievement.conditionText}
                  </p>
                )}
              </article>
            )
          })}
        </div>

        {categoryAchievements.length === 0 && (
          <p className="py-12 text-center text-[15px] text-[#9a6840]">
            No achievements earned in this category yet.
          </p>
        )}
      </motion.section>
    </div>
  )
}
