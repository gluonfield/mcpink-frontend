import { useMutation, useQuery } from '@apollo/client'
import { CheckCircle, Info, PaperPlaneTilt, Trash } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import {
  ME_QUERY,
  REMOVE_DEPLOYMENT_PROVIDER_MUTATION,
  UPDATE_DEPLOYMENT_PROVIDER_MUTATION
} from '@/features/shared/graphql/operations'

export const Route = createFileRoute('/settings/flyio')({
  component: FlyioSettingsPage
})

type DeploymentProvider = 'FLYIO' | 'RAILWAY' | 'RENDER'

export default function FlyioSettingsPage() {
  const [token, setToken] = useState('')
  const [organization, setOrganization] = useState('')
  const [showTokenInput, setShowTokenInput] = useState(false)

  const { data, loading, refetch } = useQuery(ME_QUERY)
  const [updateProvider, { loading: updating }] = useMutation(UPDATE_DEPLOYMENT_PROVIDER_MUTATION)
  const [removeProvider, { loading: removing }] = useMutation(REMOVE_DEPLOYMENT_PROVIDER_MUTATION)

  const deploymentProviders = data?.me?.deploymentProviders ?? []
  const hasFlyioCredentials =
    data?.me?.hasFlyioCredentials ||
    deploymentProviders.some((p: { provider: DeploymentProvider }) => p.provider === 'FLYIO')

  const handleSaveCredentials = async () => {
    if (!token.trim() || !organization.trim()) return

    try {
      await updateProvider({
        variables: {
          input: {
            provider: 'FLYIO' as DeploymentProvider,
            token,
            organization
          }
        }
      })
      setToken('')
      setOrganization('')
      setShowTokenInput(false)
      await refetch()
    } catch (error) {
      console.error('Failed to save Fly.io credentials:', error)
      alert('Failed to save Fly.io credentials. Please try again.')
    }
  }

  const handleRemoveCredentials = async () => {
    if (
      !confirm('Are you sure you want to remove your Fly.io credentials? This cannot be undone.')
    ) {
      return
    }

    try {
      await removeProvider({
        variables: { provider: 'FLYIO' as DeploymentProvider }
      })
      await refetch()
    } catch (error) {
      console.error('Failed to remove Fly.io credentials:', error)
      alert('Failed to remove Fly.io credentials. Please try again.')
    }
  }

  const handleCancel = () => {
    setShowTokenInput(false)
    setToken('')
    setOrganization('')
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Fly.io Integration</h1>
        <p className="mt-1.5 text-muted-foreground">
          Connect your Fly.io account to deploy MCP servers globally.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-primary/10">
                  <PaperPlaneTilt className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Fly.io</CardTitle>
                  <CardDescription className="text-xs">Deploy apps globally</CardDescription>
                </div>
              </div>
              <Badge
                variant={hasFlyioCredentials ? 'default' : 'secondary'}
                className="h-6 text-xs"
              >
                {hasFlyioCredentials ? (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Connected
                  </>
                ) : (
                  'Not connected'
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {hasFlyioCredentials && !showTokenInput ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your credentials are configured. You can use MCP tools to manage your Fly.io apps.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowTokenInput(true)}>
                    Update
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveCredentials}
                    disabled={removing}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    {removing ? (
                      <>
                        <Spinner className="mr-1.5 h-3.5 w-3.5" />
                        Removing...
                      </>
                    ) : (
                      <>
                        <Trash className="mr-1.5 h-3.5 w-3.5" />
                        Remove
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {!showTokenInput && !hasFlyioCredentials && (
                  <Alert className="border-border/50 bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertTitle className="text-sm font-medium">Get your token</AlertTitle>
                    <AlertDescription className="mt-1.5 text-xs">
                      <ol className="list-inside list-decimal space-y-1">
                        <li>
                          Install CLI:{' '}
                          <code className="bg-background px-1">
                            curl -L https://fly.io/install.sh | sh
                          </code>
                        </li>
                        <li>
                          Run: <code className="bg-background px-1">fly tokens create deploy</code>
                        </li>
                        <li>Copy the token below</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="org-slug" className="text-xs">
                      Organization Slug
                    </Label>
                    <Input
                      id="org-slug"
                      value={organization}
                      onChange={e => setOrganization(e.target.value)}
                      placeholder="personal"
                      className="h-9"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      From fly.io/dashboard/[org-slug]
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deploy-token" className="text-xs">
                      Deploy Token
                    </Label>
                    <Input
                      id="deploy-token"
                      type="password"
                      value={token}
                      onChange={e => setToken(e.target.value)}
                      placeholder="FlyV1 ..."
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {showTokenInput && (
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleSaveCredentials}
                    disabled={!token.trim() || !organization.trim() || updating}
                  >
                    {updating ? (
                      <>
                        <Spinner className="mr-1.5 h-3.5 w-3.5" />
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Available MCP Tools</CardTitle>
            <CardDescription className="text-xs">
              Use these with Claude or other AI assistants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 border-b pb-3">
              <code className="shrink-0 bg-primary/10 px-2 py-1 text-xs text-primary">
                flyio_list_apps
              </code>
              <p className="text-xs text-muted-foreground">List all apps in your organization</p>
            </div>
            <div className="flex items-start gap-3">
              <code className="shrink-0 bg-primary/10 px-2 py-1 text-xs text-primary">
                flyio_app_status
              </code>
              <p className="text-xs text-muted-foreground">Get status of a specific app</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
