import { useApolloClient } from '@apollo/client'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { getOnboardingReturnStep, ONBOARDING_STEPS } from '@/features/onboarding'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallbackPage
})

export default function AuthCallbackPage() {
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
      void navigate({ to: '/github' })
    }, 500)

    return () => clearTimeout(timeout)
  }, [navigate, apolloClient])

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      <Spinner className="size-6" />
    </div>
  )
}
