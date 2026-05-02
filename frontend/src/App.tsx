import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CharacterSelectScreen } from './screens/CharacterSelectScreen'
import { MonthlySummary } from './screens/MonthlySummary'
import { TaskInteractionScreen } from './screens/TaskInteractionScreen'
import { TitleScreen } from './screens/TitleScreen'
import { MonthlyTaskSelection } from './screens/MonthlyTaskSelection'
import { EndingScreen } from './screens/EndingScreen'
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
    path: '/monthly-summary',
    element: <MonthlySummary />,
  },
  {
    path: '/task-interaction',
    element: <TaskInteractionScreen />,
  },
  {
    path: '/ending',
    element: <EndingScreen />,
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
