import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import commonBackground from '../assets/CommonImage/common-background.png'
import { AttributeBar } from '../components/MonthlyTaskSelection'
import type { AppDispatch, RootState } from '../store'
import { updateStats } from '../slices/gameSlice'
import {
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

export function TaskInteractionScreen({ content }: TaskInteractionScreenProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()
  const routeState = location.state as RouteState | null
  const currentQuarter = useSelector((s: RootState) => s.game.currentQuarter) as 1 | 2 | 3 | 4
  const currentStats = useSelector((s: RootState) => s.game.currentStats)
  const quarterPlan = useSelector((s: RootState) => s.game.quarters[currentQuarter])

  const tasks = useMemo(() => {
    if (content) return [content]
    if (quarterPlan) {
      const plannedTasks = [
        ...quarterPlan.selectedTasks,
        ...(quarterPlan.randomTask ? [quarterPlan.randomTask] : []),
      ]
      return plannedTasks.map(taskFromRouteTask)
    }
    const selectedTasks = routeState?.tasks ?? []
    if (selectedTasks.length > 0) return selectedTasks.map(taskFromRouteTask)
    return taskLibrary
  }, [content, quarterPlan, routeState?.tasks])

  const initialStats = useMemo(
    () => ({
      intelligence: currentStats.intelligence,
      health: currentStats.health,
      money: currentStats.wealth,
    }),
    [currentStats],
  )

  const [taskIndex, setTaskIndex] = useState(0)
  const [stats, setStats] = useState<Record<AttributeKey, number>>(initialStats)
  const [selectedOption, setSelectedOption] = useState<ChoiceOption | null>(null)

  const currentTask = tasks[taskIndex] ?? defaultContent
  const isLastTask = taskIndex >= tasks.length - 1

  const buildSummaryState = (nextStats: Record<AttributeKey, number>) => ({
    quarterName: `Quarter ${currentQuarter}`,
    quarterIndex: currentQuarter,
    tasksCompleted: tasks.length,
    totalTasks: tasks.length,
    quartersRemaining: 4 - currentQuarter,
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

  const handleChoice = (option: ChoiceOption) => {
    setSelectedOption(option)
    setStats((current) => ({
      intelligence: clampStat(current.intelligence + option.effects.intelligence),
      health: clampStat(current.health + option.effects.health),
      money: clampStat(current.money + option.effects.money),
    }))
  }

  const handleNext = () => {
    if (isLastTask) {
      dispatch(
        updateStats({
          intelligence: stats.intelligence,
          health: stats.health,
          wealth: stats.money,
        }),
      )
      navigate('/quarterly-summary', { state: buildSummaryState(stats) })
      return
    }

    setTaskIndex((current) => current + 1)
    setSelectedOption(null)
  }

  const handleReset = () => {
    setTaskIndex(0)
    setStats(initialStats)
    setSelectedOption(null)
  }

  return (
    <div
      className="flex h-dvh w-full flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${commonBackground})`,
        backgroundSize: '100% 100%',
      }}
    >
      <AttributeBar intelligence={stats.intelligence} health={stats.health} wealth={stats.money} />

      <main className="flex flex-1 items-center justify-center px-8 pb-10 pt-4">
        <div className="grid h-[620px] w-[1120px] grid-cols-[430px_1fr] items-center gap-10">
          <TaskChoicePanel
            currentTask={currentTask}
            taskIndex={taskIndex}
            totalTasks={tasks.length}
            selectedOption={selectedOption}
            isLastTask={isLastTask}
            onChoice={handleChoice}
            onNext={handleNext}
          />
          <TaskArtworkPanel image={currentTask.image} />
        </div>
      </main>

      <div className="pointer-events-none absolute left-8 top-8 flex gap-2">
        <button
          type="button"
          aria-label="Reset task interaction"
          onClick={handleReset}
          className="pointer-events-auto h-9 w-9 rounded-full font-serif text-xl font-bold text-desk-dark transition hover:scale-105"
        >
          ↺
        </button>
        <button
          type="button"
          aria-label="Back to monthly task selection"
          onClick={() => navigate('/monthly-task-selection')}
          className="pointer-events-auto h-9 w-9 rounded-full font-serif text-xl font-bold text-desk-dark transition hover:scale-105"
        >
          ←
        </button>
      </div>
    </div>
  )
}
