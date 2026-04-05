import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { TitleScreen } from './screens/TitleScreen'
import { MonthlySummary } from './screens/MonthlySummary'

const router = createBrowserRouter([
  {
    path: '/',
    element: <TitleScreen />,
  },
  {
    path: '/monthly-summary',
    element: <MonthlySummary />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
