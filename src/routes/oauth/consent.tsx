import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { firebaseAuth } from '@/features/auth/lib/firebase'
import { setOnboardingOAuthMode } from '@/features/onboarding'

export const Route = createFileRoute('/oauth/consent')({
  component: OAuthConsentPage
})

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081'

/**
 * OAuth consent entry point.
 *
 * This page is the initial landing page for OAuth flows. It:
 * 1. Triggers sign-in if user is not authenticated
 * 2. Validates the OAuth session exists
 * 3. Sets OAuth mode in localStorage
 * 4. Redirects to onboarding welcome page
 *
 * The actual consent UI is now part of the onboarding complete page.
 */
export default function OAuthConsentPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading, signIn } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const signInTriggered = useRef(false)

  // Auto-trigger sign-in if not authenticated
  useEffect(() => {
    if (authLoading) return
    if (!user && !signInTriggered.current) {
      signInTriggered.current = true
      void signIn()
    }
  }, [authLoading, user, signIn])

  // Validate OAuth context and redirect once authenticated
  useEffect(() => {
    if (authLoading || !user) return

    const validateAndRedirect = async () => {
      try {
        const firebaseUser = firebaseAuth.currentUser
        if (!firebaseUser) {
          setError('Please sign in first.')
          return
        }
        const token = await firebaseUser.getIdToken()

        // Validate OAuth session exists (needs credentials for the mcp_oauth_context cookie)
        const response = await fetch(`${API_URL}/oauth/context`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include'
        })

        if (!response.ok) {
          if (response.status === 401) {
            setError('Session expired. Please restart the authorization from your MCP client.')
          } else if (response.status === 400) {
            setError('No OAuth flow in progress. Please start from your MCP client.')
          } else {
            setError('Failed to load OAuth context')
          }
          return
        }

        // Set OAuth mode and redirect to onboarding
        setOnboardingOAuthMode(true)
        await navigate({ to: '/onboarding/welcome', search: { oauth: true } })
      } catch (err) {
        console.error('Failed to fetch OAuth context:', err)
        setError('Failed to load OAuth context')
      }
    }

    void validateAndRedirect()
  }, [authLoading, user, navigate])

  // Show error if any
  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-4">
        <h1 className="mb-2 text-xl font-semibold">Authorization Error</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  // Show loading (will redirect)
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      <Spinner className="size-6" />
    </div>
  )
}
