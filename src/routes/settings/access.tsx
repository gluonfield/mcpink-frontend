import { useMutation, useQuery } from '@apollo/client'
import { ArrowsClockwise, CheckCircle, GithubLogo, Plus, Warning } from '@phosphor-icons/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ME_QUERY, RECHECK_GITHUB_APP_MUTATION } from '@/features/shared/graphql/operations'

const GITHUB_APP_SLUG = import.meta.env.VITE_GITHUB_APP_SLUG || 'ink-mcp'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081'

export const Route = createFileRoute('/settings/access')({
  component: AccessSettingsPage
})

const appPermissions = [
  {
    name: 'Code',
    reason: 'Read your repository files to build and deploy MCP servers',
    access: 'Read-only'
  },
  {
    name: 'Metadata',
    reason: 'List branches and commits to select what to deploy',
    access: 'Read-only'
  },
  {
    name: 'Pull Requests',
    reason: 'Create PRs with deployment configurations',
    access: 'Read & Write'
  },
  {
    name: 'Administration',
    reason: 'Read repository settings to configure deployments',
    access: 'Read-only'
  }
]

const oauthPermissions = [
  {
    name: 'Profile',
    reason: 'Display your username and avatar',
    access: 'read:user',
    granted: true
  },
  {
    name: 'Email',
    reason: 'Send deployment notifications',
    access: 'user:email',
    granted: true
  }
]

export default function AccessSettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const { data: meData, loading: queryLoading } = useQuery(ME_QUERY, { skip: !user })
  const [recheckMutation, { loading: recheckLoading }] = useMutation(RECHECK_GITHUB_APP_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
    awaitRefetchQueries: true
  })

  const pendingRevokeCheck = useRef(false)
  const previousInstallationId = useRef<string | null | undefined>(undefined)

  const loading = authLoading || queryLoading
  const githubAppInstallationId = meData?.me?.githubAppInstallationId
  const hasRepoScope = meData?.me?.githubScopes?.includes('repo') ?? false

  const recheckInstallation = useCallback(async () => {
    const previousId = previousInstallationId.current
    const result = await recheckMutation()
    const newId = result.data?.recheckGithubAppInstallation

    // Show toast based on status change
    if (previousId !== undefined) {
      if (previousId && !newId) {
        toast.success('GitHub App disconnected')
      } else if (!previousId && newId) {
        toast.success('GitHub App connected')
      } else {
        toast.success('Status updated')
      }
    }
  }, [recheckMutation])

  // Track installation ID changes for toast messages
  useEffect(() => {
    if (!loading) {
      previousInstallationId.current = githubAppInstallationId
    }
  }, [loading, githubAppInstallationId])

  // Handle revoke link click - set flag for auto-recheck on return
  const handleRevokeClick = () => {
    pendingRevokeCheck.current = true
  }

  // Auto-recheck when returning from GitHub after clicking revoke
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && pendingRevokeCheck.current) {
        pendingRevokeCheck.current = false
        void recheckInstallation()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [recheckInstallation])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Alert>
          <Warning className="h-4 w-4" />
          <AlertDescription>Please sign in to manage access settings.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Fixed background layer with dots */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--dot-color) 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle, rgb(var(--background-rgb)) 0%, rgba(var(--background-rgb), 0.95) 20%, rgba(var(--background-rgb), 0.7) 40%, transparent 70%)'
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Access Settings</h1>
          <p className="mt-1.5 text-muted-foreground">
            Manage GitHub permissions. We request only what&apos;s necessary.
          </p>
        </div>

        {/* GitHub App Section */}
        <Card
          className={`mb-6 ${githubAppInstallationId ? 'border-green-600/50' : 'border-yellow-500/50'}`}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center ${githubAppInstallationId ? 'bg-green-600/10' : 'bg-yellow-500/10'}`}
                >
                  <GithubLogo
                    className={`h-5 w-5 ${githubAppInstallationId ? 'text-green-600' : 'text-yellow-500'}`}
                    weight="fill"
                  />
                </div>
                <div>
                  <CardTitle className="text-base">GitHub App</CardTitle>
                  <CardDescription>Repository access for deployments</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {githubAppInstallationId ? (
                  <span className="flex items-center gap-1.5 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" weight="fill" />
                    Installed
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm text-yellow-500">
                    <Warning className="h-4 w-4" />
                    Not installed
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void recheckInstallation()}
                  disabled={recheckLoading}
                  className="h-7 px-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowsClockwise className={`h-4 w-4 ${recheckLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {appPermissions.map(p => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" weight="fill" />
                    <span className="font-medium">{p.name}</span>
                    <span className="text-muted-foreground">— {p.reason}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{p.access}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button size="sm" asChild>
                <a
                  href={`https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {githubAppInstallationId ? 'Manage Repositories' : 'Install App'}
                </a>
              </Button>
              {githubAppInstallationId && (
                <a
                  href={`https://github.com/settings/installations/${githubAppInstallationId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-red-500 hover:text-red-400"
                  onClick={handleRevokeClick}
                >
                  Revoke access
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* GitHub OAuth Section */}
        <Card className="border-green-600/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-green-600/10">
                  <GithubLogo className="h-5 w-5 text-green-600" weight="fill" />
                </div>
                <div>
                  <CardTitle className="text-base">GitHub OAuth</CardTitle>
                  <CardDescription>Account permissions for sign-in</CardDescription>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" weight="fill" />
                Connected
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {oauthPermissions.map(p => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" weight="fill" />
                    <span className="font-medium">{p.name}</span>
                    <span className="text-muted-foreground">— {p.reason}</span>
                  </div>
                  <code className="text-xs text-muted-foreground">{p.access}</code>
                </div>
              ))}

              {/* Repo scope - optional */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {hasRepoScope ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" weight="fill" />
                  ) : (
                    <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className="font-medium">Repository Creation</span>
                  <span className="text-muted-foreground">— Create repos on your behalf</span>
                </div>
                <code className="text-xs text-muted-foreground">repo</code>
              </div>
            </div>

            {!hasRepoScope && (
              <div className="rounded-md border border-dashed p-3">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Optional:</span> Grant repo access
                  to let AI agents create GitHub repositories for you automatically.
                </p>
                <Button size="sm" variant="outline" className="mt-3" asChild>
                  <a href={`${API_URL}/auth/github?scope=repo`}>Grant Repo Access</a>
                </Button>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={async () => {
                  window.open(
                    'https://github.com/settings/connections/applications/Ov23liozLB2AfgoxLPyU',
                    '_blank'
                  )
                  await signOut()
                  void navigate({ to: '/' })
                }}
                className="text-sm text-red-500 hover:text-red-400"
              >
                Revoke access
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
