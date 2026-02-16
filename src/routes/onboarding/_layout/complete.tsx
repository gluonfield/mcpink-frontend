import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { firebaseAuth } from '@/features/auth/lib/firebase'
import {
  clearOnboardingState,
  fireConfetti,
  isOnboardingOAuthMode,
  OnboardingLayout,
  useOnboardingStep
} from '@/features/onboarding'
import { CodeBlock } from '@/features/shared/components/McpInstallation'
import { MCP_OAUTH_BASE_URL } from '@/features/shared/config/api'
import { logError } from '@/features/shared/utils/logger'

export const Route = createFileRoute('/onboarding/_layout/complete')({
  component: CompletePage
})

const EXAMPLE_PROMPT = `Deploy a simple html page saying "My agent just made this page and deployed using Ink MCP." Make it cool.`

interface OAuthContext {
  client_id: string
  redirect_uri: string
  state: string
  user_id: string
}

export default function CompletePage() {
  const { completeOnboarding } = useOnboardingStep('complete')

  // Check OAuth mode synchronously during render (not in useEffect)
  // This ensures consistent behavior across StrictMode double-renders
  const oauthModeRef = useRef<boolean | null>(null)
  if (oauthModeRef.current === null) {
    oauthModeRef.current = isOnboardingOAuthMode()
  }
  const isOAuthMode = oauthModeRef.current

  // OAuth state
  const [oauthContext, setOAuthContext] = useState<OAuthContext | null>(null)
  const [oauthError, setOAuthError] = useState<string | null>(null)
  const [completing, setCompleting] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  // Fetch OAuth context when in OAuth mode
  useEffect(() => {
    if (!isOAuthMode) {
      fireConfetti()
      return
    }

    const fetchContext = async () => {
      try {
        const user = firebaseAuth.currentUser
        if (!user) {
          setOAuthError('Please sign in first.')
          return
        }
        const token = await user.getIdToken()

        const response = await fetch(`${MCP_OAUTH_BASE_URL}/oauth/context`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include'
        })

        if (!response.ok) {
          if (response.status === 401) {
            setOAuthError('Session expired. Please restart the authorization from your MCP client.')
          } else if (response.status === 400) {
            setOAuthError('No OAuth flow in progress. Please start from your MCP client.')
          } else {
            setOAuthError('Failed to load OAuth context')
          }
          return
        }

        const data = await response.json()
        setOAuthContext(data)
        fireConfetti()
      } catch (err) {
        logError('Failed to fetch OAuth context', err)
        setOAuthError('Failed to load OAuth context')
      }
    }

    void fetchContext()
  }, [isOAuthMode])

  const handleAuthorize = async () => {
    if (!oauthContext) return

    setCompleting(true)
    try {
      const user = firebaseAuth.currentUser
      if (!user) {
        setOAuthError('Please sign in first.')
        setCompleting(false)
        return
      }
      const token = await user.getIdToken()

      const response = await fetch(`${MCP_OAUTH_BASE_URL}/oauth/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          api_key_name: `MCP Client (${oauthContext.client_id})`
        })
      })

      if (!response.ok) {
        setOAuthError('Failed to authorize. Please try again.')
        setCompleting(false)
        return
      }

      const data = await response.json()
      clearOnboardingState()
      setAuthorized(true)
      setCompleting(false)
      window.location.href = data.redirect_url
    } catch (err) {
      logError('Failed to complete OAuth', err)
      setOAuthError('Failed to authorize. Please try again.')
      setCompleting(false)
    }
  }

  const handleCancel = () => {
    if (!oauthContext) return

    clearOnboardingState()
    const url = new URL(oauthContext.redirect_uri)
    url.searchParams.set('error', 'access_denied')
    if (oauthContext.state) {
      url.searchParams.set('state', oauthContext.state)
    }
    window.location.href = url.toString()
  }

  // OAuth mode: show authorization UI
  if (isOAuthMode) {
    // Show success after authorization completes
    if (authorized) {
      return (
        <OnboardingLayout currentStep="complete">
          <div className="flex flex-col items-center text-center">
            <h1 className="mb-4 text-3xl font-semibold tracking-tight">Authorization Complete</h1>
            <p className="text-muted-foreground">Redirecting back to your MCP client...</p>
            <p className="mt-4 text-sm text-muted-foreground">
              You can close this tab if it doesn't redirect automatically.
            </p>
          </div>
        </OnboardingLayout>
      )
    }

    // Show error if any
    if (oauthError) {
      return (
        <OnboardingLayout currentStep="complete">
          <div className="flex flex-col items-center text-center">
            <h1 className="mb-4 text-3xl font-semibold tracking-tight">Authorization Error</h1>
            <p className="text-muted-foreground">{oauthError}</p>
          </div>
        </OnboardingLayout>
      )
    }

    // Show loading while fetching context
    if (!oauthContext) {
      return (
        <OnboardingLayout currentStep="complete">
          <div className="flex flex-col items-center">
            <Spinner className="size-6" />
          </div>
        </OnboardingLayout>
      )
    }

    // Show authorization UI
    return (
      <OnboardingLayout currentStep="complete">
        <div className="flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 text-3xl font-semibold tracking-tight"
          >
            You're All Set!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 max-w-md text-lg text-muted-foreground"
          >
            <span className="font-medium text-foreground">{oauthContext.client_id}</span> is ready
            to deploy apps on your behalf
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3"
          >
            <Button variant="outline" onClick={handleCancel} disabled={completing}>
              Cancel
            </Button>
            <Button onClick={() => void handleAuthorize()} disabled={completing}>
              {completing ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Authorizing...
                </>
              ) : (
                'Authorize'
              )}
            </Button>
          </motion.div>
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout currentStep="complete" wide>
      <div className="flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-3xl font-semibold tracking-tight"
        >
          You're All Set!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 max-w-md text-lg text-muted-foreground"
        >
          Your agent now has Ink MCP and is capable of deploying apps, websites and backends.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex w-full flex-col items-center space-y-6"
        >
          <div className="space-y-3 text-left">
            <p className="text-sm font-medium">Try this example prompt:</p>
            <CodeBlock>{EXAMPLE_PROMPT}</CodeBlock>
          </div>

          <Button onClick={completeOnboarding} size="lg" className="px-8">
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    </OnboardingLayout>
  )
}
