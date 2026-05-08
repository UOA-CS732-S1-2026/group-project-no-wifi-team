import { useEffect, useRef } from 'react'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CharacterSelectScreen } from './screens/CharacterSelectScreen'
import { QuarterlySummary } from './screens/QuarterSummary'
import { TaskInteractionScreen } from './screens/TaskInteractionScreen'
import { TitleScreen } from './screens/TitleScreen'
import { MonthlyTaskSelection } from './screens/MonthlyTaskSelection'
import { EndingResultScreen } from './screens/EndingResultScreen'
import { EndingCollectionScreen } from './screens/EndingCollectionScreen'
import type { AppDispatch, RootState } from './store'
import { advanceQuarter } from './slices/gameSlice'

function NextQuarterBridge() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const currentQuarter = useSelector((s: RootState) => s.game.currentQuarter)
  const currentStats = useSelector((s: RootState) => s.game.currentStats)
  const hasAdvanced = useRef(false)

  useEffect(() => {
    if (hasAdvanced.current) return
    hasAdvanced.current = true

    if (currentQuarter >= 4) {
      navigate('/ending-result', {
        replace: true,
        state: { snapshot: currentStats },
      })
      return
    }

    dispatch(advanceQuarter())
    navigate('/monthly-task-selection', { replace: true })
  }, [currentQuarter, currentStats, dispatch, navigate])

  return null
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <TitleScreen />,
  },
  {
    path: '/characters',
    element: <CharacterSelectScreen />,
  },
  {
    path: '/monthly-task-selection',
    element: <MonthlyTaskSelection />,
  },
  {
    path: '/quarterly-summary',
    element: <QuarterlySummary />,
  },
  {
    path: '/next-quarter',
    element: <NextQuarterBridge />,
  },
  {
    path: '/task-interaction',
    element: <TaskInteractionScreen />,
  },
  {
    path: '/ending-result',
    element: <EndingResultScreen />,
  },
  {
    path: '/endings',
    element: <EndingCollectionScreen />,
  },
  {
    path: '*',
    element: <TitleScreen />,
  },
], { basename: import.meta.env.BASE_URL })

export default function App() {
  return <RouterProvider router={router} />
}
