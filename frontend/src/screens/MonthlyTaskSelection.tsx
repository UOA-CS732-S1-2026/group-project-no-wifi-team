import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import taskBg from '../assets/CommonImage/common-background.jpg'
import { taskTip } from '../components/MonthlyTaskSelection/images'
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
      className="flex h-dvh w-full flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${taskBg})`,
        backgroundSize: '100% 100%',
      }}
    >
      {/* Stats bar — 1366×56px, full viewport width */}
      <AttributeBar
        intelligence={BASE_STATS.intelligence}
        health={BASE_STATS.health}
        wealth={BASE_STATS.wealth}
      />

      {/* Remaining space: center title + columns vertically */}
      <div className="flex flex-1 flex-col items-center" style={{ marginTop: -34 }}>
        {/* Title block — 480×72px */}
        <MonthHeader
          month={QUARTER_INFO.month}
          monthsUntilGraduation={QUARTER_INFO.monthsUntilGraduation}
        />

        {/* Three columns — 1090×340px total (200+530+360) */}
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

      {/* Bottom hint bar — 1366×44px, full viewport width */}
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
