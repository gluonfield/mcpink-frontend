import { FolderSimple, Warning } from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useListProjectsAndServicesQuery } from '@/features/shared/graphql/graphql'

export const Route = createFileRoute('/projects/')({
  component: ProjectsPage
})

interface StatusCounts {
  running: number
  stopped: number
  failed: number
  building: number
  total: number
}

function getStatusCounts(apps: ReadonlyArray<{ status: string }>): StatusCounts {
  let running = 0
  let stopped = 0
  let failed = 0
  let building = 0

  for (const a of apps) {
    const status = a.status.toLowerCase()

    if (status === 'failed' || status === 'cancelled') {
      failed++
    } else if (status === 'building' || status === 'queued' || status === 'deploying') {
      building++
    } else if (status === 'running' || status === 'active') {
      running++
    } else if (status === 'stopped' || status === 'superseded') {
      stopped++
    } else {
      building++
    }
  }

  return { running, stopped, failed, building, total: apps.length }
}

function formatStatusTooltip(counts: StatusCounts): string {
  const parts: string[] = []
  if (counts.running > 0) parts.push(`${counts.running} Running`)
  if (counts.stopped > 0) parts.push(`${counts.stopped} Stopped`)
  if (counts.failed > 0) parts.push(`${counts.failed} Failed`)
  if (counts.building > 0) parts.push(`${counts.building} Building`)
  return parts.join(' · ')
}

const STATUS_COLORS = {
  running: 'bg-green-500',
  building: 'bg-blue-500',
  stopped: 'bg-zinc-400',
  failed: 'bg-red-500'
} as const

function StatusBar({ counts }: { counts: StatusCounts }) {
  if (counts.total === 0) return null

  const segments: Array<{ key: string; count: number; color: string }> = [
    { key: 'running', count: counts.running, color: STATUS_COLORS.running },
    { key: 'building', count: counts.building, color: STATUS_COLORS.building },
    { key: 'stopped', count: counts.stopped, color: STATUS_COLORS.stopped },
    { key: 'failed', count: counts.failed, color: STATUS_COLORS.failed }
  ].filter(s => s.count > 0)

  return (
    <div className="mt-3 flex h-2.5 w-full overflow-hidden bg-muted">
      {segments.map(segment => (
        <div
          key={segment.key}
          className={`${segment.color} transition-all`}
          style={{ width: `${(segment.count / counts.total) * 100}%` }}
        />
      ))}
    </div>
  )
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const { data, loading, error } = useListProjectsAndServicesQuery({ skip: !user })

  return (
    <TooltipProvider delayDuration={300}>
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground md:mt-1.5 md:text-base">
            Your projects and deployed services.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
            <Spinner className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        ) : error ? (
          <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center text-center">
            <Warning className="mb-3 h-6 w-6 text-destructive md:mb-4 md:h-8 md:w-8" />
            <p className="text-sm text-muted-foreground md:text-base">Failed to load projects</p>
            <p className="mt-1 text-xs text-muted-foreground/70 md:text-sm">{error.message}</p>
          </div>
        ) : data?.listProjects?.nodes?.length === 0 ? (
          <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground md:text-base">
              Deploy your first MCP server to get started
            </p>
            <Button className="mt-4" size="sm" asChild>
              <Link to="/onboarding">Get Started</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {data?.listProjects?.nodes?.map(project => {
              const services = project.services ?? []
              const counts = getStatusCounts(services)
              const tooltipText = formatStatusTooltip(counts)

              return (
                <Link
                  key={project.id}
                  to="/projects/$projectId"
                  params={{ projectId: project.id }}
                  className="block"
                >
                  <Card className="flex h-full flex-col border-border/50 transition-colors hover:border-purple-400/40">
                    <CardHeader className="flex-1 p-4 md:p-6">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 md:mb-3 md:h-10 md:w-10">
                        <FolderSimple className="h-4 w-4 text-primary md:h-5 md:w-5" />
                      </div>
                      <CardTitle className="text-base md:text-lg">{project.name}</CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        {services.length} {services.length === 1 ? 'service' : 'services'}
                      </CardDescription>
                      {tooltipText ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <StatusBar counts={counts} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>{tooltipText}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <StatusBar counts={counts} />
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
