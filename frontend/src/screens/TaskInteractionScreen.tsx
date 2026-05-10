import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import commonBackground from '../assets/CommonImage/common-background.png'
import { AttributeBar } from '../components/MonthlyTaskSelection'
import type { AppDispatch, RootState } from '../store'
import { earnAchievement, updateStats } from '../slices/gameSlice'
import { post } from '../utils/request'
import { coinSfx } from '../contexts/MusicContext'
import { useMusicContext } from '../contexts/MusicContext'
import { SettingsModal } from '../components/TitleScreen/SettingsModal'
import settingImg from '../assets/CommonImage/setting.png'
import {
  AchievementToast,
  TaskArtworkPanel,
  TaskChoicePanel,
  clampStat,
  defaultContent,
  taskFromRouteTask,
  taskLibrary,
  type AttributeKey,
  type ChoiceOption,
  type RouteState,
  type TaskInteractionContent,
} from '../components/TaskInteractionScreen'

interface TaskInteractionScreenProps {
  content?: TaskInteractionContent
}

function getLivingExpenses(wealth: number): number {
  if (wealth >= 8) return 8
  if (wealth >= 4) return 5
  return 3
}

const LIVING_EXPENSES_QUOTES: Record<number, string> = {
  2: '"The rent doesn\'t care about your grades." — Your Landlord',
  3: '"Money flies, and so does your youth." — Anonymous',
  4: '"Welcome to adulting." — Your Bank Account',
}

function buildLivingExpensesTask(amount: number, image: string, quarter: number): TaskInteractionContent {
  const quote = LIVING_EXPENSES_QUOTES[quarter] ?? LIVING_EXPENSES_QUOTES[2]
  return {
    taskId: 'living-expenses',
    title: 'Living Expenses',
    category: 'Random',
    description: `Your living allowance for this quarter: Wealth +${amount}\n\n${quote}`,
    image,
    options: [],
    isRandomEvent: true,
    autoEffects: { intelligence: 0, health: 0, money: amount },
  }
}

