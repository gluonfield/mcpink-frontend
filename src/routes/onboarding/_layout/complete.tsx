import { CheckCircle } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { fireConfetti, OnboardingLayout, useOnboardingStep } from '@/features/onboarding'
import { CodeBlock } from '@/features/shared/components/McpInstallation'

export const Route = createFileRoute('/onboarding/_layout/complete')({
  component: CompletePage
})

const EXAMPLE_PROMPT = `Deploy a simple MCP server that exposes a "hello" tool.
Use my ink-mcp account to host it.`

export default function CompletePage() {
  const { completeOnboarding } = useOnboardingStep('complete')

  useEffect(() => {
    fireConfetti()
  }, [])

  return (
    <OnboardingLayout currentStep="complete" wide>
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="mb-8 flex size-24 items-center justify-center rounded-full bg-green-500/20"
        >
          <CheckCircle className="size-12 text-green-500" weight="duotone" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-3xl font-semibold tracking-tight"
        >
          You're All Set!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 max-w-md text-lg text-muted-foreground"
        >
          Your agents can now deploy MCP servers directly from your repositories.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex w-full flex-col items-center space-y-6"
        >
          <div className="space-y-3 text-left">
            <p className="text-sm font-medium">Try this example prompt:</p>
            <CodeBlock>{EXAMPLE_PROMPT}</CodeBlock>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-left text-sm">
            <p className="font-medium">What's next?</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Ask your agent to deploy an MCP server</li>
              <li>• View your deployments in the Apps dashboard</li>
              <li>• Manage API keys in Settings</li>
            </ul>
          </div>

          <Button onClick={completeOnboarding} size="lg" className="px-8">
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    </OnboardingLayout>
  )
}
