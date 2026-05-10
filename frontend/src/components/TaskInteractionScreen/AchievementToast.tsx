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
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [achievementKey, onDismiss])

  const label = title ?? achievementKey ?? ''

  return (
    <AnimatePresence>
      {achievementKey && (
        <motion.div
          key={achievementKey}
          initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
          animate={{ opacity: 1, scale: 1.5, x: '-50%', y: '-50%' }}
          exit={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50vh' }}
          transition={{ 
            type: 'spring',
            damping: 12,
            stiffness: 200,
            exit: { duration: 0.6, ease: 'anticipate' }
          }}
          className="pointer-events-none fixed left-1/2 top-1/2 z-[9999] w-80"
        >
          <div className="relative cursor-pointer pointer-events-auto" onClick={onDismiss}>
            {/* Light effect / Glow background */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-full bg-white/70 blur-[50px]"
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <img
              src={icon}
              alt={label}
              className="w-full drop-shadow-xl"
              draggable={false}
            />
            <div className="absolute inset-0 flex items-center">
              <div className="ml-[49%] mb-2 translate-y-3 flex flex-col justify-center gap-0.5 pr-4">
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
