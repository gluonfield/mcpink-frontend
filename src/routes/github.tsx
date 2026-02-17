import { useMutation, useQuery } from '@apollo/client'
import { ArrowsClockwise, CheckCircle, GithubLogo, Plus, Warning } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ME_QUERY, RECHECK_GITHUB_APP_MUTATION } from '@/features/shared/graphql/operations'

const GITHUB_APP_SLUG = import.meta.env.VITE_GITHUB_APP_SLUG || 'ink-mcp'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081'

export const Route = createFileRoute('/github')({
  component: GitHubAccessSettingsPage
})

const appPermissions = [
  {
    name: 'Code',
    reason: 'Pull your source code to build and deploy your MCP servers',
    access: 'Read-only'
  },
  {
    name: 'Metadata',
    reason: 'List branches and commits so you can choose what to deploy',
    access: 'Read-only'
  },
  {
    name: 'Pull Requests',
    reason: 'Open PRs with deployment configurations when needed',
    access: 'Read & Write'
  },
  {
    name: 'Webhooks',
    reason: 'Trigger automatic redeployments when you push new code',
    access: 'Read & Write'
  }
]

async function getFirebaseToken(): Promise<string | null> {
  const { firebaseAuth } = await import('@/features/auth/lib/firebase')
  const user = firebaseAuth.currentUser
  if (!user) return null
  return user.getIdToken()
}

async function connectGitHub(scope?: string): Promise<void> {
  const token = await getFirebaseToken()
  if (!token) return

  const body: Record<string, string> = {}
  if (scope) body.scope = scope

  const response = await fetch(`${API_URL}/auth/github/connect`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (response.ok) {
    const data = await response.json()
    if (data.url) {
      window.location.href = data.url
    }
  }
}

export default function GitHubAccessSettingsPage() {
  const { user, loading: authLoading } = useAuth()
  const { data: meData, loading: queryLoading } = useQuery(ME_QUERY, { skip: !user })
  const [recheckMutation, { loading: recheckLoading }] = useMutation(RECHECK_GITHUB_APP_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
    awaitRefetchQueries: true
  })
  const [connecting, setConnecting] = useState(false)

  const pendingRevokeCheck = useRef(false)
  const previousInstallationId = useRef<string | null | undefined>(undefined)

  const loading = authLoading || queryLoading
  const githubAppInstallationId = meData?.me?.githubAppInstallationId
  const githubUsername = meData?.me?.githubUsername
  const hasRepoScope = meData?.me?.githubScopes?.includes('repo') ?? false

  const recheckInstallation = useCallback(async () => {
    const previousId = previousInstallationId.current
    const result = await recheckMutation()
    const newId = result.data?.recheckGithubAppInstallation

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

  useEffect(() => {
    if (!loading) {
      previousInstallationId.current = githubAppInstallationId
    }
  }, [loading, githubAppInstallationId])

  const handleRevokeClick = () => {
    pendingRevokeCheck.current = true
  }

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
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <Alert>
          <Warning className="h-4 w-4" />
          <AlertDescription>Please sign in to manage access settings.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
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

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 md:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">GitHub Access Settings</h1>
          <p className="mt-1.5 text-muted-foreground">
            Manage GitHub permissions. We request only what&apos;s necessary.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            GitHub access is optional. By default, your code is stored in Ink&apos;s internal git.
            Connecting GitHub lets agents store and manage code directly in your own repositories.
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
                  <CardDescription>
                    Pulls code from your repositories to build and deploy, and triggers webhooks for
                    automatic redeployments on push
                  </CardDescription>
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
                    <span className="text-muted-foreground">&mdash; {p.reason}</span>
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

        {/* GitHub Connect Section */}
        <Card className={githubUsername ? 'border-green-600/50' : 'border-border'}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center ${githubUsername ? 'bg-green-600/10' : 'bg-muted'}`}
                >
                  <GithubLogo
                    className={`h-5 w-5 ${githubUsername ? 'text-green-600' : 'text-muted-foreground'}`}
                    weight="fill"
                  />
                </div>
                <div>
                  <CardTitle className="text-base">GitHub Account</CardTitle>
                  <CardDescription>
                    Lets agents create new GitHub repositories on your behalf automatically
                  </CardDescription>
                </div>
              </div>
              {githubUsername ? (
                <span className="flex items-center gap-1.5 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" weight="fill" />
                  Connected as @{githubUsername}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Not connected</span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {githubUsername ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" weight="fill" />
                      <span className="font-medium">Profile</span>
                      <span className="text-muted-foreground">
                        &mdash; Identify your account
                      </span>
                    </div>
                    <code className="text-xs text-muted-foreground">read:user</code>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" weight="fill" />
                      <span className="font-medium">Email</span>
                      <span className="text-muted-foreground">
                        &mdash; Send you deployment notifications
                      </span>
                    </div>
                    <code className="text-xs text-muted-foreground">user:email</code>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {hasRepoScope ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-600" weight="fill" />
                      ) : (
                        <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <span className="font-medium">Repository Creation</span>
                      <span className="text-muted-foreground">
                        &mdash; Create new GitHub repos automatically
                      </span>
                    </div>
                    <code className="text-xs text-muted-foreground">repo</code>
                  </div>
                </div>

                {!hasRepoScope && (
                  <div className="rounded-md border border-dashed p-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Optional:</span> Grant
                      repository access so agents can create new GitHub repos on your behalf instead
                      of using Ink&apos;s internal git.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      disabled={connecting}
                      onClick={async () => {
                        setConnecting(true)
                        await connectGitHub('repo')
                      }}
                    >
                      Grant Repo Access
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-md border border-dashed p-3">
                <p className="text-sm text-muted-foreground">
                  Connect your GitHub account so agents can create new repositories on your behalf
                  automatically.
                </p>
                <Button
                  size="sm"
                  className="mt-3"
                  disabled={connecting}
                  onClick={async () => {
                    setConnecting(true)
                    await connectGitHub()
                  }}
                >
                  <GithubLogo className="mr-2 h-4 w-4" weight="fill" />
                  Connect GitHub
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
