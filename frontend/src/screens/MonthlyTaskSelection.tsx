import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import taskBg from '../assets/CommonImage/common-background.png'
import { taskTip } from '../components/MonthlyTaskSelection/images'
import { fetchEventsByQuarter, fetchRandomEvent } from '../api/events'
import { confirmQuarterTasks } from '../slices/gameSlice'
import type { AppDispatch } from '../store'
import {
  AttributeBar,
  CategoryPanel,
  MonthHeader,
  MonthlyPlanBoard,
  TaskList,
  MAX_PLAYER_SELECTIONS,
  TASKS,
  mapEventToTask,
  type Category,
  type Task,
} from '../components/MonthlyTaskSelection'

export function MonthlyTaskSelection() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const quarter = useSelector((s: RootState) => s.game.currentQuarter) as 1 | 2 | 3 | 4
  const currentStats = useSelector((s: RootState) => s.game.currentStats)
  const [activeCategory, setActiveCategory] = useState<Category>('Study')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [tasks, setTasks] = useState<Task[]>(TASKS)
  const [showFullToast, setShowFullToast] = useState(false)

  useEffect(() => {
    fetchEventsByQuarter(quarter)
      .then(({ events }) => setTasks(events.map(mapEventToTask)))
      .catch(() => {})
  }, [quarter])

  const visibleTasks = tasks.filter((t) => t.category === activeCategory)
  const selectedTasks: (Task | undefined)[] = selectedIds.map(
    (id) => tasks.find((t) => t.id === id)
  )

  function toggleTask(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id)
      if (prev.length >= MAX_PLAYER_SELECTIONS) {
        setShowFullToast(true)
        setTimeout(() => setShowFullToast(false), 2500)
        return prev
      }
      return [...prev, id]
    })
  }

  async function handleConfirm() {
    const chosen = selectedIds
      .map((id) => tasks.find((t) => t.id === id))
      .filter((t): t is Task => t !== undefined)

    try {
      const { event } = await fetchRandomEvent(quarter)
      const randomTask = mapEventToTask(event)
      dispatch(confirmQuarterTasks({
        quarter: quarter,
        selectedTasks: chosen,
        randomTask,
      }))
    } catch {
      // fallback: dispatch without random task using a placeholder
      dispatch(confirmQuarterTasks({
        quarter: quarter,
        selectedTasks: chosen,
        randomTask: { id: 'random-fallback', category: 'Study', name: 'Random Event', illustration: '' },
      }))
    }

    navigate('/task-interaction')
  }

  return (
    <div
      className="flex h-dvh w-full flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${taskBg})`,
        backgroundSize: '100% 100%',
      }}
    >
      <AttributeBar
        intelligence={currentStats.intelligence}
        health={currentStats.health}
        wealth={currentStats.wealth}
      />

      <div className="flex flex-1 flex-col items-center" style={{ marginTop: -34 }}>
        <MonthHeader quarter={quarter} />

        <div className="flex" style={{ width: '1090px', height: '100%', marginTop: 100 }}>
          <CategoryPanel active={activeCategory} onSelect={setActiveCategory} />
          <TaskList
            activeCategory={activeCategory}
            tasks={visibleTasks}
            selectedIds={selectedIds}
            onToggle={toggleTask}
          />
          <MonthlyPlanBoard
            selectedTasks={selectedTasks}
            selectedCount={selectedIds.length}
            allSelected={selectedIds.length === MAX_PLAYER_SELECTIONS}
            onRemove={toggleTask}
            onConfirm={handleConfirm}
          />
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {showFullToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] rounded-lg bg-desk-dark px-6 py-3 shadow-xl"
          >
            <p className="font-serif text-sm font-bold text-btn-text">
              You've selected enough tasks — ready to start!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full shrink-0" style={{ height: '104px', marginBottom: 100 }}>
        <img
          src={taskTip}
          alt="Tip"
          className="h-full w-full"
          style={{ objectFit: 'contain', objectPosition: 'center' }}
        />
      </div>
    </div>
  )
}
