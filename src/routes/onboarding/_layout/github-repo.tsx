import { useQuery } from '@apollo/client'
import { ArrowRight } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { OnboardingLayout, TechnicalToggle, useOnboardingStep } from '@/features/onboarding'
import { ME_QUERY } from '@/features/shared/graphql/operations'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const Route = createFileRoute('/onboarding/_layout/github-repo')({
  component: GithubRepoPage
})

export default function GithubRepoPage() {
  const { goToNext, setReturnStep } = useOnboardingStep('github-repo')
  const { data: meData } = useQuery(ME_QUERY)

  const hasRepoScope = meData?.me?.githubScopes?.includes('repo')

  const handleGrantAccess = () => {
    setReturnStep('agent-key')
    window.location.href = `${API_URL}/auth/github?scope=repo`
  }

  return (
    <OnboardingLayout currentStep="github-repo">
      <div className="flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-3xl font-semibold tracking-tight"
        >
          Repository Access
        </motion.h1>

        {hasRepoScope && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 max-w-md text-lg text-muted-foreground"
          >
            You already have repository access enabled.
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`flex w-full flex-col items-center space-y-4 ${!hasRepoScope ? 'mt-4' : ''}`}
        >
          {!hasRepoScope && (
            <>
              <div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-4 text-left text-sm">
                <p className="font-medium">What this enables:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Agents can create new repositories in your account</li>
                  <li>• Agents can push code to repositories on your behalf</li>
                </ul>
              </div>

              <TechnicalToggle title="What can repo access do?" className="w-full">
                <div className="space-y-2 text-left">
                  <p>
                    Github OAuth <code className="text-foreground">repo</code> access allows regular
                    Github accounts to create new repositories programmatically.
                  </p>
                  <p>
                    If you don't have <code className="text-foreground">gh</code> CLI installed or
                    configured, then <code className="text-foreground">repo</code> access allows the
                    agent to create new repositories in your account.
                  </p>
                  <p>
                    This permission is only needed if your agent will be creating new Github repos
                    and Github CLI is not installed or configured.
                  </p>
                </div>
              </TechnicalToggle>

              <Button onClick={handleGrantAccess} size="lg" className="px-8">
                Grant Repo Access
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </>
          )}

          <Button
            onClick={goToNext}
            variant={hasRepoScope ? 'default' : 'outline'}
            size="lg"
            className="px-8"
          >
            {hasRepoScope ? 'Continue' : 'Skip, I will manage Github repositories myself'}
          </Button>
        </motion.div>
      </div>
    </OnboardingLayout>
  )
}
