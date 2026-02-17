import { useMutation, useQuery } from '@apollo/client'
import {
  ArrowClockwise,
  CheckCircle,
  Clock,
  Globe,
  Plus,
  Trash,
  Warning,
  XCircle
} from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
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
import {
  DELEGATE_ZONE_MUTATION,
  LIST_DELEGATED_ZONES_QUERY,
  REMOVE_DELEGATION_MUTATION,
  VERIFY_DELEGATION_MUTATION
} from '@/features/shared/graphql/operations'
import { logError } from '@/features/shared/utils/logger'

export const Route = createFileRoute('/dns')({
  component: DNSDelegationPage
})

interface DelegateZoneData {
  delegateZone: {
    zoneId: string
    zone: string
    status: string
    instructions: string
  }
}

interface VerifyDelegationData {
  verifyDelegation: {
    zoneId: string
    zone: string
    status: string
    message: string
    instructions: string | null
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return (
        <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
          <CheckCircle className="h-3 w-3" weight="fill" />
          Active
        </Badge>
      )
    case 'pending_verification':
      return (
        <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-500">
          <Clock className="h-3 w-3" weight="fill" />
          Pending Verification
        </Badge>
      )
    case 'pending_delegation':
      return (
        <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-500">
          <Clock className="h-3 w-3" weight="fill" />
          Pending Delegation
        </Badge>
      )
    case 'provisioning':
      return (
        <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-500">
          <ArrowClockwise className="h-3 w-3 animate-spin" />
          Provisioning
        </Badge>
      )
    case 'failed':
      return (
        <Badge className="border-destructive/20 bg-destructive/10 text-destructive">
          <XCircle className="h-3 w-3" weight="fill" />
          Failed
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function DNSDelegationPage() {
  const [showDelegateDialog, setShowDelegateDialog] = useState(false)
  const [zoneName, setZoneName] = useState('')
  const [delegationResult, setDelegationResult] = useState<DelegateZoneData['delegateZone'] | null>(
    null
  )
  const [verifyResult, setVerifyResult] = useState<VerifyDelegationData['verifyDelegation'] | null>(
    null
  )

  const { data, loading, refetch } = useQuery(LIST_DELEGATED_ZONES_QUERY)
  const [delegateZone, { loading: delegating }] = useMutation(DELEGATE_ZONE_MUTATION)
  const [verifyDelegation, { loading: verifying }] = useMutation(VERIFY_DELEGATION_MUTATION)
  const [removeDelegation] = useMutation(REMOVE_DELEGATION_MUTATION)

  const handleDelegateZone = async () => {
    const trimmed = zoneName.trim().replace(/\.$/, '')
    if (!trimmed) return

    try {
      const result = await delegateZone({
        variables: { zone: trimmed }
      })
      setDelegationResult(result.data?.delegateZone || null)
      setZoneName('')
      await refetch()
    } catch (error) {
      logError('Failed to delegate zone', error)
      alert('Failed to delegate zone. Please try again.')
    }
  }

  const handleVerify = async (zone: string) => {
    try {
      const result = await verifyDelegation({
        variables: { zone }
      })
      setVerifyResult(result.data?.verifyDelegation || null)
    } catch (error) {
      logError('Failed to verify delegation', error)
      alert('Failed to verify delegation. Please try again.')
    }
  }

  const handleRemove = async (zone: string) => {
    if (
      !confirm(`Are you sure you want to remove delegation for "${zone}"? This cannot be undone.`)
    ) {
      return
    }

    try {
      await removeDelegation({ variables: { zone } })
      await refetch()
    } catch (error) {
      logError('Failed to remove delegation', error)
      alert('Failed to remove delegation. Please try again.')
    }
  }

  const handleCloseDialog = () => {
    setShowDelegateDialog(false)
    setDelegationResult(null)
    setVerifyResult(null)
    setZoneName('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const zones = data?.listDelegatedZones || []

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">DNS Delegation</h1>
        <p className="mt-1.5 text-muted-foreground">
          Delegate your domain's DNS to Ink to enable custom domains for your MCP servers. Once
          delegated, you can assign custom subdomains to any of your deployed services.
        </p>
        <p className="mt-2 text-sm text-muted-foreground/80">
          For example, if you delegate{' '}
          <span className="font-medium text-foreground/70">coco.domain.com</span>, your agent can
          use it and any subdomain under it — like{' '}
          <span className="font-medium text-foreground/70">app.coco.domain.com</span> or{' '}
          <span className="font-medium text-foreground/70">mail.coco.domain.com</span>.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {zones.length === 0
            ? 'No delegated zones'
            : `${zones.length} zone${zones.length === 1 ? '' : 's'}`}
        </p>
        <Button size="sm" onClick={() => setShowDelegateDialog(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Delegate Domain
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6" />
        </div>
      ) : zones.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 py-16 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <p className="text-muted-foreground">No delegated domains yet</p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Delegate your first domain to start using custom domains
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-10 text-xs font-medium">Domain</TableHead>
                <TableHead className="h-10 text-xs font-medium">Status</TableHead>
                <TableHead className="h-10 text-xs font-medium">Created</TableHead>
                <TableHead className="h-10 w-[180px] text-right text-xs font-medium" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((zone: Record<string, string>) => (
                <TableRow key={zone.id}>
                  <TableCell className="py-3 font-medium">{zone.zone}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(zone.status)}
                      {zone.error && <span className="text-xs text-destructive">{zone.error}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-muted-foreground">
                    {formatDate(zone.createdAt)}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {zone.status !== 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerify(zone.zone)}
                          disabled={verifying}
                          className="h-7"
                        >
                          {verifying ? (
                            <Spinner className="mr-1 h-3.5 w-3.5" />
                          ) : (
                            <ArrowClockwise className="mr-1 h-3.5 w-3.5" />
                          )}
                          Verify
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(zone.zone)}
                        className="h-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash className="mr-1 h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delegate Zone Dialog */}
      <Dialog open={showDelegateDialog} onOpenChange={setShowDelegateDialog}>
        <DialogContent className={delegationResult ? 'sm:max-w-lg' : 'sm:max-w-md'}>
          <DialogHeader>
            <DialogTitle>
              {delegationResult ? 'Domain Delegation Started' : 'Delegate Domain'}
            </DialogTitle>
            <DialogDescription>
              {delegationResult
                ? 'Follow the instructions below to complete the delegation.'
                : 'Enter your domain name to start the delegation process.'}
            </DialogDescription>
          </DialogHeader>

          {delegationResult ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-md bg-amber-500/15 px-3 py-2 text-sm text-amber-600">
                <Warning className="h-4 w-4 shrink-0" weight="fill" />
                <span>Complete the DNS setup at your domain registrar to finish delegation.</span>
              </div>

              <div className="space-y-2">
                <Label>Domain</Label>
                <code className="block rounded-md bg-muted px-3 py-2 text-sm">
                  {delegationResult.zone}
                </code>
              </div>

              <div className="space-y-2">
                <Label>Instructions</Label>
                <div className="rounded-md bg-muted px-3 py-2 text-sm whitespace-pre-wrap">
                  {delegationResult.instructions}
                </div>
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
                <Label htmlFor="zone-name">Domain</Label>
                <Input
                  id="zone-name"
                  value={zoneName}
                  onChange={e => setZoneName(e.target.value)}
                  placeholder="e.g., example.com"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Enter the domain you want to delegate. You'll need to update NS records at your
                  registrar.
                </p>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button onClick={handleDelegateZone} disabled={!zoneName.trim() || delegating}>
                  {delegating ? (
                    <>
                      <Spinner className="mr-1.5 h-4 w-4" />
                      Delegating...
                    </>
                  ) : (
                    'Delegate'
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Verify Result Dialog */}
      <Dialog open={!!verifyResult} onOpenChange={() => setVerifyResult(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Verification Result</DialogTitle>
            <DialogDescription>Status for {verifyResult?.zone}</DialogDescription>
          </DialogHeader>

          {verifyResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                {getStatusBadge(verifyResult.status)}
              </div>

              <div className="rounded-md bg-muted px-3 py-2 text-sm">{verifyResult.message}</div>

              {verifyResult.instructions && (
                <div className="space-y-2">
                  <Label>Next Steps</Label>
                  <div className="rounded-md bg-muted px-3 py-2 text-sm whitespace-pre-wrap">
                    {verifyResult.instructions}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  onClick={() => {
                    setVerifyResult(null)
                    void refetch()
                  }}
                  className="w-full"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
