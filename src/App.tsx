import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MuiAppProvider from './components/MuiAppProvider'
import { AuthProvider } from './contexts/AuthContext'
import { queryClient } from './lib/queryClient'
import SnapshotPage from './pages/SnapshotPage'

const basename = (process.env.PUBLIC_URL || '').replace(/\/$/, '')

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MuiAppProvider>
        <AuthProvider>
          <BrowserRouter basename={basename || undefined}>
            <Routes>
              <Route path="/" element={<SnapshotPage mode="yearify" />} />
              <Route
                path="/monthify"
                element={<SnapshotPage mode="monthify" />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </MuiAppProvider>
    </QueryClientProvider>
  )
}
