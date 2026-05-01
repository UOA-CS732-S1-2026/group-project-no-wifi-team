import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {CharacterSelectScreen} from './screens/CharacterSelectScreen.tsx'
import { MonthlySummary } from './screens/MonthlySummary'
import { TaskInteractionScreen } from './screens/TaskInteractionScreen'
import { TitleScreen } from './screens/TitleScreen'

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
    path: '/monthly-summary',
    element: <MonthlySummary />,
  },
  {
    path: '/task-interaction',
    element: <TaskInteractionScreen />,
  },

  {
    path: '*',
    element: <TitleScreen />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
