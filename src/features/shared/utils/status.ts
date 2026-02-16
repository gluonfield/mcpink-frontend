interface StatusStyle {
  className: string
  label: string
}

interface ServiceStatus {
  build: string
  runtime: string
}

export function getRuntimeStatusStyle(runtime: string): StatusStyle {
  const label = runtime.charAt(0).toUpperCase() + runtime.slice(1).toLowerCase()
  const statusLower = runtime.toLowerCase()

  switch (statusLower) {
    case 'deploying':
    case 'pending':
      return { className: 'bg-blue-500/15 text-blue-600', label }
    case 'running':
      return { className: 'bg-green-500/15 text-green-600', label }
    case 'stopped':
    case 'superseded':
      return { className: 'bg-muted text-muted-foreground', label }
    default:
      return { className: 'bg-muted text-muted-foreground', label }
  }
}

export function getBuildStatusStyle(build: string): StatusStyle {
  const label = build.charAt(0).toUpperCase() + build.slice(1).toLowerCase()
  const statusLower = build.toLowerCase()

  switch (statusLower) {
    case 'queued':
    case 'building':
      return { className: 'bg-blue-500/15 text-blue-600', label }
    case 'success':
      return { className: 'bg-green-500/15 text-green-600', label }
    case 'failed':
      return { className: 'bg-red-500/15 text-red-600', label }
    case 'cancelled':
    case 'none':
      return { className: 'bg-muted text-muted-foreground', label }
    default:
      return { className: 'bg-muted text-muted-foreground', label }
  }
}

export function getStatusStyle(status: ServiceStatus): StatusStyle {
  if (status.build === 'failed' || status.build === 'cancelled') {
    return getBuildStatusStyle(status.build)
  }
  return getRuntimeStatusStyle(status.runtime)
}
