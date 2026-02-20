interface StatusStyle {
  className: string
  label: string
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'running':
    case 'active':
      return 'bg-green-500'
    case 'deploying':
    case 'pending':
    case 'building':
    case 'queued':
      return 'bg-blue-500'
    case 'failed':
    case 'cancelled':
      return 'bg-red-500'
    default:
      return 'bg-zinc-400'
  }
}

export function getStatusStyle(status: string): StatusStyle {
  const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  const statusLower = status.toLowerCase()

  switch (statusLower) {
    case 'running':
    case 'active':
      return { className: 'bg-green-500/15 text-green-600', label }
    case 'deploying':
    case 'pending':
    case 'building':
    case 'queued':
      return { className: 'bg-blue-500/15 text-blue-600', label }
    case 'failed':
    case 'cancelled':
      return { className: 'bg-red-500/15 text-red-600', label }
    default:
      return { className: 'bg-muted text-muted-foreground', label }
  }
}
