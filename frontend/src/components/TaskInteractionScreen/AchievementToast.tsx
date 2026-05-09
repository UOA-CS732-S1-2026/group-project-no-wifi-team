import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import popCrown from '../../assets/TaskInteraction/pop-crown.png'
import popHealth from '../../assets/TaskInteraction/pop-health.png'
import popStudy from '../../assets/TaskInteraction/pop-study.png'
import popWealth from '../../assets/TaskInteraction/pop-wealth.png'

const ACHIEVEMENT_LABELS: Record<string, string> = {
  'graduate': 'Graduate',
  'cultural-explorer': 'Cultural Explorer',
  'global-adventurer': 'Global Adventurer',
  'health': 'Health Achiever',
  'study': 'Study Master',
  'wealth': 'Wealth Builder',
}

const ACHIEVEMENT_ICONS: Record<string, string> = {
  'health': popHealth,
  'study': popStudy,
  'wealth': popWealth,
}

interface Props {
  achievementKey: string | null
  onDismiss: () => void
}

export function AchievementToast({ achievementKey, onDismiss }: Props) {
  useEffect(() => {
    if (!achievementKey) return
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [achievementKey, onDismiss])

  return (
    <AnimatePresence>
      {achievementKey && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-8 right-16 z-50 flex items-center gap-5 rounded-2xl border-2 border-[#7a4b2b] bg-[#f7e8c6] px-8 py-5 shadow-lg"
        >
          <img
            src={ACHIEVEMENT_ICONS[achievementKey] ?? popCrown}
            alt=""
            aria-hidden="true"
            className="h-16 w-16 object-contain"
          />
          <div>
            <p className="text-[13px] font-bold uppercase tracking-widest text-[#9a6a3e]">
              Achievement Unlocked!
            </p>
            <p className="font-serif text-lg font-bold text-[#7a4b2b]">
              {ACHIEVEMENT_LABELS[achievementKey] ?? achievementKey}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
