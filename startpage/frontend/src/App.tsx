import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CharacterSelectScreen } from './screens/CharacterSelectScreen'
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
])

export default function App() {
  return <RouterProvider router={router} />
}
