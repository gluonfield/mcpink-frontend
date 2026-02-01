import { useApolloClient } from '@apollo/client'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { getOnboardingReturnStep, ONBOARDING_STEPS } from '@/features/onboarding'

export const Route = createFileRoute('/githubapp/callback')({
  component: GitHubAppCallbackPage
})

export default function GitHubAppCallbackPage() {
  const navigate = useNavigate()
  const apolloClient = useApolloClient()

  useEffect(() => {
    void apolloClient.resetStore()

    const returnStep = getOnboardingReturnStep()

    const timeout = setTimeout(() => {
      if (returnStep) {
        const stepConfig = ONBOARDING_STEPS.find(s => s.id === returnStep)
        if (stepConfig) {
          void navigate({ to: stepConfig.path })
          return
        }
      }
      void navigate({ to: '/' })
    }, 1500)

    return () => clearTimeout(timeout)
  }, [navigate, apolloClient])

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4">
      <Spinner className="h-8 w-8" />
      <div className="text-center">
        <h1 className="text-lg font-medium">GitHub App Connected</h1>
        <p className="mt-1 text-muted-foreground">Redirecting you back...</p>
      </div>
    </div>
  )
}
