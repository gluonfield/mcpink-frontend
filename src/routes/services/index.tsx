import { GitBranch, GithubLogo, Globe, Warning } from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { useListServicesQuery } from '@/features/shared/graphql/graphql'

export const Route = createFileRoute('/services/')({
  component: ServicesPage
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

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`
}

function formatRepoName(repo: string): string {
  return repo.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '')
}

export default function ServicesPage() {
  const { data, loading, error } = useListServicesQuery()
  const [selectedProject, setSelectedProject] = useState('default')

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex items-start justify-between gap-4 md:mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground md:mt-1.5 md:text-base">
            Your deployed MCP server applications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Project</span>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[140px]" size="sm">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!loading && (data?.listServices?.totalCount ?? 0) > 1 && (
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <p className="text-xs text-muted-foreground md:text-sm">
            {data?.listServices?.totalCount} services
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-5 w-5 md:h-6 md:w-6" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center md:py-16">
          <Warning className="mb-3 h-6 w-6 text-destructive md:mb-4 md:h-8 md:w-8" />
          <p className="text-sm text-muted-foreground md:text-base">Failed to load services</p>
          <p className="mt-1 text-xs text-muted-foreground/70 md:text-sm">{error.message}</p>
        </div>
      ) : data?.listServices?.nodes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center md:py-16">
          <p className="text-sm text-muted-foreground md:text-base">No services yet</p>
          <p className="mt-1 text-xs text-muted-foreground/70 md:text-sm">
            Deploy your first MCP server to get started
          </p>
          <Button className="mt-4" size="sm" asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {data?.listServices?.nodes?.map(service => {
            const buildStyle = getBuildStatusStyle(service.buildStatus)
            const runtimeStyle = getRuntimeStatusStyle(service.runtimeStatus)
            const repoName = formatRepoName(service.repo)

            return (
              <Link
                key={service.id}
                to="/services/$serviceId"
                params={{ serviceId: service.id }}
                className="block"
              >
                <Card className="group border-border/50 transition-colors hover:border-border">
                  <CardHeader className="p-4 pb-2 md:p-6 md:pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-medium md:text-base">
                        {service.name || repoName.split('/').pop() || 'Unnamed Service'}
                      </CardTitle>
                      <div className="flex shrink-0 gap-1">
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium md:px-2 md:text-xs ${buildStyle.className}`}
                        >
                          {buildStyle.label}
                        </span>
                        {runtimeStyle && (
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium md:px-2 md:text-xs ${runtimeStyle.className}`}
                          >
                            {runtimeStyle.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-[11px] md:text-xs">
                      <span className="inline-flex items-center gap-1 md:gap-1.5">
                        <GithubLogo className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        {repoName}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                    <div className="space-y-1.5 text-xs text-muted-foreground md:space-y-2 md:text-sm">
                      <div className="flex items-center gap-1 md:gap-1.5">
                        <GitBranch className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        <span>{service.branch}</span>
                      </div>
                      {service.fqdn && (
                        <div className="flex items-center gap-1 md:gap-1.5">
                          <Globe className="h-3 w-3 md:h-3.5 md:w-3.5" />
                          <span className="truncate">
                            {service.fqdn.replace(/^https?:\/\//, '')}
                          </span>
                        </div>
                      )}
                      {service.errorMessage && (
                        <div className="flex items-start gap-1 text-destructive md:gap-1.5">
                          <Warning className="mt-0.5 h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" />
                          <span className="line-clamp-2 text-[10px] md:text-xs">
                            {service.errorMessage}
                          </span>
                        </div>
                      )}
                      <div className="pt-1.5 text-[10px] text-muted-foreground/70 md:pt-2 md:text-xs">
                        Deployed {formatRelativeTime(service.updatedAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
