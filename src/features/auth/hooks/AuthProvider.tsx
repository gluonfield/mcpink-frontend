import { useApolloClient } from '@apollo/client'
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { createContext, useCallback, useEffect, useState } from 'react'

import type { AuthContextType, AuthProviderProps, User } from '@/features/auth'
import { firebaseAuth, googleProvider } from '@/features/auth/lib/firebase'
import { ME_QUERY } from '@/features/shared/graphql/operations'
import { logError } from '@/features/shared/utils/logger'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const apolloClient = useApolloClient()

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await apolloClient.query({
        query: ME_QUERY,
        fetchPolicy: 'network-only'
      })
      if (data?.me) {
        setUser(data.me)
      }
    } catch (error) {
      logError('Failed to fetch user', error)
    }
  }, [apolloClient])

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, async firebaseUser => {
      if (firebaseUser) {
        await fetchMe()
      } else {
        setUser(null)
      }
      setLoading(false)
    })
  }, [fetchMe])

  const signIn = async () => {
    try {
      setLoading(true)
      await signInWithPopup(firebaseAuth, googleProvider)
    } catch (error) {
      logError('Sign in failed', error)
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await firebaseSignOut(firebaseAuth)
      await apolloClient.clearStore()
      setUser(null)
    } catch (error) {
      logError('Error signing out', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
