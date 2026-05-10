import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { fetchAchievements, getAchievementByKey } from '../../api/achievements'
import popCrown from '../../assets/TaskInteraction/pop-crown.png'
import popHealth from '../../assets/TaskInteraction/pop-health.png'
import popStudy from '../../assets/TaskInteraction/pop-study.png'
import popWealth from '../../assets/TaskInteraction/pop-wealth.png'

const CATEGORY_ICONS: Record<string, string> = {
  Study:  popStudy,
  Health: popHealth,
  Wealth: popWealth,
}

interface Props {
  achievementKey: string | null
  onDismiss: () => void
}

export function AchievementToast({ achievementKey, onDismiss }: Props) {
  const [title, setTitle] = useState<string | null>(null)
  const [icon, setIcon] = useState<string>(popCrown)

  useEffect(() => {
    if (!achievementKey) return

    fetchAchievements()
      .then(() => {
        const ach = getAchievementByKey(achievementKey)
        if (ach) {
          setTitle(ach.title)
          setIcon(CATEGORY_ICONS[ach.category] ?? popCrown)
        } else {
          setTitle(achievementKey)
        }
      })
      .catch(() => {
        setTitle(achievementKey)
      })
  }, [achievementKey])

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
            src={icon}
            alt=""
            aria-hidden="true"
            className="h-16 w-16 object-contain"
          />
          <div>
            <p className="text-[13px] font-bold uppercase tracking-widest text-[#9a6a3e]">
              Achievement Unlocked!
            </p>
            <p className="font-serif text-lg font-bold text-[#7a4b2b]">
              {title ?? achievementKey}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
