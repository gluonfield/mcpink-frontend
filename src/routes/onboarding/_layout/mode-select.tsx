import { CaretDown, GithubLogo, Lightning } from '@phosphor-icons/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { useContext, useState } from 'react'

import { Button } from '@/components/ui/button'
import { OnboardingLayout } from '@/features/onboarding'
import { OnboardingTransitionContext } from '@/features/onboarding/hooks/OnboardingTransitionContext'

export const Route = createFileRoute('/onboarding/_layout/mode-select')({
  component: ModeSelectPage
})

export default function ModeSelectPage() {
  const navigate = useNavigate()
  const transitionContext = useContext(OnboardingTransitionContext)
  const [expandedCard, setExpandedCard] = useState<'managed' | 'github' | null>(null)

  const navigateWithTransition = (path: string) => {
    const doNavigate = () => void navigate({ to: path })
    if (transitionContext?.triggerTransition) {
      transitionContext.triggerTransition(doNavigate)
    } else {
      doNavigate()
    }
  }

  const toggleExpand = (card: 'managed' | 'github', e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedCard(expandedCard === card ? null : card)
  }

  return (
    <OnboardingLayout currentStep="mode-select">
      <div className="flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 text-2xl font-semibold"
        >
          How should we store your code?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-muted-foreground"
        >
          You can change this anytime
        </motion.p>

        <div className="flex w-full flex-col gap-3">
          {/* Quick Start Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex w-full flex-col rounded-lg border border-white/[0.12] bg-white/5 p-5 text-left"
          >
            <div className="flex items-center gap-2">
              <Lightning className="h-5 w-5 text-foreground" weight="fill" />
              <h3 className="font-medium">Quick Start</h3>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/60">
                Recommended
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              We handle everything. Just start building.
            </p>

            <AnimatePresence>
              {expandedCard === 'managed' && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 space-y-1.5 overflow-hidden text-sm text-muted-foreground"
                >
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    <span>No setup required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    <span>We create a private space for your code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    <span>Perfect for getting started quickly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    <span>Switch to GitHub anytime</span>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={e => toggleExpand('managed', e)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <CaretDown
                  className={`h-3 w-3 transition-transform ${expandedCard === 'managed' ? 'rotate-180' : ''}`}
                />
                {expandedCard === 'managed' ? 'Less info' : 'More info'}
              </button>
              <Button onClick={() => navigateWithTransition('/onboarding/agent-key')}>
                Get Started
              </Button>
            </div>
          </motion.div>

          {/* GitHub Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex w-full flex-col rounded-lg border border-white/[0.08] bg-white/[0.03] p-5 text-left"
          >
            <div className="flex items-center gap-2">
              <GithubLogo className="h-5 w-5 text-foreground" weight="fill" />
              <h3 className="font-medium">Use My GitHub</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Already have code on GitHub? Connect your account.
            </p>

            <AnimatePresence>
              {expandedCard === 'github' && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 space-y-1.5 overflow-hidden text-sm text-muted-foreground"
                >
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    <span>Deploy directly from your GitHub repos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    <span>You keep full control of your code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    <span>Requires connecting your GitHub account</span>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={e => toggleExpand('github', e)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <CaretDown
                  className={`h-3 w-3 transition-transform ${expandedCard === 'github' ? 'rotate-180' : ''}`}
                />
                {expandedCard === 'github' ? 'Less info' : 'More info'}
              </button>
              <Button
                variant="outline"
                onClick={() => navigateWithTransition('/onboarding/github-app')}
              >
                Connect GitHub
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
