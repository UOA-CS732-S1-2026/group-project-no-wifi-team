import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import taskBg from '../assets/task-bg-final.jpg'
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
  type Category,
  type Task,
} from '../components/MonthlyTaskSelection'

export function MonthlyTaskSelection() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<Category>('Study')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const visibleTasks = TASKS.filter((t) => t.category === activeCategory)
  const selectedTasks: (Task | undefined)[] = selectedIds.map(
    (id) => TASKS.find((t) => t.id === id)
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
      className="flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-4 py-4"
      style={{
        backgroundImage: `url(${taskBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <AttributeBar
        intelligence={BASE_STATS.intelligence}
        health={BASE_STATS.health}
        wealth={BASE_STATS.wealth}
      />

      <div
        className="flex w-full max-w-5xl flex-col overflow-hidden"
        style={{ background: 'transparent', maxHeight: 'calc(100dvh - 90px)' }}
      >
        <MonthHeader
          month={QUARTER_INFO.month}
          monthsUntilGraduation={QUARTER_INFO.monthsUntilGraduation}
        />

        <div className="flex flex-1 overflow-hidden">
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
    </div>
  )
}
