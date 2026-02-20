interface StatusStyle {
  className: string
  label: string
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
    case 'stopped':
    case 'superseded':
      return { className: 'bg-muted text-muted-foreground', label }
    default:
      return { className: 'bg-muted text-muted-foreground', label }
  }
}
