import { useMutation, useQuery } from '@apollo/client'
import {
  ArrowClockwise,
  Check,
  CheckCircle,
  Clock,
  Copy,
  Globe,
  Plus,
  Trash,
  Warning,
  XCircle
} from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
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

interface DNSRecord {
  host: string
  type: string
  value: string
  verified: boolean
}

interface DelegatedZone {
  id: string
  zone: string
  status: string
  error?: string | null
  dnsRecords?: DNSRecord[] | null
  createdAt: string
}

interface DelegationResult {
  zoneId: string
  zone: string
  status: string
  dnsRecords: DNSRecord[]
}

interface VerifyDelegationData {
  verifyDelegation: {
    zoneId: string
    zone: string
    status: string
    message: string
    dnsRecords: DNSRecord[]
  }
}

function CopyValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="group/copy flex items-center gap-1.5 rounded px-1.5 py-0.5 font-mono text-xs transition-colors hover:bg-muted"
    >
      <span className="select-all">{value}</span>
      {copied ? (
        <Check className="h-3 w-3 shrink-0 text-emerald-500" weight="bold" />
      ) : (
        <Copy className="h-3 w-3 shrink-0 text-muted-foreground" />
      )}
    </button>
  )
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
  const [delegationResult, setDelegationResult] = useState<DelegationResult | null>(null)
  const [delegationStep, setDelegationStep] = useState<1 | 2>(1)
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
      setDelegationStep(1)
      setZoneName('')
      await refetch()
    } catch (error) {
      logError('Failed to delegate zone', error)
      toast.error('Failed to delegate zone')
    }
  }

  const handleVerifyTXT = async () => {
    if (!delegationResult) return

    try {
      const result = await verifyDelegation({
        variables: { zone: delegationResult.zone }
      })
      const data = result.data?.verifyDelegation
      if (!data) return

      if (data.status === 'provisioning' || data.status === 'pending_delegation') {
        setDelegationResult({
          zoneId: data.zoneId,
          zone: data.zone,
          status: data.status,
          dnsRecords: data.dnsRecords
        })
        setDelegationStep(2)
        await refetch()
      } else {
        toast.error(data.message || 'TXT verification failed')
      }
    } catch (error) {
      logError('Failed to verify TXT record', error)
      toast.error('Failed to verify TXT record')
    }
  }

  const handleSetup = (zone: DelegatedZone) => {
    const records = zone.dnsRecords || []
    const hasTxt = records.some(r => r.type === 'TXT')

    setDelegationResult({
      zoneId: zone.id,
      zone: zone.zone,
      status: zone.status,
      dnsRecords: records
    })

    if (zone.status === 'pending_verification' && hasTxt) {
      setDelegationStep(1)
    } else {
      setDelegationStep(2)
    }
    setShowDelegateDialog(true)
  }

  const handleVerify = async (zone: string) => {
    try {
      const result = await verifyDelegation({
        variables: { zone }
      })
      setVerifyResult(result.data?.verifyDelegation || null)
      await refetch()
    } catch (error) {
      logError('Failed to verify delegation', error)
      toast.error('Failed to verify delegation')
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
      toast.error('Failed to remove delegation')
    }
  }

  const handleCloseDialog = () => {
    setShowDelegateDialog(false)
    setDelegationResult(null)
    setDelegationStep(1)
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
        <p className="mt-3 text-sm font-medium text-amber-500">
          Once a zone is delegated, Ink will fully manage its DNS records. Any records added
          manually outside of Ink will have no effect.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        {zones.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {zones.length} zone{zones.length === 1 ? '' : 's'}
          </p>
        )}
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
              {zones.map((zone: DelegatedZone) => (
                <TableRow key={zone.id}>
                  <TableCell className="py-3 font-medium">{zone.zone}</TableCell>
                  <TableCell className="py-3">
                    {zone.error ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>{getStatusBadge(zone.status)}</TooltipTrigger>
                          <TooltipContent>{zone.error}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      getStatusBadge(zone.status)
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-muted-foreground">
                    {formatDate(zone.createdAt)}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {(zone.status === 'pending_verification' ||
                        zone.status === 'pending_delegation') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetup(zone)}
                          className="h-7"
                        >
                          <Globe className="mr-1 h-3.5 w-3.5" />
                          Setup
                        </Button>
                      )}
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
              {!delegationResult
                ? 'Delegate Domain'
                : delegationStep === 1
                  ? 'Step 1: Verify Domain Ownership'
                  : 'Step 2: Update Nameservers'}
            </DialogTitle>
            <DialogDescription>
              {!delegationResult
                ? 'Enter your domain name to start the delegation process.'
                : delegationStep === 1
                  ? 'Add a TXT record at your registrar to verify ownership.'
                  : 'Update your NS records to complete delegation.'}
            </DialogDescription>
          </DialogHeader>

          {delegationResult ? (
            (() => {
              const txtRecord = delegationResult.dnsRecords.find(r => r.type === 'TXT')
              const nsRecords = delegationResult.dnsRecords.filter(r => r.type === 'NS')
              return delegationStep === 1 && txtRecord ? (
                <div className="space-y-4">
                  {/* Step indicator */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      1
                    </span>
                    <span className="font-medium text-foreground">TXT Record</span>
                    <div className="h-px flex-1 bg-border" />
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                      2
                    </span>
                    <span>NS Records</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-md bg-amber-500/15 px-3 py-2 text-sm text-amber-600">
                    <Warning className="h-4 w-4 shrink-0" weight="fill" />
                    <span>Add this TXT record at your domain registrar, then click verify.</span>
                  </div>

                  <div className="space-y-2 rounded-md border p-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-xs font-medium text-muted-foreground">Host</span>
                      <CopyValue value={txtRecord.host} />
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-xs font-medium text-muted-foreground">Type</span>
                      <span className="px-1.5 py-0.5 font-mono text-xs">{txtRecord.type}</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-xs font-medium text-muted-foreground">Value</span>
                      <CopyValue value={txtRecord.value} />
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button onClick={handleVerifyTXT} disabled={verifying}>
                      {verifying ? (
                        <>
                          <Spinner className="mr-1.5 h-4 w-4" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <ArrowClockwise className="mr-1.5 h-4 w-4" />
                          Verify TXT Record
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Step indicator */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                      <CheckCircle className="h-3 w-3" weight="fill" />
                    </span>
                    <span className="text-emerald-500">TXT Record</span>
                    <div className="h-px flex-1 bg-border" />
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      2
                    </span>
                    <span className="font-medium text-foreground">NS Records</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-md bg-emerald-500/15 px-3 py-2 text-sm text-emerald-600">
                    <CheckCircle className="h-4 w-4 shrink-0" weight="fill" />
                    <span>TXT verified! Now update your NS records at your registrar.</span>
                  </div>

                  <div className="space-y-3 rounded-md border p-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-xs font-medium text-muted-foreground">Host</span>
                      <CopyValue value={nsRecords[0]?.host || ''} />
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-xs font-medium text-muted-foreground">Type</span>
                      <span className="px-1.5 py-0.5 font-mono text-xs">NS</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground">Values</span>
                      {nsRecords.map(record => (
                        <CopyValue key={record.value} value={record.value} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    The system will detect the NS records automatically and complete provisioning.
                    You can close this dialog and check the status later.
                  </p>

                  <DialogFooter>
                    <Button onClick={handleCloseDialog} className="w-full">
                      Done
                    </Button>
                  </DialogFooter>
                </div>
              )
            })()
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

              {(() => {
                const nsRecords = verifyResult.dnsRecords.filter(r => r.type === 'NS')
                return nsRecords.length > 0 ? (
                  <div className="space-y-2">
                    <Label>NS Records to Add</Label>
                    <div className="space-y-3 rounded-md border p-3">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-xs font-medium text-muted-foreground">Host</span>
                        <CopyValue value={nsRecords[0]?.host || ''} />
                      </div>
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-xs font-medium text-muted-foreground">Type</span>
                        <span className="px-1.5 py-0.5 font-mono text-xs">NS</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground">Values</span>
                        {nsRecords.map(record => (
                          <CopyValue key={record.value} value={record.value} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null
              })()}

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
