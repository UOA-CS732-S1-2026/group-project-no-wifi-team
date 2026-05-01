import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { TitleScreen } from './screens/TitleScreen'
import { MonthlySummary } from './screens/MonthlySummary'
import { TaskInteractionScreen } from './screens/TaskInteractionScreen'
import { MonthlyTaskSelection } from './screens/MonthlyTaskSelection'

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
])

export default function App() {
  return <RouterProvider router={router} />
}
