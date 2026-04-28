import { Navigate, Route, Routes } from 'react-router-dom'
import { EndingCollectionScreen } from './screens/EndingCollectionScreen'

function App() {
  return (
    <Routes>
      <Route path="/endings" element={<EndingCollectionScreen />} />
      <Route path="*" element={<Navigate to="/endings" replace />} />
    </Routes>
  )
}

export default App
