import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  clearOnboardingState,
  fireConfetti,
  isOnboardingOAuthMode,
  OnboardingLayout,
  useOnboardingStep
} from '@/features/onboarding'
import { CodeBlock } from '@/features/shared/components/McpInstallation'

export const Route = createFileRoute('/onboarding/_layout/complete')({
  component: CompletePage
})

const EXAMPLE_PROMPT = `Deploy a simple html page saying "My agent just made this page and deployed using Ink MCP." Make it cool.`

export default function CompletePage() {
  const { completeOnboarding } = useOnboardingStep('complete')
  const navigate = useNavigate()
  const [isOAuthMode, setIsOAuthMode] = useState(false)

  useEffect(() => {
    const oauthMode = isOnboardingOAuthMode()
    setIsOAuthMode(oauthMode)

    if (oauthMode) {
      // Set flag so consent page knows onboarding is complete
      sessionStorage.setItem('oauth_onboarding_completed', 'true')
      // Clear onboarding state and redirect to consent
      clearOnboardingState()
      void navigate({ to: '/oauth/consent' })
    } else {
      fireConfetti()
    }
  }, [navigate])

  // Don't render anything if redirecting to OAuth consent
  if (isOAuthMode) {
    return null
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
