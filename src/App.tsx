import { QueryClientProvider } from '@tanstack/react-query'
import MuiAppProvider from './components/MuiAppProvider'
import Main from './components/Main'
import { AuthProvider } from './contexts/AuthContext'
import { queryClient } from './lib/queryClient'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MuiAppProvider>
        <AuthProvider>
          <Main />
        </AuthProvider>
      </MuiAppProvider>
    </QueryClientProvider>
  )
}
