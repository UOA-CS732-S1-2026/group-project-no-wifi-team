import { useEffect, useMemo, useState } from 'react'
import { motion, type Variants } from 'motion/react'
import { fetchAchievements, type BackendAchievement } from '../../api/achievements'

type AchievementModalProps = {
  earnedKeys: string[]
  onClose: () => void
}

export function AchievementModal({ earnedKeys, onClose }: AchievementModalProps) {
  const [achievements, setAchievements] = useState<BackendAchievement[]>([])

  useEffect(() => {
    fetchAchievements()
      .then(setAchievements)
      .catch((error) => {
        console.error('Failed to load achievements:', error)
      })
  }, [])

  const earnedSet = useMemo(() => new Set(earnedKeys), [earnedKeys])
  const unlockedCount = achievements.filter((item) => earnedSet.has(item.achievementKey)).length

  // Parent variants for the grid container (manages staggering)
  const gridContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  }

  // Child variants for each achievement article
  const achievementCardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.85 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 22,
      },
    },
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.section
        className="max-h-[90vh] w-full max-w-[900px] overflow-y-auto rounded-[28px] border-[3px] border-[#b98755] bg-[#fff0cf] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.38)]"
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
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

          <motion.button
            type="button"
            onClick={onClose}
            className="rounded-full border-2 border-[#8a5a32] bg-[#d9b16f] px-4 py-2 text-[14px] font-bold text-[#5c3318] cursor-pointer"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
        </header>

        <motion.div 
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {achievements.map((achievement) => {
            const isUnlocked = earnedSet.has(achievement.achievementKey)

            return (
              <motion.article
                key={achievement.achievementKey}
                variants={achievementCardVariants}
                whileHover={{ scale: 1.02 }}
                className={`rounded-[18px] border-[2px] p-4 shadow-sm ${
                  isUnlocked
                    ? 'border-[#cfa472] bg-[#fff8e8]'
                    : 'border-[#b9a28b] bg-[#e9dfd0]'
                }`}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={`flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full border-2 text-[22px] ${
                      isUnlocked
                        ? 'border-[#73864f] bg-[#dfe8b8]'
                        : 'border-[#8a6a4a] bg-[#c9b69d]'
                    }`}
                  >
                    {isUnlocked ? '★' : '🔒'}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[18px] font-bold leading-tight text-[#5c3318]">
                      {achievement.title}
                    </h3>

                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a6840]">
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </p>
                  </div>
                </div>

                <p className="min-h-[72px] rounded-[12px] bg-[#f4e4c8]/80 px-3 py-2 text-[14px] leading-[1.45] text-[#714729]">
                  {isUnlocked
                    ? achievement.description
                    : 'This achievement is still locked. Continue playing to unlock it.'}
                </p>

                {achievement.conditionText && (
                  <p className="mt-3 rounded-[10px] bg-[#e9d0a8] px-3 py-2 text-[12px] leading-[1.4] text-[#6b4427]">
                    {achievement.conditionText}
                  </p>
                )}
              </motion.article>
            )
          })}
        </motion.div>
      </motion.section>
    </div>
  )
}
