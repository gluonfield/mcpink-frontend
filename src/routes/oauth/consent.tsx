import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/oauth/consent')({
  component: OAuthConsentPage
})

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081'

interface OAuthContext {
  client_id: string
  redirect_uri: string
  state: string
  user_id: string
  needs_onboarding?: boolean
}

export default function OAuthConsentPage() {
  const navigate = useNavigate()
  const [context, setContext] = useState<OAuthContext | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const response = await fetch(`${API_URL}/oauth/context`, {
          credentials: 'include'
        })

        if (!response.ok) {
          if (response.status === 401) {
            setError('Session expired. Please restart the authorization from your MCP client.')
          } else if (response.status === 400) {
            setError('No OAuth flow in progress. Please start from your MCP client.')
          } else {
            setError('Failed to load OAuth context')
          }
          return
        }

        const data = await response.json()

        // Check if returning from completed onboarding (oauth_completed flag)
        const oauthCompleted = sessionStorage.getItem('oauth_onboarding_completed')
        if (oauthCompleted) {
          // Clear the flag and show consent screen
          sessionStorage.removeItem('oauth_onboarding_completed')
          setContext(data)
          return
        }

        // Always redirect to onboarding for OAuth flow
        // This ensures all users see the welcome/setup flow with GitHub app options
        void navigate({ to: '/onboarding/welcome', search: { oauth: 'true' } })
        return
      } catch (err) {
        console.error('Failed to fetch OAuth context:', err)
        setError('Failed to load OAuth context')
      } finally {
        setLoading(false)
      }
    }

    fetchContext()
  }, [navigate])

  const handleAllow = async () => {
    if (!context) return

    setCompleting(true)
    try {
      const response = await fetch(`${API_URL}/oauth/complete`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key_name: `MCP Client (${context.client_id})`
        })
      })

      if (!response.ok) {
        setError('Failed to authorize. Please try again.')
        setCompleting(false)
        return
      }

      const data = await response.json()
      window.location.href = data.redirect_url
    } catch (err) {
      console.error('Failed to complete OAuth:', err)
      setError('Failed to authorize. Please try again.')
      setCompleting(false)
    }
  }

  const handleDeny = () => {
    if (!context) return

    const url = new URL(context.redirect_uri)
    url.searchParams.set('error', 'access_denied')
    if (context.state) {
      url.searchParams.set('state', context.state)
    }
    window.location.href = url.toString()
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authorization Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!context) {
    return null
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Authorize MCP Client</CardTitle>
          <CardDescription>
            <span className="font-medium text-foreground">{context.client_id}</span> wants to access
            your Mlink account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">This will allow the MCP client to:</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Deploy and manage applications
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Access deployment logs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Manage environment variables
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleDeny} disabled={completing}>
              Deny
            </Button>
            <Button className="flex-1" onClick={handleAllow} disabled={completing}>
              {completing ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Authorizing...
                </>
              ) : (
                'Allow'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
