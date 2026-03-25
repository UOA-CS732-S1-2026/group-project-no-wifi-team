import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { TitleScreen } from './screens/TitleScreen'

const router = createBrowserRouter([
  {
    path: '/',
    element: <TitleScreen />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
