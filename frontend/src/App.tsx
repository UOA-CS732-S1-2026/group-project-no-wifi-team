import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CharacterSelectScreen } from './screens/CharacterSelectScreen'
import { QuarterlySummary } from './screens/QuarterSummary'
import { TaskInteractionScreen } from './screens/TaskInteractionScreen'
import { TitleScreen } from './screens/TitleScreen'
import { MonthlyTaskSelection } from './screens/MonthlyTaskSelection'
import { EndingResultScreen } from './screens/EndingResultScreen'
import { EndingCollectionScreen } from './screens/EndingCollectionScreen'

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
])
export default function App() {
  return <RouterProvider router={router} />
}
