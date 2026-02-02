import { useMutation, useQuery } from '@apollo/client'
import { ArrowRight, GithubLogo } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { OnboardingLayout, TechnicalToggle, useOnboardingStep } from '@/features/onboarding'
import { ME_QUERY, RECHECK_GITHUB_APP_MUTATION } from '@/features/shared/graphql/operations'

const GITHUB_APP_SLUG = 'ink-mcp'

export const Route = createFileRoute('/onboarding/_layout/github-app')({
  component: GithubAppPage
})

export default function GithubAppPage() {
  const { goToNext, setReturnStep } = useOnboardingStep('github-app')
  const [isChecking, setIsChecking] = useState(false)

  const { data: meData, refetch } = useQuery(ME_QUERY)
  const [recheckInstallation] = useMutation(RECHECK_GITHUB_APP_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
    awaitRefetchQueries: true
  })

  const hasGithubApp = !!meData?.me?.githubAppInstallationId

  const checkInstallation = useCallback(async () => {
    setIsChecking(true)
    try {
      await recheckInstallation()
      await refetch()
    } finally {
      setIsChecking(false)
    }
  }, [recheckInstallation, refetch])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !hasGithubApp) {
        void checkInstallation()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [checkInstallation, hasGithubApp])

  const handleInstall = () => {
    setReturnStep('github-app')
    window.open(`https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`, '_blank')
  }

  return (
    <OnboardingLayout currentStep="github-app">
      <div className="flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-3xl font-semibold tracking-tight"
        >
          {hasGithubApp ? 'Github App Installed' : 'Install Github App'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 max-w-md text-lg text-muted-foreground"
        >
          {hasGithubApp
            ? 'You already have the Github App installed.'
            : 'Connecting Github allows agent to deploy apps straight from Github.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex w-full flex-col items-center space-y-4"
        >
          {hasGithubApp ? (
            <Button onClick={goToNext} size="lg" className="px-8">
              Continue
            </Button>
          ) : (
            <>
              <div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-4 text-left text-sm">
                <p className="font-medium">Recommended: Full account access</p>
                <p className="text-muted-foreground">
                  You can always manually grant agent access to different repositories later, but
                  doing it each time is tedious.
                </p>
              </div>

              <TechnicalToggle title="Why does the Github App need these permissions?" className="w-full">
                <p className="text-left">
                  Ink MCP requires access to Github repository in order to make app deployment. Ink
                  MCP allows your Agent to make Github commits even without having <code>git</code>{' '}
                  configured on the machine via Github App. This allows agents to make deployments
                  from sandboxes and complex environments.
                </p>
              </TechnicalToggle>

              <Button onClick={handleInstall} size="lg" className="px-8" disabled={isChecking}>
                {isChecking ? (
                  <>
                    <Spinner className="mr-2 size-4" />
                    Checking...
                  </>
                ) : (
                  <>
                    <GithubLogo className="mr-2 size-5" weight="bold" />
                    Install Github App
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                After installing, this page will automatically update.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </OnboardingLayout>
  )
}
