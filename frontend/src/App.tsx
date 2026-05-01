import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { TitleScreen } from './screens/TitleScreen'
import { MonthlySummary } from './screens/MonthlySummary'
import { TaskInteractionScreen } from './screens/TaskInteractionScreen'
import { MonthlyTaskSelection } from './screens/MonthlyTaskSelection'
import {EndingCollectionScreen} from './screens/EndingCollectionScreen.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <TitleScreen />,
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
    path: '/endings',
    element: <EndingCollectionScreen />,
  },
])
export default function App() {
  return <RouterProvider router={router} />
}
