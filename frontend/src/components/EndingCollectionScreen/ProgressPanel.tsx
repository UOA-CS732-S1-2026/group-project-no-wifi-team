import { motion, Variants } from 'motion/react'
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
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 2,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="absolute left-1/2 top-[270px] z-20 grid h-[86px] w-[1120px] -translate-x-1/2 grid-cols-[1fr_1.1fr_1fr_1fr_190px] items-center rounded-[14px] border-[2px] border-[#cfa472] bg-[#fff2d4]/80 px-[24px] shadow-[0_5px_10px_rgba(70,35,12,0.10)]"
    >
      <motion.div variants={itemVariants}>
        <p className="text-[15px] font-bold uppercase tracking-[0.1em] text-[#7a4c29]">Player</p>

        <p className="mt-1 truncate text-[17px] font-bold text-[#5a3218]">{playerName}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <p className="text-[15px] font-bold uppercase tracking-[0.1em] text-[#7a4c29]">
          Overall Progress
        </p>

        <div className="mt-1 flex items-center gap-3">
          <span className="text-[17px] font-bold">
            ★ {unlockedCount} / {totalCount}
          </span>

          <div className="h-[12px] w-[150px] overflow-hidden rounded-full border border-[#b88b55] bg-[#ead5ad]">
            <motion.div
              className="h-full rounded-full bg-[#879450]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <p className="text-[15px] font-bold uppercase tracking-[0.1em] text-[#7a4c29]">
          Achievements Collected
        </p>

        <p className="mt-1 text-[17px] font-bold">
          🪶 {achievementCount} / {achievementTotal}
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <p className="text-[15px] font-bold uppercase tracking-[0.1em] text-[#7a4c29]">
          Locked Endings
        </p>

        <p className="mt-1 text-[17px] font-bold">🔒 {lockedCount}</p>
      </motion.div>

      <motion.button
        variants={itemVariants}
        type="button"
        onClick={onViewAchievements}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mx-auto w-[205px] cursor-pointer outline-none"
        aria-label="View Achievements"
      >
        <img src={endingViewAchievements} alt="View Achievements" className="w-full" />
      </motion.button>
    </motion.section>
  )
}
