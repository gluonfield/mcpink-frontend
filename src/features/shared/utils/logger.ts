export function logError(message: string, error: unknown): void {
  if (import.meta.env.DEV) {
    console.error(message, error)
  }
  // TODO: Send to error tracking service (e.g. Sentry) in production
}
