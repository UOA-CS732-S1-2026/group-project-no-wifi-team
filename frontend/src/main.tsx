import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './store'
import './index.css'
import App from './App'

const queryClient = new QueryClient()

store.subscribe(() => console.log('[Redux Store]', store.getState()))

// Handle GitHub Pages SPA redirect
const redirect = sessionStorage.getItem('spa_redirect')
if (redirect) {
  sessionStorage.removeItem('spa_redirect')
  window.history.replaceState(null, '', redirect)
}

const container = document.getElementById('root')

if (!container) {
  throw new Error("Root element with id 'root' not found")
}

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
