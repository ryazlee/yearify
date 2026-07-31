import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import MuiAppProvider from './components/MuiAppProvider'
import { AuthProvider } from './contexts/AuthContext'
import { CategoryProvider } from './contexts/CategoryContext'
import { trackPageview } from './lib/analytics'
import { queryClient } from './lib/queryClient'
import SnapshotPage from './pages/SnapshotPage'

const basename = (process.env.PUBLIC_URL || '').replace(/\/$/, '')

function RouteAnalytics() {
  const location = useLocation()

  useEffect(() => {
    // Use the real browser path so GitHub Pages base (/yearify/) is included.
    trackPageview()
  }, [location.pathname, location.search, location.hash])

  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MuiAppProvider>
        <AuthProvider>
          <CategoryProvider>
            <BrowserRouter basename={basename || undefined}>
              <RouteAnalytics />
              <Routes>
                <Route path="/" element={<SnapshotPage mode="yearify" />} />
                <Route
                  path="/halfify"
                  element={<SnapshotPage mode="halfify" />}
                />
                <Route
                  path="/quarterify"
                  element={<SnapshotPage mode="quarterify" />}
                />
                <Route
                  path="/monthify"
                  element={<SnapshotPage mode="monthify" />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </CategoryProvider>
        </AuthProvider>
      </MuiAppProvider>
    </QueryClientProvider>
  )
}
