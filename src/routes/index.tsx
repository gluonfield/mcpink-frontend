import { useQuery } from '@apollo/client'
import { Cube, GithubLogo, Robot, Rocket } from '@phosphor-icons/react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Suspense, useEffect } from 'react'

import PixelTrail from '@/components/animations/PixelTrail'
import ElectricBorder from '@/components/ElectricBorder'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import LoginPanel from '@/features/auth/components/LoginPanel'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { clearOnboardingState, getStoredOnboardingStep } from '@/features/onboarding'
import { ME_QUERY, MY_API_KEYS_QUERY } from '@/features/shared/graphql/operations'

const GITHUB_APP_SLUG = 'ink-mcp'

export const Route = createFileRoute('/')({
  component: HomePage
})

function HomePage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { data: meData, loading: meLoading } = useQuery(ME_QUERY, { skip: !user })
  const { data: apiKeysData, loading: keysLoading } = useQuery(MY_API_KEYS_QUERY, { skip: !user })

  const githubAppInstallationId = meData?.me?.githubAppInstallationId
  const hasApiKeys = (apiKeysData?.myAPIKeys?.length ?? 0) > 0
  const loading = authLoading || (user && (meLoading || keysLoading))

  useEffect(() => {
    if (authLoading || !user || meLoading || keysLoading) return

    const hasGithubApp = !!githubAppInstallationId
    const storedStep = getStoredOnboardingStep()

    // User has completed onboarding - clear any stored state
    if (hasGithubApp && hasApiKeys) {
      if (storedStep) {
        clearOnboardingState()
      }
      return
    }

    // User needs onboarding
    if (storedStep || (!hasGithubApp && !hasApiKeys)) {
      void navigate({ to: '/onboarding' })
    }
  }, [authLoading, user, meLoading, keysLoading, githubAppInstallationId, hasApiKeys, navigate])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <LoginPanel />
        {/* Pixel Trail Layer - Above dim, below content, hidden on mobile */}
        <div className="fixed inset-0 z-[1] hidden md:block">
          <Suspense fallback={null}>
            <PixelTrail
              gridSize={60}
              trailSize={0.15}
              maxAge={300}
              interpolate={8}
              color="#f59e0b"
              gooeyFilter={{ id: 'pixel-goo', strength: 3 }}
            />
          </Suspense>
        </div>
      </>
    )
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

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back, @{user.githubUsername}
          </h1>
          <p className="mt-2 text-muted-foreground">Manage your MCP servers and API keys.</p>
        </div>

        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Get Started Card - always first with electric border effect */}
          <Link to="/onboarding" className="block">
            <ElectricBorder
              color="#f59e0b"
              speed={1}
              chaos={0.08}
              borderRadius={12}
              className="h-full"
            >
              <div className="flex h-full flex-col rounded-xl bg-card p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                  <Rocket className="h-5 w-5 text-amber-500" weight="fill" />
                </div>
                <h3 className="text-lg font-semibold text-amber-500">Get Started</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Learn how to deploy your first MCP server in minutes.
                </p>
              </div>
            </ElectricBorder>
          </Link>

          {/* Connect GitHub Card - shown when app is not installed */}
          {!githubAppInstallationId && (
            <a
              href={`https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="flex h-full flex-col border-primary/50 bg-primary/5 transition-colors hover:border-primary">
                <CardHeader className="flex-1">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center bg-primary/10">
                    <GithubLogo className="h-5 w-5 text-primary" weight="fill" />
                  </div>
                  <CardTitle className="text-lg">Connect GitHub</CardTitle>
                  <CardDescription>
                    Install the GitHub App to deploy MCP servers directly from your repositories.
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>
          )}

          <Link to="/apps" className="block">
            <Card className="flex h-full flex-col border-border/50 transition-colors hover:border-border">
              <CardHeader className="flex-1">
                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-primary/10">
                  <Cube className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Apps</CardTitle>
                <CardDescription>
                  View and manage your deployed MCP server applications.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/settings/api-keys" className="block">
            <Card className="flex h-full flex-col border-border/50 transition-colors hover:border-border">
              <CardHeader className="flex-1">
                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-primary/10">
                  <Robot className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Agent Keys</CardTitle>
                <CardDescription>
                  Create and manage keys for programmatic access to your MCP servers.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
