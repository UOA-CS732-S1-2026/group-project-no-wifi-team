import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import popCrown from '../../assets/TaskInteraction/pop-crown.png'
import popHealth from '../../assets/TaskInteraction/pop-health.png'
import popStudy from '../../assets/TaskInteraction/pop-study.png'
import popWealth from '../../assets/TaskInteraction/pop-wealth.png'

const ACHIEVEMENT_LABELS: Record<string, string> = {
  // Ending-based
  'graduate': 'Graduate',
  'cultural-explorer': 'Cultural Explorer',
  'global-adventurer': 'Global Adventurer',
  // Study
  'i-love-8-am-classes': 'I Love 8 AM Classes',
  'terminal-procrastination': 'Terminal Procrastination',
  'file-cleanup-master': 'File Cleanup Master',
  'pre-stress-specialist': 'Pre-Stress Specialist',
  'cross-that-bridge': "We'll Cross That Bridge",
  'wait-am-i-actually-a-genius': 'Wait, Am I Actually a Genius?',
  'anti-exam-strategist': 'Anti-Exam Strategist',
  'are-you-a-ghostwriter': 'Are You a Ghostwriter?',
  // Health
  'lone-wolf': 'Lone Wolf',
  'social-menace': 'Social Menace',
  'never-betray-your-stomach': 'Never Betray Your Stomach',
  'stillness-is-fitness': 'Stillness Is Fitness',
  'social-anxiety-mode': 'Social Anxiety Mode',
  'high-quality-sleep': 'High-Quality Sleep',
  'one-chip-for-you-one-chip-for-me': 'One Chip for You, One Chip for Me',
  'questionable-asmr-taste': 'Questionable ASMR Taste',
  'cultural-ambassador': 'Cultural Ambassador',
  'just-a-bit-of-smoke': 'Just a Bit of Smoke',
  'sleeping-over-at-school': 'Sleeping Over at School',
  'if-its-not-mouldy-its-edible': "If It's Not Mouldy, It's Edible",
  'plenty-of-fish-in-the-sea': 'Plenty of Fish in the Sea',
  'avada-kedavra': 'Avada Kedavra',
  'doing-great': 'Doing Great',
  // Wealth
  'benefits-first': 'Benefits First',
  'paid-to-chill': 'Paid to Chill',
  'chief-price-detective': 'Chief Price Detective',
  'freebie-hunter': 'Freebie Hunter',
  'its-fine-i-still-have-money': "It's Fine, I Still Have Money",
  'surprise-came-fast-gone-fast': 'Surprise Came Fast, Gone Fast',
  'budget-master': 'Budget Master',
  'future-forbes-list-candidate': 'Future Forbes List Candidate',
  // Crown
  'hexagon-international-student': 'Hexagon International Student',
}

const ACHIEVEMENT_ICONS: Record<string, string> = {
  // Study category
  'i-love-8-am-classes': popStudy,
  'terminal-procrastination': popStudy,
  'file-cleanup-master': popStudy,
  'pre-stress-specialist': popStudy,
  'cross-that-bridge': popStudy,
  'wait-am-i-actually-a-genius': popStudy,
  'anti-exam-strategist': popStudy,
  'are-you-a-ghostwriter': popStudy,
  // Health category
  'lone-wolf': popHealth,
  'social-menace': popHealth,
  'never-betray-your-stomach': popHealth,
  'stillness-is-fitness': popHealth,
  'social-anxiety-mode': popHealth,
  'high-quality-sleep': popHealth,
  'one-chip-for-you-one-chip-for-me': popHealth,
  'questionable-asmr-taste': popHealth,
  'cultural-ambassador': popHealth,
  'just-a-bit-of-smoke': popHealth,
  'sleeping-over-at-school': popHealth,
  'if-its-not-mouldy-its-edible': popHealth,
  'plenty-of-fish-in-the-sea': popHealth,
  'avada-kedavra': popHealth,
  'doing-great': popHealth,
  // Wealth category
  'benefits-first': popWealth,
  'paid-to-chill': popWealth,
  'chief-price-detective': popWealth,
  'freebie-hunter': popWealth,
  'its-fine-i-still-have-money': popWealth,
  'surprise-came-fast-gone-fast': popWealth,
  'budget-master': popWealth,
  'future-forbes-list-candidate': popWealth,
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

  const label = ACHIEVEMENT_LABELS[achievementKey ?? ''] ?? achievementKey ?? ''

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
          <div className="relative">
            <img
              src={ACHIEVEMENT_ICONS[achievementKey] ?? popCrown}
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
