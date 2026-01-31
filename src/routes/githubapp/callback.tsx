import { useApolloClient } from '@apollo/client'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/githubapp/callback')({
  component: GitHubAppCallbackPage
})

export default function GitHubAppCallbackPage() {
  const navigate = useNavigate()
  const apolloClient = useApolloClient()

  useEffect(() => {
    // Clear any cached data so the app re-fetches installation status
    void apolloClient.resetStore()

    // Redirect to home after a short delay
    const timeout = setTimeout(() => {
      void navigate({ to: '/' })
    }, 1500)

    return () => clearTimeout(timeout)
  }, [navigate, apolloClient])

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4">
      <Spinner className="h-8 w-8" />
      <div className="text-center">
        <h1 className="text-lg font-medium">GitHub App Connected</h1>
        <p className="mt-1 text-muted-foreground">Redirecting you back to the dashboard...</p>
      </div>
    </div>
  )
}
