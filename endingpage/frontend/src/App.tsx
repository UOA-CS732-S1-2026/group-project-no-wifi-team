import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import { EndingCollectionScreen } from './endings/EndingCollectionScreen'

function EndingLandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#7a5c3a] px-6 font-serif text-[#f5e6c8]">
      <main className="max-w-xl rounded-[2rem] border border-[#f5e6c8]/50 bg-[#3b2415]/45 p-8 text-center shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.35em] opacity-80">Standalone Page</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Ending Collection</h1>
        <p className="mt-4 text-sm leading-relaxed opacity-90 sm:text-base">
          This package only contains the ending achievement collection page.
        </p>
        <button
          onClick={() => navigate('/endings')}
          className="mt-6 rounded-full border border-[#f5e6c8] bg-[#a67c52] px-7 py-3 text-sm font-bold text-[#f5e6c8] shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all hover:brightness-110 active:scale-95"
        >
          Open Ending Collection
        </button>
      </main>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <EndingLandingPage />,
  },
  {
    path: '/endings',
    element: <EndingCollectionScreen />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
