import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { signIn as serviceSignIn, signOut as serviceSignOut, isMockDatastore } from '../services/calendarService'

type AuthContextValue = {
  authenticated: boolean
  signingIn: boolean
  isMock: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()
  const [authenticated, setAuthenticated] = useState(false)
  const [signingIn, setSigningIn] = useState(false)

  const signIn = useCallback(async () => {
    setSigningIn(true)
    try {
      await serviceSignIn()
      setAuthenticated(true)
    } finally {
      setSigningIn(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    await serviceSignOut()
    setAuthenticated(false)
    queryClient.removeQueries({ queryKey: ['year-events'] })
    queryClient.removeQueries({ queryKey: ['month-events'] })
  }, [queryClient])

  const value = useMemo(
    () => ({
      authenticated,
      signingIn,
      isMock: isMockDatastore,
      signIn,
      signOut,
    }),
    [authenticated, signingIn, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
