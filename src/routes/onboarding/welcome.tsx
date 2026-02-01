import { Rocket } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { OnboardingLayout, useOnboardingStep } from '@/features/onboarding'

export const Route = createFileRoute('/onboarding/welcome')({
  component: WelcomePage
})

export default function WelcomePage() {
  const { goToNext } = useOnboardingStep('welcome')

  return (
    <OnboardingLayout currentStep="welcome">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="mb-8 flex size-24 items-center justify-center rounded-full bg-primary/10"
        >
          <Rocket className="size-12 text-primary" weight="duotone" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-3xl font-semibold tracking-tight"
        >
          Welcome to Ink
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 max-w-md text-lg text-muted-foreground"
        >
          Let's get you set up so your AI agents can deploy MCP servers directly from your
          repositories.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-xs space-y-4"
        >
          <div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-4 text-left text-sm">
            <p className="font-medium">What we'll do:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Connect your GitHub repositories</li>
              <li>• Create an API key for your agents</li>
              <li>• Configure your MCP client</li>
            </ul>
          </div>

          <Button onClick={goToNext} size="lg" className="w-full">
            Get Started
          </Button>
        </motion.div>
      </div>
    </OnboardingLayout>
  )
}
