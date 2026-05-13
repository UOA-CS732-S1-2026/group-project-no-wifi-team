import { useState, useEffect } from 'react'
import { AnimatePresence, motion, LayoutGroup } from 'motion/react'
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
  mapEventToTask,
  type Category,
  type Task,
} from '../components/MonthlyTaskSelection'
import { SettingsModal } from '../components/TitleScreen/SettingsModal'
import { useMusicContext } from '../contexts/MusicContext'
import settingImg from '../assets/CommonImage/setting.png'

export function MonthlyTaskSelection() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const quarter = useSelector((s: RootState) => s.game.currentQuarter) as 1 | 2 | 3 | 4
  const currentStats = useSelector((s: RootState) => s.game.currentStats)
  const { musicEnabled, setMusicEnabled, sfxEnabled, setSfxEnabled } = useMusicContext()
  const [activeCategory, setActiveCategory] = useState<Category>('Study')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showFullToast, setShowFullToast] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const attempt = (retriesLeft: number) => {
      fetchEventsByQuarter(quarter)
        .then(({ events }) => {
          if (!cancelled) {
            setTasks(events.map(mapEventToTask))
            setLoading(false)
          }
        })
        .catch(() => {
          if (cancelled) return
          if (retriesLeft > 0) {
            setTimeout(() => attempt(retriesLeft - 1), 2000)
          } else {
            setLoading(false)
          }
        })
    }

    attempt(2)
    return () => { cancelled = true }
  }, [quarter])

  const visibleTasks = tasks.filter(
    (t) => t.category === activeCategory && !selectedIds.includes(t.id)
  )
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

    console.log('[Selected Tasks]', chosen.map(t => ({ id: t.id, name: t.name, category: t.category })))

    try {
      const { event } = await fetchRandomEvent(quarter)
      const randomTask = mapEventToTask(event)
      console.log('[Random Task]', { id: randomTask.id, name: randomTask.name, category: event.category })
      dispatch(confirmQuarterTasks({
        quarter: quarter,
        selectedTasks: chosen,
        randomTask,
      }))
    } catch {
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

        <LayoutGroup id="selection-sync">
          <div className="flex" style={{ width: '1090px', height: '100%', marginTop: 88 }}>
            <CategoryPanel active={activeCategory} onSelect={setActiveCategory} />

            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1"
              >
                <TaskList
                  activeCategory={activeCategory}
                  tasks={visibleTasks}
                  selectedIds={selectedIds}
                  onToggle={toggleTask}
                  loading={loading}
                />
              </motion.div>
            </AnimatePresence>

            <div className="flex">
              <MonthlyPlanBoard
                selectedTasks={selectedTasks}
                selectedCount={selectedIds.length}
                allSelected={selectedIds.length === MAX_PLAYER_SELECTIONS}
                onRemove={toggleTask}
                onConfirm={handleConfirm}
              />
            </div>
          </div>
        </LayoutGroup>
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
