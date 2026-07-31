import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  signIn as serviceSignIn,
  signOut as serviceSignOut,
  restoreSession as serviceRestoreSession,
  isMockDatastore,
} from '../services/calendarService'

type AuthContextValue = {
  authenticated: boolean
  authReady: boolean
  signingIn: boolean
  isMock: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()
  const [authenticated, setAuthenticated] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const restored = await serviceRestoreSession()
        if (!cancelled && restored) setAuthenticated(true)
      } catch {
        // Stay signed out if restore fails.
      } finally {
        if (!cancelled) setAuthReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

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
      authReady,
      signingIn,
      isMock: isMockDatastore,
      signIn,
      signOut,
    }),
    [authenticated, authReady, signingIn, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