export function TaskInteractionScreen({ content }: TaskInteractionScreenProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()
  const routeState = location.state as RouteState | null
  const currentQuarter = useSelector((s: RootState) => s.game.currentQuarter) as 1 | 2 | 3 | 4
  const currentStats = useSelector((s: RootState) => s.game.currentStats)
  const quarterPlan = useSelector((s: RootState) => s.game.quarters[currentQuarter])
  const selectedCharacter = useSelector((s: RootState) => s.game.selectedCharacter)
  const earnedAchievements = useSelector((s: RootState) => s.game.earnedAchievements)

  const tasks = useMemo(() => {
    if (content) return [content]

    let baseTasks: TaskInteractionContent[] = []

    if (quarterPlan) {
      baseTasks = [
        ...quarterPlan.selectedTasks.map((t, i) => taskFromRouteTask(t, i, false)),
        ...(quarterPlan.randomTask
          ? [taskFromRouteTask(quarterPlan.randomTask, quarterPlan.selectedTasks.length, true)]
          : []),
      ]
    } else {
      const selectedTasks = routeState?.tasks ?? []
      baseTasks = selectedTasks.length > 0
        ? selectedTasks.map((t, i) => taskFromRouteTask(t, i))
        : taskLibrary
    }

    const amount = getLivingExpenses(selectedCharacter?.stats.wealth ?? 5)
    const image = baseTasks[0]?.image ?? defaultContent.image
    return currentQuarter >= 2
      ? [buildLivingExpensesTask(amount, image, currentQuarter), ...baseTasks]
      : baseTasks
  }, [content, quarterPlan, routeState?.tasks, selectedCharacter, currentQuarter])

  const initialStats = useMemo(
    () => ({
      intelligence: currentStats.intelligence,
      health: currentStats.health,
      money: currentStats.wealth,
    }),
    [currentStats],
  )

  const { musicEnabled, setMusicEnabled, sfxEnabled, setSfxEnabled } = useMusicContext()
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const [taskIndex, setTaskIndex] = useState(0)

  useEffect(() => {
    if (tasks[0]?.taskId === 'living-expenses' && sfxEnabled) {
      const audio = new Audio(coinSfx)
      audio.volume = 0.6
      audio.play().catch(() => {})
    }
  }, [tasks, sfxEnabled])
  const [stats, setStats] = useState<Record<AttributeKey, number>>(initialStats)
  const [selectedOption, setSelectedOption] = useState<ChoiceOption | null>(null)
  const [toastKey, setToastKey] = useState<string | null>(null)

  const currentTask = tasks[taskIndex] ?? defaultContent
  const isLastTask = taskIndex >= tasks.length - 1

  const taskOffset = tasks[0]?.taskId === 'living-expenses' ? 1 : 0

  const buildSummaryState = (nextStats: Record<AttributeKey, number>) => ({
    quarterName: `Quarter ${currentQuarter}`,
    quarterIndex: currentQuarter,
    tasksCompleted: tasks.length - taskOffset,
    totalTasks: tasks.length - taskOffset,
    quartersRemaining: 4 - currentQuarter,
    achievements: earnedAchievements,
    stats: [
      {
        label: 'Intelligence',
        value: nextStats.intelligence,
        delta: nextStats.intelligence - initialStats.intelligence,
      },
      {
        label: 'Health',
        value: nextStats.health,
        delta: nextStats.health - initialStats.health,
      },
      {
        label: 'Wealth',
        value: nextStats.money,
        delta: nextStats.money - initialStats.money,
      },
    ],
  })

  const persistAchievement = (key: string) => {
    const username = localStorage.getItem('username')
    if (!username) return
    post('/user/achievement', { username, achievementKey: key }).catch(() => {})
  }

  const tryEarnAchievement = (key: string, showToast = true) => {
    if (earnedAchievements.includes(key)) return
    dispatch(earnAchievement(key))
    persistAchievement(key)
    if (showToast) setToastKey(key)
  }

  useEffect(() => {
    if (currentTask.isRandomEvent && currentTask.achievementKey) {
      tryEarnAchievement(currentTask.achievementKey)
    }
  }, [taskIndex])

  const handleChoice = (option: ChoiceOption) => {
    setSelectedOption(option)
    setStats((current) => ({
      intelligence: clampStat(current.intelligence + option.effects.intelligence),
      health: clampStat(current.health + option.effects.health),
      money: clampStat(current.money + option.effects.money),
    }))
    if (option.achievementKey) {
      tryEarnAchievement(option.achievementKey)
    }
  }

  const handleNext = () => {
    const fx = currentTask.autoEffects
    const autoOption =
      !fx && currentTask.isRandomEvent && currentTask.options.length > 0
        ? currentTask.options[0]
        : null

    const nextStats = fx
      ? {
          intelligence: clampStat(stats.intelligence + (fx.intelligence ?? 0)),
          health: clampStat(stats.health + (fx.health ?? 0)),
          money: clampStat(stats.money + (fx.money ?? 0)),
        }
      : autoOption
        ? {
            intelligence: clampStat(stats.intelligence + autoOption.effects.intelligence),
            health: clampStat(stats.health + autoOption.effects.health),
            money: clampStat(stats.money + autoOption.effects.money),
          }
        : stats

    if (fx || autoOption) setStats(nextStats)
    if (autoOption?.achievementKey) tryEarnAchievement(autoOption.achievementKey)

    if (isLastTask) {
      dispatch(updateStats({ intelligence: nextStats.intelligence, health: nextStats.health, wealth: nextStats.money }))
      if (nextStats.intelligence >= 10) tryEarnAchievement('wait-am-i-actually-a-genius', false)
      if (nextStats.health >= 10) tryEarnAchievement('doing-great', false)
      if (nextStats.money >= 10) tryEarnAchievement('future-forbes-list-candidate', false)
      if (nextStats.intelligence >= 10 && nextStats.health >= 10 && nextStats.money >= 10) {
        tryEarnAchievement('hexagon-international-student', false)
      }
      navigate('/quarterly-summary', { state: buildSummaryState(nextStats) })
      return
    }

    setTaskIndex((current) => current + 1)
    setSelectedOption(null)
  }

  const handleReset = () => {
    setTaskIndex(0)
    setStats(initialStats)
    setSelectedOption(null)
    setToastKey(null)
  }

  const dismissToast = useCallback(() => setToastKey(null), [])

  return (
    <div
      className="flex h-dvh w-full flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${commonBackground})`,
        backgroundSize: '100% 100%',
      }}
    >
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
      >
        <AttributeBar intelligence={stats.intelligence} health={stats.health} wealth={stats.money} />
      </motion.div>

      <main className="flex flex-1 items-center justify-center px-8 pb-10 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={taskIndex}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
              exit: { opacity: 0 },
            }}
            transition={{ duration: 0.3 }}
            className="grid w-full max-w-[1120px] grid-cols-[minmax(0,430px)_1fr] items-stretch gap-10"
          >
            <motion.div
              variants={{
                hidden: { x: -60, opacity: 0 },
                visible: { x: 0, opacity: 1 },
                exit: { x: -60, opacity: 0 },
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <TaskChoicePanel
                currentTask={currentTask}
                taskIndex={taskIndex}
                totalTasks={tasks.length}
                selectedOption={selectedOption}
                isLastTask={isLastTask}
                onChoice={handleChoice}
                onNext={handleNext}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { x: 60, opacity: 0 },
                visible: { x: 0, opacity: 1 },
                exit: { x: 60, opacity: 0 },
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <TaskArtworkPanel image={currentTask.image} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="absolute left-8 top-8 flex gap-2">
        <motion.button
          type="button"
          aria-label="Reset task interaction"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="h-9 w-9 rounded-full font-serif text-xl font-bold text-desk-dark cursor-pointer"
        >
          ↺
        </motion.button>
        <motion.button
          type="button"
          aria-label="Back to monthly task selection"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/monthly-task-selection')}
          className="h-9 w-9 rounded-full font-serif text-xl font-bold text-desk-dark cursor-pointer"
        >
          ←
        </motion.button>
      </div>

      <AchievementToast achievementKey={toastKey} onDismiss={dismissToast} />

      <button
        type="button"
        onClick={() => setShowSettingsModal(true)}
        className="fixed bottom-[2vh] right-[2vw] z-30 w-[54px] transition duration-200 hover:rotate-45 hover:scale-110 active:scale-95 sm:w-[74px]"
        aria-label="Settings"
      >
        <img src={settingImg} alt="Settings" className="w-full drop-shadow-lg" />
      </button>

      {showSettingsModal && (
        <SettingsModal
          musicEnabled={musicEnabled}
          sfxEnabled={sfxEnabled}
          onMusicToggle={setMusicEnabled}
          onSfxToggle={setSfxEnabled}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  )
}
