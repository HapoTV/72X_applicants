import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardPage, TenderDetailPage } from '@/pages'
import { Toaster } from '@/components/ui/toaster-ui'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tender/:tenderId" element={<TenderDetailPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
