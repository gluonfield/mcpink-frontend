interface StatusStyle {
  className: string
  label: string
}

export function getStatusStyle(status: string): StatusStyle {
  const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  const statusLower = status.toLowerCase()

  switch (statusLower) {
    case 'building':
    case 'pending':
      return { className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400', label }
    case 'running':
    case 'success':
      return { className: 'bg-green-500/15 text-green-600 dark:text-green-400', label }
    case 'failed':
    case 'error':
      return { className: 'bg-red-500/15 text-red-600 dark:text-red-400', label }
    case 'stopped':
    default:
      return { className: 'bg-muted text-muted-foreground', label }
  }
}
