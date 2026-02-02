import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { OnboardingLayout, useOnboardingStep } from '@/features/onboarding'

export const Route = createFileRoute('/onboarding/_layout/welcome')({
  component: WelcomePage
})

export default function WelcomePage() {
  const { goToNext } = useOnboardingStep('welcome')

  return (
    <OnboardingLayout currentStep="welcome">
      <div className="flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-3xl font-semibold tracking-tight"
        >
          Welcome to Ink
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 max-w-md text-lg text-muted-foreground"
        >
          We'll grant agent an ability to deploy apps, websites and backends.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button onClick={goToNext} size="lg" className="px-8">
            Get Started
          </Button>
        </motion.div>
      </div>
    </OnboardingLayout>
  )
}
