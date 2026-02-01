import { GitBranch, GithubLogo, Globe, Warning } from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useListAppsQuery } from '@/features/shared/graphql/graphql'

export const Route = createFileRoute('/apps/')({
  component: AppsPage
})

type BuildStatus = 'pending' | 'building' | 'success' | 'failed'

function getBuildStatusStyle(status: string): { className: string; label: string } {
  const statusLower = status.toLowerCase() as BuildStatus
  switch (statusLower) {
    case 'pending':
      return {
        className: 'bg-muted text-muted-foreground',
        label: 'Pending'
      }
    case 'building':
      return {
        className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
        label: 'Building'
      }
    case 'success':
      return {
        className: 'bg-green-500/15 text-green-600 dark:text-green-400',
        label: 'Built'
      }
    case 'failed':
      return {
        className: 'bg-red-500/15 text-red-600 dark:text-red-400',
        label: 'Failed'
      }
    default:
      return { className: 'bg-muted text-muted-foreground', label: status }
  }
}

function getRuntimeStatusStyle(status: string | null | undefined): {
  className: string
  label: string
} | null {
  if (!status) return null
  const statusLower = status.toLowerCase()
  switch (statusLower) {
    case 'running':
      return {
        className: 'bg-green-500/15 text-green-600 dark:text-green-400',
        label: 'Running'
      }
    case 'stopped':
      return {
        className: 'bg-muted text-muted-foreground',
        label: 'Stopped'
      }
    case 'error':
      return {
        className: 'bg-red-500/15 text-red-600 dark:text-red-400',
        label: 'Error'
      }
    default:
      return { className: 'bg-muted text-muted-foreground', label: status }
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatRepoName(repo: string): string {
  // Remove github.com/ prefix if present
  return repo.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '')
}

function getRepoUrl(repo: string): string {
  // If it's already a full URL, return it
  if (repo.startsWith('http://') || repo.startsWith('https://')) {
    return repo.replace(/\.git$/, '')
  }
  // Otherwise, construct the GitHub URL
  return `https://github.com/${repo.replace(/\.git$/, '')}`
}

export default function AppsPage() {
  const { data, loading, error } = useListAppsQuery()

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Apps</h1>
        <p className="mt-1.5 text-muted-foreground">Your deployed MCP server applications.</p>
      </div>

      {!loading && (data?.listApps?.totalCount ?? 0) > 1 && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{data?.listApps?.totalCount} apps</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Warning className="mb-4 h-8 w-8 text-destructive" />
          <p className="text-muted-foreground">Failed to load apps</p>
          <p className="mt-1 text-sm text-muted-foreground/70">{error.message}</p>
        </div>
      ) : data?.listApps?.nodes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">No apps yet</p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Deploy your first MCP server to get started
          </p>
          <Button className="mt-4" asChild>
            <Link to="/">Go to Dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.listApps?.nodes?.map(app => {
            const buildStyle = getBuildStatusStyle(app.buildStatus)
            const runtimeStyle = getRuntimeStatusStyle(app.runtimeStatus)
            const repoName = formatRepoName(app.repo)

            return (
              <Card
                key={app.id}
                className="group border-border/50 transition-colors hover:border-border"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-medium">
                      {app.name || repoName.split('/').pop() || 'Unnamed App'}
                    </CardTitle>
                    <div className="flex gap-1.5">
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${buildStyle.className}`}
                      >
                        {buildStyle.label}
                      </span>
                      {runtimeStyle && (
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-medium ${runtimeStyle.className}`}
                        >
                          {runtimeStyle.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-xs">
                    <a
                      href={getRepoUrl(app.repo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-foreground hover:underline"
                    >
                      <GithubLogo className="h-3.5 w-3.5" />
                      {repoName}
                    </a>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <GitBranch className="h-3.5 w-3.5" />
                      <span>{app.branch}</span>
                    </div>
                    {app.fqdn && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" />
                        <a
                          href={app.fqdn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate hover:text-foreground hover:underline"
                        >
                          {app.fqdn.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    {app.errorMessage && (
                      <div className="flex items-start gap-1.5 text-destructive">
                        <Warning className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-2 text-xs">{app.errorMessage}</span>
                      </div>
                    )}
                    <div className="pt-2 text-xs text-muted-foreground/70">
                      Created {formatDate(app.createdAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
