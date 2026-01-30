import { ArrowRight, Key } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

import PixelTrail from '@/components/animations/PixelTrail'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import LoginPanel from '@/features/auth/components/LoginPanel'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const Route = createFileRoute('/')({
  component: HomePage
})

function HomePage() {
  const { user, loading } = useAuth()

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
      {/* Radial gradient overlay - fades dots in center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle, rgb(var(--background-rgb)) 0%, rgba(var(--background-rgb), 0.95) 20%, rgba(var(--background-rgb), 0.7) 40%, transparent 70%)'
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back, @{user.githubUsername}
          </h1>
          <p className="mt-2 text-muted-foreground">Manage your MCP servers and API keys.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="group border-border/50 transition-colors hover:border-border">
            <CardHeader>
              <div className="mb-3 flex h-10 w-10 items-center justify-center bg-primary/10">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="flex items-center justify-between text-base">
                API Keys
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </CardTitle>
              <CardDescription>
                Create and manage API keys for programmatic access to your MCP servers.
              </CardDescription>
            </CardHeader>
            <Button variant="ghost" size="sm" className="mx-6 mb-6 w-fit" asChild>
              <Link to="/settings/api-keys">Manage Keys</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
