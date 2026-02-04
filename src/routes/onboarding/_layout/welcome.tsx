import { createFileRoute, useSearch } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { OnboardingLayout, setOnboardingOAuthMode, useOnboardingStep } from '@/features/onboarding'

export const Route = createFileRoute('/onboarding/_layout/welcome')({
  component: WelcomePage,
  validateSearch: (search: Record<string, unknown>): { oauth?: boolean } => ({
    oauth: search.oauth === true || search.oauth === 'true' ? true : undefined
  })
})

export default function WelcomePage() {
  const { goToNext } = useOnboardingStep('welcome')
  const { oauth } = useSearch({ from: '/onboarding/_layout/welcome' })

  useEffect(() => {
    if (oauth) {
      setOnboardingOAuthMode(true)
    }
  }, [oauth])

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
