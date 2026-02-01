import {
  CheckCircle,
  Clock,
  GitBranch,
  GithubLogo,
  Globe,
  Warning,
  XCircle
} from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useListAppsQuery } from '@/features/shared/graphql/graphql'

export const Route = createFileRoute('/apps/')({
  component: AppsPage
})

type BuildStatus = 'pending' | 'building' | 'success' | 'failed'
function getBuildStatusBadge(status: string): {
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  icon: React.ReactNode
  label: string
} {
  const statusLower = status.toLowerCase() as BuildStatus
  switch (statusLower) {
    case 'pending':
      return { variant: 'secondary', icon: <Clock className="mr-1 h-3 w-3" />, label: 'Pending' }
    case 'building':
      return { variant: 'outline', icon: <Spinner className="mr-1 h-3 w-3" />, label: 'Building' }
    case 'success':
      return { variant: 'default', icon: <CheckCircle className="mr-1 h-3 w-3" />, label: 'Built' }
    case 'failed':
      return { variant: 'destructive', icon: <XCircle className="mr-1 h-3 w-3" />, label: 'Failed' }
    default:
      return { variant: 'secondary', icon: null, label: status }
  }
}

function getRuntimeStatusBadge(status: string | null | undefined): {
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  icon: React.ReactNode
  label: string
} | null {
  if (!status) return null
  const statusLower = status.toLowerCase()
  switch (statusLower) {
    case 'running':
      return {
        variant: 'default',
        icon: <CheckCircle className="mr-1 h-3 w-3" />,
        label: 'Running'
      }
    case 'stopped':
      return { variant: 'secondary', icon: <Clock className="mr-1 h-3 w-3" />, label: 'Stopped' }
    case 'error':
      return { variant: 'destructive', icon: <Warning className="mr-1 h-3 w-3" />, label: 'Error' }
    default:
      return { variant: 'secondary', icon: null, label: status }
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

export default function AppsPage() {
  const { data, loading, error } = useListAppsQuery()

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Apps</h1>
        <p className="mt-1.5 text-muted-foreground">Your deployed MCP server applications.</p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading
            ? 'Loading...'
            : data?.listApps?.totalCount === 0
              ? 'No apps yet'
              : `${data?.listApps?.totalCount || 0} app${data?.listApps?.totalCount === 1 ? '' : 's'}`}
        </p>
      </div>

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
            const buildBadge = getBuildStatusBadge(app.buildStatus)
            const runtimeBadge = getRuntimeStatusBadge(app.runtimeStatus)
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
                      <Badge variant={buildBadge.variant} className="h-5 text-xs">
                        {buildBadge.icon}
                        {buildBadge.label}
                      </Badge>
                      {runtimeBadge && (
                        <Badge variant={runtimeBadge.variant} className="h-5 text-xs">
                          {runtimeBadge.icon}
                          {runtimeBadge.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 text-xs">
                    <GithubLogo className="h-3.5 w-3.5" />
                    {repoName}
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
                          href={`https://${app.fqdn}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate hover:text-foreground hover:underline"
                        >
                          {app.fqdn}
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
