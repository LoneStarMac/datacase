import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import FamilyPage from './pages/FamilyPage'
import EnginePage from './pages/EnginePage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="family/:manufacturer" element={<FamilyPage />} />
          <Route path="engine/:manufacturer/:code" element={<EnginePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
