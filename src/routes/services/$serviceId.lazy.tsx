import {
  ArrowLeft,
  Clock,
  Cpu,
  GitBranch,
  GithubLogo,
  Globe,
  HardDrive,
  Warning
} from '@phosphor-icons/react'
import { createLazyFileRoute, Link, Navigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  type MetricTimeRange,
  useServiceDetailsQuery,
  useServiceMetricsQuery
} from '@/features/shared/graphql/graphql'
import { formatRelativeTime, formatRepoName } from '@/features/shared/utils/format'
import { getBuildStatusStyle, getRuntimeStatusStyle } from '@/features/shared/utils/status'

export const Route = createLazyFileRoute('/services/$serviceId')({
  component: ServiceDetailPage
})

function getRepoUrl(repo: string): string {
  if (repo.startsWith('http://') || repo.startsWith('https://')) {
    return repo.replace(/\.git$/, '')
  }
  return `https://github.com/${repo.replace(/\.git$/, '')}`
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes.toFixed(1)} B/s`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB/s`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB/s`
}

function formatTime(timestamp: string, timeRange: MetricTimeRange): string {
  const date = new Date(timestamp)
  if (timeRange === 'ONE_HOUR' || timeRange === 'SIX_HOURS') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const METRICS_POLL_INTERVAL_MS = 60_000

const TIME_RANGES: Array<{ value: MetricTimeRange; label: string }> = [
  { value: 'ONE_HOUR', label: '1H' },
  { value: 'SIX_HOURS', label: '6H' },
  { value: 'SEVEN_DAYS', label: '7D' },
  { value: 'THIRTY_DAYS', label: '30D' }
]

const cpuChartConfig: ChartConfig = {
  value: { label: 'CPU Usage', color: 'var(--chart-1)' }
}

const memoryChartConfig: ChartConfig = {
  value: { label: 'Memory (MB)', color: 'var(--chart-2)' }
}

const networkChartConfig: ChartConfig = {
  rx: { label: 'Receive', color: 'var(--chart-3)' },
  tx: { label: 'Transmit', color: 'var(--chart-4)' }
}

export default function ServiceDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const { serviceId } = Route.useParams()
  const [timeRange, setTimeRange] = useState<MetricTimeRange>('ONE_HOUR')

  const { data, loading, error } = useServiceDetailsQuery({
    variables: { id: serviceId }
  })

  const {
    data: metricsData,
    loading: metricsLoading,
    error: metricsError
  } = useServiceMetricsQuery({
    variables: { serviceId, timeRange },
    pollInterval: METRICS_POLL_INTERVAL_MS
  })

  const service = data?.serviceDetails

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
        <div className="flex justify-center py-12">
          <Spinner className="h-5 w-5 md:h-6 md:w-6" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" />
  }

  if (error || !service) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
        <Link
          to="/projects"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Projects
        </Link>
        <div className="flex flex-col items-center justify-center py-12 text-center md:py-16">
          <Warning className="mb-3 h-6 w-6 text-destructive md:mb-4 md:h-8 md:w-8" />
          <p className="text-sm text-muted-foreground md:text-base">
            {error ? 'Failed to load service' : 'Service not found'}
          </p>
          {error && (
            <p className="mt-1 text-xs text-muted-foreground/70 md:text-sm">{error.message}</p>
          )}
        </div>
      </div>
    )
  }

  const status = service.status ?? { build: 'none', runtime: 'pending' }
  const buildStyle = getBuildStatusStyle(status.build)
  const runtimeStyle = getRuntimeStatusStyle(status.runtime)
  const repoName = formatRepoName(service.repo)
  const metrics = metricsData?.serviceMetrics

  const cpuData =
    metrics?.cpuUsage.dataPoints.map(dp => ({
      timestamp: dp.timestamp,
      value: dp.value
    })) ?? []

  const memoryData =
    metrics?.memoryUsageMB.dataPoints.map(dp => ({
      timestamp: dp.timestamp,
      value: dp.value
    })) ?? []

  const networkData =
    metrics?.networkReceiveBytesPerSec.dataPoints.map((dp, i) => ({
      timestamp: dp.timestamp,
      rx: dp.value,
      tx: metrics.networkTransmitBytesPerSec.dataPoints[i]?.value ?? 0
    })) ?? []

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
      <Link
        to="/projects"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Projects
      </Link>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 md:mb-8">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
          {service.name || repoName.split('/').pop() || 'Unnamed Service'}
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${runtimeStyle.className}`}>
            {runtimeStyle.label}
          </span>
          <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${buildStyle.className}`}>
            Build: {buildStyle.label}
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {service.errorMessage && (
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <Warning className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{service.errorMessage}</span>
        </div>
      )}

      {/* Info Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="p-4 pb-2 md:p-6 md:pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deployment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0 md:p-6 md:pt-0">
            {service.fqdn && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                <a
                  href={service.fqdn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:text-foreground hover:underline"
                >
                  {service.fqdn.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <GithubLogo className="h-4 w-4 shrink-0 text-muted-foreground" />
              {service.gitProvider === 'internal' ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-default truncate decoration-muted-foreground/50 decoration-dashed underline-offset-4 hover:underline">
                        {repoName}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-64">
                      This repo is managed by Ink. Connect your GitHub account to store code in your
                      own private repositories.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <a
                  href={getRepoUrl(service.repo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:text-foreground hover:underline"
                >
                  {repoName}
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <GitBranch className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{service.branch}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" />
              <span>Deployed {formatRelativeTime(service.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="p-4 pb-2 md:p-6 md:pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0 md:p-6 md:pt-0">
            <div className="flex items-center gap-2 text-sm">
              <HardDrive className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>Memory: {service.memory}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Cpu className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>vCPUs: {service.vcpus}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Metrics</h2>
          <div className="flex gap-1">
            {TIME_RANGES.map(tr => (
              <Button
                key={tr.value}
                variant={timeRange === tr.value ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(tr.value)}
                className="h-7 px-2.5 text-xs"
              >
                {tr.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {/* CPU Chart */}
          <Card className="border-border/50">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">CPU Usage</CardTitle>
            </CardHeader>
            <CardContent className="relative p-4 pt-0">
              {metricsLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60">
                  <Spinner className="h-5 w-5" />
                </div>
              )}
              {metricsError && cpuData.length === 0 ? (
                <div className="flex aspect-[3/1] items-center justify-center">
                  <p className="text-sm text-muted-foreground">Metrics unavailable</p>
                </div>
              ) : (
                <ChartContainer config={cpuChartConfig} className="aspect-[3/1] w-full">
                  <AreaChart data={cpuData}>
                    <defs>
                      <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={v => formatTime(v, timeRange)}
                      minTickGap={120}
                      tickLine={false}
                      axisLine={false}
                      fontSize={10}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={10}
                      tickMargin={4}
                      tickFormatter={v => `${v.toFixed(2)} vCPU`}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(_, payload) => {
                            const item = payload[0]
                            if (!item) return ''
                            const p = item.payload as { timestamp: string }
                            return new Date(p.timestamp).toLocaleString()
                          }}
                          formatter={value => [`${Number(value).toFixed(3)} vCPUs`, 'CPU']}
                        />
                      }
                    />
                    {metrics?.cpuLimitVCPUs && (
                      <ReferenceLine
                        y={metrics.cpuLimitVCPUs}
                        stroke="var(--chart-1)"
                        strokeDasharray="4 4"
                        strokeOpacity={0.5}
                      />
                    )}
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--chart-1)"
                      fill="url(#cpuGradient)"
                      strokeWidth={1.5}
                      animationDuration={300}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Memory Chart */}
          <Card className="border-border/50">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Memory</CardTitle>
            </CardHeader>
            <CardContent className="relative p-4 pt-0">
              {metricsLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60">
                  <Spinner className="h-5 w-5" />
                </div>
              )}
              {metricsError && memoryData.length === 0 ? (
                <div className="flex aspect-[3/1] items-center justify-center">
                  <p className="text-sm text-muted-foreground">Metrics unavailable</p>
                </div>
              ) : (
                <ChartContainer config={memoryChartConfig} className="aspect-[3/1] w-full">
                  <AreaChart data={memoryData}>
                    <defs>
                      <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={v => formatTime(v, timeRange)}
                      minTickGap={120}
                      tickLine={false}
                      axisLine={false}
                      fontSize={10}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={10}
                      tickMargin={4}
                      tickFormatter={v => `${v} MB`}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(_, payload) => {
                            const item = payload[0]
                            if (!item) return ''
                            const p = item.payload as { timestamp: string }
                            return new Date(p.timestamp).toLocaleString()
                          }}
                          formatter={value => [`${Number(value).toFixed(1)} MB`, 'Memory']}
                        />
                      }
                    />
                    {metrics?.memoryLimitMB && (
                      <ReferenceLine
                        y={metrics.memoryLimitMB}
                        stroke="var(--chart-2)"
                        strokeDasharray="4 4"
                        strokeOpacity={0.5}
                      />
                    )}
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--chart-2)"
                      fill="url(#memGradient)"
                      strokeWidth={1.5}
                      animationDuration={300}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Network I/O Chart */}
          <Card className="border-border/50">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Network I/O
              </CardTitle>
            </CardHeader>
            <CardContent className="relative p-4 pt-0">
              {metricsLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60">
                  <Spinner className="h-5 w-5" />
                </div>
              )}
              {metricsError && networkData.length === 0 ? (
                <div className="flex aspect-[3/1] items-center justify-center">
                  <p className="text-sm text-muted-foreground">Metrics unavailable</p>
                </div>
              ) : (
                <ChartContainer config={networkChartConfig} className="aspect-[3/1] w-full">
                  <AreaChart data={networkData}>
                    <defs>
                      <linearGradient id="rxGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-rx)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--color-rx)" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-tx)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--color-tx)" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={v => formatTime(v, timeRange)}
                      minTickGap={120}
                      tickLine={false}
                      axisLine={false}
                      fontSize={10}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={10}
                      tickMargin={4}
                      tickFormatter={v => formatBytes(v)}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(_, payload) => {
                            const item = payload[0]
                            if (!item) return ''
                            const p = item.payload as { timestamp: string }
                            return new Date(p.timestamp).toLocaleString()
                          }}
                          formatter={(value, name) => [
                            formatBytes(Number(value)),
                            name === 'rx' ? 'Receive' : 'Transmit'
                          ]}
                        />
                      }
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area
                      type="monotone"
                      dataKey="rx"
                      name="rx"
                      stroke="var(--color-rx)"
                      fill="url(#rxGradient)"
                      strokeWidth={1.5}
                      animationDuration={300}
                    />
                    <Area
                      type="monotone"
                      dataKey="tx"
                      name="tx"
                      stroke="var(--color-tx)"
                      fill="url(#txGradient)"
                      strokeWidth={1.5}
                      animationDuration={300}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
