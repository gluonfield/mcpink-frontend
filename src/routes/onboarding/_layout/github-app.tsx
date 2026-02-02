import { useMutation, useQuery } from '@apollo/client'
import { ArrowRight, CheckCircle, GithubLogo } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { OnboardingLayout, TechnicalToggle, useOnboardingStep } from '@/features/onboarding'
import { ME_QUERY, RECHECK_GITHUB_APP_MUTATION } from '@/features/shared/graphql/operations'

const GITHUB_APP_SLUG = 'ink-mcp'

export const Route = createFileRoute('/onboarding/_layout/github-app')({
  component: GitHubAppPage
})

export default function GitHubAppPage() {
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
    setReturnStep('github-repo')
    window.open(`https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`, '_blank')
  }

  return (
    <OnboardingLayout currentStep="github-app">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className={`mb-8 flex size-24 items-center justify-center rounded-full ${hasGithubApp ? 'bg-green-500/20' : 'bg-muted'}`}
        >
          {hasGithubApp ? (
            <CheckCircle className="size-12 text-green-500" weight="duotone" />
          ) : (
            <GithubLogo className="size-12 text-foreground" weight="duotone" />
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-3xl font-semibold tracking-tight"
        >
          {hasGithubApp ? 'GitHub App Installed' : 'Install GitHub App'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 max-w-md text-lg text-muted-foreground"
        >
          {hasGithubApp
            ? 'You already have the GitHub App installed.'
            : 'Connect your GitHub account so agents can deploy MCP servers from your repositories.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex w-full flex-col items-center space-y-4"
        >
          {!hasGithubApp && (
            <>
              <div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-4 text-left text-sm">
                <p className="font-medium">Recommended: Full account access</p>
                <p className="text-muted-foreground">
                  This allows agents to deploy from any of your repositories. You can always change
                  this later.
                </p>
              </div>

              <TechnicalToggle title="Why does the GitHub App need these permissions?">
                <div className="space-y-2">
                  <p>
                    <strong>Read access to code:</strong> Agents need to read your repository
                    contents to build and deploy your MCP servers.
                  </p>
                  <p>
                    <strong>Read access to metadata:</strong> We use this to list your repositories
                    and branches.
                  </p>
                  <p>
                    The app has read-only access and cannot modify your code or repository settings.
                  </p>
                </div>
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
                    Install GitHub App
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                After installing, this page will automatically update.
              </p>
            </>
          )}

          <Button
            onClick={goToNext}
            variant={hasGithubApp ? 'default' : 'outline'}
            size="lg"
            className="px-8"
            disabled={!hasGithubApp && isChecking}
          >
            {hasGithubApp ? 'Continue' : 'Skip for now'}
          </Button>
        </motion.div>
      </div>
    </OnboardingLayout>
  )
}
