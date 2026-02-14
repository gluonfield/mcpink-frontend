interface StatusStyle {
  className: string
  label: string
}

export function getStatusStyle(status: string): StatusStyle {
  const statusLower = status.toLowerCase()
  switch (statusLower) {
    case 'pending':
      return { className: 'bg-muted text-muted-foreground', label: 'Pending' }
    case 'building':
      return { className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400', label: 'Building' }
    case 'running':
      return { className: 'bg-green-500/15 text-green-600 dark:text-green-400', label: 'Running' }
    case 'stopped':
      return { className: 'bg-muted text-muted-foreground', label: 'Stopped' }
    case 'failed':
    case 'error':
      return { className: 'bg-red-500/15 text-red-600 dark:text-red-400', label: 'Failed' }
    case 'success':
      return { className: 'bg-green-500/15 text-green-600 dark:text-green-400', label: 'Success' }
    default:
      return { className: 'bg-muted text-muted-foreground', label: status }
  }
}
