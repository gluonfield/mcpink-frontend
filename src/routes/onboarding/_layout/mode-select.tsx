import { CaretDown } from '@phosphor-icons/react'
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
          Choose git source
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-muted-foreground"
        >
          Where should deployments pull code from?
        </motion.p>

        <div className="flex w-full flex-col gap-3">
          {/* Managed Mode Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex w-full flex-col rounded-xl border border-border/50 bg-card/50 p-4 text-left backdrop-blur-sm"
          >
            <h3 className="font-medium">Managed</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              For users who just want their code deployed by agent — no git configuration or GitHub
              access needed
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
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Works out of the box — no setup required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Uses managed git repositories to store code for deployment process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>No GitHub access needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Recommended for beginners</span>
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
                Select
              </Button>
            </div>
          </motion.div>

          {/* GitHub Mode Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex w-full flex-col rounded-xl border border-border/50 bg-card/50 p-4 text-left backdrop-blur-sm"
          >
            <h3 className="font-medium">Your GitHub</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              For developers who can manage GitHub permissions or have existing code on GitHub
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
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Deployments pull code from your GitHub account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>Requires installing the Ink GitHub App</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>
                      OAuth repo access needed for agent to create new repositories (or agent should
                      be able to use{' '}
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">gh</code>{' '}
                      cli)
                    </span>
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
              <Button onClick={() => navigateWithTransition('/onboarding/github-app')}>
                Select
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-sm text-muted-foreground/70"
        >
          You can always switch between these options by giving your agent instructions.
        </motion.p>
      </div>
    </OnboardingLayout>
  )
}
