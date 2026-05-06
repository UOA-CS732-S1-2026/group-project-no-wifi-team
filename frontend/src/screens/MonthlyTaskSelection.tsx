import { useState, useEffect } from 'react'
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
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length < MAX_PLAYER_SELECTIONS
        ? [...prev, id]
        : prev
    )
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
        <MonthHeader
          month={QUARTER_INFO.month}
          monthsUntilGraduation={QUARTER_INFO.monthsUntilGraduation}
        />

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
