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
    if (!achievementKey) {
      setTitle(null)
      return
    }

    setTitle(null)
    setIcon(popCrown)

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
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [achievementKey, onDismiss])

  const label = title ?? achievementKey ?? ''

  return (
    <AnimatePresence>
      {achievementKey && (
        <motion.div
          key={achievementKey}
          initial={{ opacity: 0, y: 48, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 48, scale: 0.92 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="pointer-events-none fixed bottom-8 right-8 z-[9999] w-72"
        >
          <div className="relative cursor-pointer pointer-events-auto" onClick={onDismiss}>
            <img
              src={icon}
              alt={label}
              className="w-full drop-shadow-xl"
              draggable={false}
            />
            <div className="absolute inset-0">
              <div className="absolute left-[49%] right-0 top-1/2 flex flex-col gap-0.5 pr-4">
                <p className="font-serif text-[13px] font-bold leading-tight text-[#5a3010]">
                  {label}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
