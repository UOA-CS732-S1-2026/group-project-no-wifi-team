import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import taskBg from '../assets/CommonImage/common-background.png'
import { taskTip } from '../components/MonthlyTaskSelection/images'
import { fetchEventsByQuarter } from '../api/events'
import {
  AttributeBar,
  CategoryPanel,
  MonthHeader,
  MonthlyPlanBoard,
  TaskList,
  BASE_STATS,
  MAX_PLAYER_SELECTIONS,
  QUARTER_INFO,
  TASKS,
  mapEventToTask,
  type Category,
  type Task,
} from '../components/MonthlyTaskSelection'

export function MonthlyTaskSelection() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<Category>('Study')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [tasks, setTasks] = useState<Task[]>(TASKS)
  const [showFullToast, setShowFullToast] = useState(false)

  useEffect(() => {
    fetchEventsByQuarter(QUARTER_INFO.number)
      .then(({ events }) => {
        console.log('[Events API] raw:', events)
        const mapped = events.map(mapEventToTask)
        console.log('[Events API] mapped:', mapped)
        setTasks(mapped)
      })
      .catch((err) => {
        console.error('[Events API] error:', err)
      })
  }, [])

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

  return (
    <div
      className="flex h-dvh w-full flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${taskBg})`,
        backgroundSize: '100% 100%',
      }}
    >
      <AttributeBar
        intelligence={BASE_STATS.intelligence}
        health={BASE_STATS.health}
        wealth={BASE_STATS.wealth}
      />

      <div className="flex flex-1 flex-col items-center" style={{ marginTop: -34 }}>
        <MonthHeader quarter={QUARTER_INFO.number} />

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
            onConfirm={() => navigate('/task-interaction')}
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
