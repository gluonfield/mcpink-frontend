import { useMutation, useQuery } from '@apollo/client'
import { Plus, Trash, Warning } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import McpInstallation, { CodeBlock } from '@/features/shared/components/McpInstallation'
import {
  CREATE_API_KEY_MUTATION,
  MY_API_KEYS_QUERY,
  REVOKE_API_KEY_MUTATION
} from '@/features/shared/graphql/operations'

export const Route = createFileRoute('/settings/api-keys')({
  component: APIKeysPage
})

export default function APIKeysPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [createdSecret, setCreatedSecret] = useState<string | null>(null)

  const { data, loading, refetch } = useQuery(MY_API_KEYS_QUERY)
  const [createAPIKey, { loading: creating }] = useMutation(CREATE_API_KEY_MUTATION)
  const [revokeAPIKey] = useMutation(REVOKE_API_KEY_MUTATION)

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return

    try {
      const result = await createAPIKey({
        variables: { name: newKeyName }
      })

      setCreatedSecret(result.data?.createAPIKey?.secret || null)
      setNewKeyName('')
      await refetch()
    } catch (error) {
      console.error('Failed to create API key:', error)
      alert('Failed to create API key. Please try again.')
    }
  }

  const handleRevokeKey = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke the API key "${name}"? This cannot be undone.`)) {
      return
    }

    try {
      await revokeAPIKey({ variables: { id } })
      await refetch()
    } catch (error) {
      console.error('Failed to revoke API key:', error)
      alert('Failed to revoke API key. Please try again.')
    }
  }

  const handleCloseDialog = () => {
    setShowCreateDialog(false)
    setCreatedSecret(null)
    setNewKeyName('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
        <p className="mt-1.5 text-muted-foreground">
          Manage API keys for programmatic access to your account.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data?.myAPIKeys?.length === 0
            ? 'No API keys yet'
            : `${data?.myAPIKeys?.length || 0} key${data?.myAPIKeys?.length === 1 ? '' : 's'}`}
        </p>
        <Button size="sm" onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Create Key
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6" />
        </div>
      ) : data?.myAPIKeys?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">No API keys yet</p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Create your first API key to get started
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-10 text-xs font-medium">Name</TableHead>
                <TableHead className="h-10 text-xs font-medium">Key</TableHead>
                <TableHead className="h-10 text-xs font-medium">Last Used</TableHead>
                <TableHead className="h-10 text-xs font-medium">Created</TableHead>
                <TableHead className="h-10 w-[100px] text-right text-xs font-medium" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.myAPIKeys?.map((key: Record<string, string | null>) => (
                <TableRow key={key.id}>
                  <TableCell className="py-3 font-medium">{key.name}</TableCell>
                  <TableCell className="py-3">
                    <code className="bg-muted px-1.5 py-0.5 text-xs">{key.prefix}...</code>
                  </TableCell>
                  <TableCell className="py-3 text-muted-foreground">
                    {key.lastUsedAt ? formatDate(key.lastUsedAt) : 'Never'}
                  </TableCell>
                  <TableCell className="py-3 text-muted-foreground">
                    {formatDate(key.createdAt!)}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeKey(key.id!, key.name!)}
                      className="h-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash className="mr-1 h-3.5 w-3.5" />
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent
          className={createdSecret ? 'sm:max-w-3xl' : 'sm:max-w-md'}
          showCloseButton={!createdSecret}
        >
          <DialogHeader>
            <DialogTitle>{createdSecret ? 'API Key Created' : 'Create API Key'}</DialogTitle>
            <DialogDescription>
              {createdSecret
                ? 'Your API key has been created. Use the configuration below to connect your MCP client.'
                : 'Give your key a name to identify it later.'}
            </DialogDescription>
          </DialogHeader>

          {createdSecret ? (
            <div className="space-y-6">
              <Alert variant="destructive" className="border-amber-500/50 bg-amber-500/10">
                <Warning className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-600">
                  Save this key now. It won't be shown again.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Your API Key</Label>
                <CodeBlock>{createdSecret}</CodeBlock>
              </div>

              <div className="border-t pt-6">
                <McpInstallation transport="stdio" apiKey={createdSecret} showHeader={false} />
              </div>

              <DialogFooter>
                <Button onClick={handleCloseDialog} className="w-full">
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Name</Label>
                <Input
                  id="key-name"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production Server"
                  autoFocus
                />
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button onClick={handleCreateKey} disabled={!newKeyName.trim() || creating}>
                  {creating ? (
                    <>
                      <Spinner className="mr-1.5 h-4 w-4" />
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
