import { useQuery } from '@apollo/client'
import { FolderSimple, GithubLogo, Globe, Robot, Rocket } from '@phosphor-icons/react'
import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import ElectricBorder from '@/components/ElectricBorder'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { clearOnboardingState, getStoredOnboardingStep } from '@/features/onboarding'
import { ME_QUERY } from '@/features/shared/graphql/operations'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage
})

function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { data: meData, loading: meLoading } = useQuery(ME_QUERY, { skip: !user })

  const githubAppInstallationId = meData?.me?.githubAppInstallationId

  useEffect(() => {
    if (authLoading || !user || meLoading) return

    const hasGithubApp = !!githubAppInstallationId
    const storedStep = getStoredOnboardingStep()

    // User has completed onboarding - clear any stored state
    if (hasGithubApp && storedStep) {
      clearOnboardingState()
    }
  }, [authLoading, user, meLoading, githubAppInstallationId])

  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" />
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Fixed background layer with dots */}
      <div className="fixed inset-0 z-0">
        {/* Dot Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--dot-color) 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        />
        {/* Radial Fade Overlay - solid center fading to transparent edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle, rgb(var(--background-rgb)) 0%, rgba(var(--background-rgb), 0.95) 20%, rgba(var(--background-rgb), 0.7) 40%, transparent 70%)'
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Welcome back, {user.displayName?.split(' ')[0] || user.email || 'there'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Manage your MCP servers and API keys.
          </p>
        </div>

        <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {/* Get Started Card - always first with electric border effect */}
          <Link to="/onboarding" className="block">
            <ElectricBorder
              color="#f59e0b"
              speed={1}
              chaos={0.08}
              borderRadius={6}
              className="h-full"
            >
              <div className="flex h-full flex-col rounded-lg bg-card p-4 md:p-6">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 md:mb-3 md:h-10 md:w-10">
                  <Rocket className="h-4 w-4 text-amber-500 md:h-5 md:w-5" weight="fill" />
                </div>
                <h3 className="text-base font-semibold text-amber-500 md:text-lg">Get Started</h3>
                <p className="mt-1 text-xs text-muted-foreground md:mt-1.5 md:text-sm">
                  Learn how to deploy your first MCP server in minutes.
                </p>
              </div>
            </ElectricBorder>
          </Link>

          <Link to="/projects" className="block">
            <Card className="flex h-full flex-col border-border/50 transition-colors hover:border-border">
              <CardHeader className="flex-1 p-4 md:p-6">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 md:mb-3 md:h-10 md:w-10">
                  <FolderSimple className="h-4 w-4 text-primary md:h-5 md:w-5" />
                </div>
                <CardTitle className="text-base md:text-lg">Projects</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  View and manage your projects and deployed services.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/settings/api-keys" className="block">
            <Card className="flex h-full flex-col border-border/50 transition-colors hover:border-border">
              <CardHeader className="flex-1 p-4 md:p-6">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 md:mb-3 md:h-10 md:w-10">
                  <Robot className="h-4 w-4 text-primary md:h-5 md:w-5" />
                </div>
                <CardTitle className="text-base md:text-lg">Agent Keys</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Create and manage keys for programmatic access to your MCP servers.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/github" className="block">
            <Card className="flex h-full flex-col border-border/50 transition-colors hover:border-border">
              <CardHeader className="flex-1 p-4 md:p-6">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 md:mb-3 md:h-10 md:w-10">
                  <GithubLogo className="h-4 w-4 text-primary md:h-5 md:w-5" weight="fill" />
                </div>
                <CardTitle className="text-base md:text-lg">GitHub Access</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Manage GitHub app installation and repository permissions.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/dns" className="block">
            <Card className="flex h-full flex-col border-border/50 transition-colors hover:border-border">
              <CardHeader className="flex-1 p-4 md:p-6">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 md:mb-3 md:h-10 md:w-10">
                  <Globe className="h-4 w-4 text-primary md:h-5 md:w-5" />
                </div>
                <CardTitle className="text-base md:text-lg">DNS Delegation</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Delegate your domains to use custom URLs for your deployed MCP servers.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
