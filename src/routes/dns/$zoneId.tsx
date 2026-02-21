import { useMutation, useQuery } from '@apollo/client'
import {
  ArrowClockwise,
  ArrowLeft,
  Check,
  CheckCircle,
  Clock,
  Copy,
  Globe,
  Info,
  Lock,
  Plus,
  Trash,
  Warning,
  XCircle
} from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  ADD_DNS_RECORD_MUTATION,
  DELETE_DNS_RECORD_MUTATION,
  LIST_HOSTED_ZONES_QUERY,
  VERIFY_HOSTED_ZONE_MUTATION
} from '@/features/shared/graphql/operations'
import { useWorkspaceStore } from '@/features/shared/hooks/useWorkspaceStore'
import { logError } from '@/features/shared/utils/logger'

export const Route = createFileRoute('/dns/$zoneId')({
  component: ZoneDetailPage
})

interface DNSRecord {
  host: string
  type: string
  value: string
  verified: boolean
}

interface ZoneRecord {
  id: string
  name: string
  type: string
  content: string
  ttl: number
  managed: boolean
  createdAt: string
}

interface HostedZone {
  id: string
  zone: string
  status: string
  error?: string | null
  dnsRecords?: DNSRecord[] | null
  records: ZoneRecord[]
  createdAt: string
}

const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'CAA'] as const

const CONTENT_PLACEHOLDERS: Record<string, string> = {
  A: '192.0.2.1',
  AAAA: '2001:db8::1',
  CNAME: 'target.example.com',
  MX: '10 mail.example.com',
  TXT: 'v=spf1 include:example.com ~all',
  CAA: '0 issue "letsencrypt.org"'
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

function getRecordTypeBadge(type: string) {
  const colors: Record<string, string> = {
    A: 'border-blue-500/20 bg-blue-500/10 text-blue-500',
    AAAA: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-500',
    CNAME: 'border-purple-500/20 bg-purple-500/10 text-purple-500',
    MX: 'border-amber-500/20 bg-amber-500/10 text-amber-500',
    TXT: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500',
    CAA: 'border-rose-500/20 bg-rose-500/10 text-rose-500'
  }
  return (
    <Badge className={colors[type] || 'border-muted-foreground/20 bg-muted text-muted-foreground'}>
      {type}
    </Badge>
  )
}

export default function ZoneDetailPage() {
  const { zoneId } = Route.useParams()
  const selectedSlug = useWorkspaceStore(s => s.selectedSlug)
  const { data, loading, refetch } = useQuery(LIST_HOSTED_ZONES_QUERY, {
    variables: { workspaceSlug: selectedSlug }
  })
  const [addDnsRecord, { loading: adding }] = useMutation(ADD_DNS_RECORD_MUTATION)
  const [deleteDnsRecord] = useMutation(DELETE_DNS_RECORD_MUTATION)
  const [verifyHostedZone] = useMutation(VERIFY_HOSTED_ZONE_MUTATION)

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [recordType, setRecordType] = useState<string>('A')
  const [recordName, setRecordName] = useState('')
  const [recordContent, setRecordContent] = useState('')
  const [recordTtl, setRecordTtl] = useState('300')
  const [deletingRecords, setDeletingRecords] = useState<Set<string>>(new Set())

  // Verification polling state
  const [polling, setPolling] = useState(false)
  const pollingRef = useRef(false)

  const zone: HostedZone | undefined = data?.listHostedZones?.find(
    (z: HostedZone) => z.id === zoneId
  )

  const stopPolling = useCallback(() => {
    pollingRef.current = false
    setPolling(false)
  }, [])

  useEffect(() => {
    return () => {
      pollingRef.current = false
    }
  }, [])

  const startPolling = useCallback(
    (step: 1 | 2) => {
      if (!zone) return
      setPolling(true)
      pollingRef.current = true

      const poll = async () => {
        if (!pollingRef.current) return

        try {
          const result = await verifyHostedZone({
            variables: { zone: zone.zone, workspaceSlug: selectedSlug }
          })
          const data = result.data?.verifyHostedZone
          if (!data || !pollingRef.current) return

          if (step === 1) {
            if (data.status === 'provisioning' || data.status === 'pending_delegation') {
              stopPolling()
              toast.success('TXT record verified! Now add NS records.')
              await refetch()
              return
            }
          } else {
            if (data.status === 'provisioning' || data.status === 'active') {
              stopPolling()
              toast.success('NS records verified! Zone is being provisioned.')
              await refetch()
              return
            }
          }
        } catch (error) {
          logError(`Failed to verify ${step === 1 ? 'TXT' : 'NS'} records`, error)
        }

        if (pollingRef.current) {
          setTimeout(poll, 5000)
        }
      }

      void poll()
    },
    [zone, verifyHostedZone, refetch, stopPolling, selectedSlug]
  )

  const handleAddRecord = async () => {
    if (!zone || !recordName.trim() || !recordContent.trim()) return

    const ttl = parseInt(recordTtl, 10)
    if (isNaN(ttl) || ttl < 60) {
      toast.error('TTL must be at least 60 seconds')
      return
    }

    try {
      await addDnsRecord({
        variables: {
          zone: zone.zone,
          name: recordName.trim(),
          type: recordType,
          content: recordContent.trim(),
          ttl,
          workspaceSlug: selectedSlug
        }
      })
      toast.success('DNS record added')
      setShowAddDialog(false)
      resetAddForm()
      await refetch()
    } catch (error) {
      logError('Failed to add DNS record', error)
      toast.error('Failed to add DNS record')
    }
  }

  const handleDeleteRecord = async (recordId: string) => {
    if (!zone) return
    if (!confirm('Are you sure you want to delete this record?')) return

    setDeletingRecords(prev => new Set(prev).add(recordId))
    try {
      await deleteDnsRecord({
        variables: { zone: zone.zone, recordId, workspaceSlug: selectedSlug }
      })
      toast.success('DNS record deleted')
      await refetch()
    } catch (error) {
      logError('Failed to delete DNS record', error)
      toast.error('Failed to delete DNS record')
    } finally {
      setDeletingRecords(prev => {
        const next = new Set(prev)
        next.delete(recordId)
        return next
      })
    }
  }

  const resetAddForm = () => {
    setRecordType('A')
    setRecordName('')
    setRecordContent('')
    setRecordTtl('300')
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner className="h-5 w-5 md:h-6 md:w-6" />
      </div>
    )
  }

  if (!zone) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center text-center">
        <Warning className="mb-3 h-6 w-6 text-destructive md:mb-4 md:h-8 md:w-8" />
        <p className="text-sm text-muted-foreground md:text-base">Zone not found</p>
        <Link to="/dns" className="mt-4 text-sm text-primary hover:underline">
          Back to Hosted Zones
        </Link>
      </div>
    )
  }

  const isActive = zone.status === 'active'
  const isPending = zone.status === 'pending_verification' || zone.status === 'pending_delegation'
  const dnsRecords = zone.dnsRecords || []
  const txtRecord = dnsRecords.find(r => r.type === 'TXT')
  const nsRecords = dnsRecords.filter(r => r.type === 'NS')
  const showTxtStep = zone.status === 'pending_verification' && txtRecord
  const showNsStep = zone.status === 'pending_delegation' && nsRecords.length > 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
      <Link
        to="/dns"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Hosted Zones
      </Link>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 md:mb-8">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{zone.zone}</h1>
        </div>
        {getStatusBadge(zone.status)}
      </div>

      {/* Error Banner */}
      {zone.error && (
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <Warning className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{zone.error}</span>
        </div>
      )}

      {/* Setup Section (for non-active zones) */}
      {isPending && (
        <div className="mb-8 rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Complete Setup</h2>

          {showTxtStep && txtRecord && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  1
                </span>
                <span className="font-medium text-foreground">Verify Domain Ownership</span>
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
                  <span className="px-1.5 py-0.5 font-mono text-xs">TXT</span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-xs font-medium text-muted-foreground">Value</span>
                  <CopyValue value={txtRecord.value} />
                </div>
              </div>

              {polling ? (
                <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                  <Spinner className="h-4 w-4" />
                  <span>Waiting for TXT record to propagate...</span>
                </div>
              ) : (
                <Button onClick={() => startPolling(1)}>
                  <ArrowClockwise className="mr-1.5 h-4 w-4" />
                  Verify TXT Record
                </Button>
              )}
            </div>
          )}

          {showNsStep && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                  <CheckCircle className="h-3 w-3" weight="fill" />
                </span>
                <span className="text-emerald-500">TXT Record</span>
                <div className="h-px flex-1 bg-border" />
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  2
                </span>
                <span className="font-medium text-foreground">Add NS Records</span>
              </div>

              <div className="flex items-start gap-2 rounded-md bg-amber-500/15 px-3 py-2 text-sm text-amber-600">
                <Warning className="mt-0.5 h-4 w-4 shrink-0" weight="fill" />
                <span>
                  Do not change your domain{"'"}s nameservers. Instead, add these as new NS records
                  alongside your existing DNS configuration.
                </span>
              </div>

              <div className="space-y-2">
                {nsRecords.map(record => (
                  <div key={record.value} className="space-y-2 rounded-md border p-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-xs font-medium text-muted-foreground">Host</span>
                      <CopyValue value={record.host} />
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-xs font-medium text-muted-foreground">Type</span>
                      <span className="px-1.5 py-0.5 font-mono text-xs">NS</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-xs font-medium text-muted-foreground">Value</span>
                      <CopyValue value={record.value} />
                    </div>
                  </div>
                ))}
              </div>

              {(() => {
                const hostExample = nsRecords[0]?.host
                const hostWithoutZone =
                  hostExample && hostExample.endsWith(`.${zone.zone}`)
                    ? hostExample.slice(0, -(zone.zone.length + 1))
                    : null
                return hostWithoutZone ? (
                  <div className="flex items-start gap-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      Some providers (e.g. Cloudflare) automatically append your domain to the Host
                      field. If that{"'"}s the case, enter{' '}
                      <code className="rounded bg-background px-1 py-0.5 font-mono font-medium text-foreground">
                        {hostWithoutZone}
                      </code>{' '}
                      instead of{' '}
                      <code className="rounded bg-background px-1 py-0.5 font-mono text-muted-foreground line-through">
                        {hostExample}
                      </code>
                    </span>
                  </div>
                ) : null
              })()}

              {polling ? (
                <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                  <Spinner className="h-4 w-4" />
                  <span>Waiting for NS records to propagate...</span>
                </div>
              ) : (
                <Button onClick={() => startPolling(2)}>
                  <ArrowClockwise className="mr-1.5 h-4 w-4" />
                  Verify NS Records
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* DNS Records Section */}
      {isActive && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">DNS Records</h2>
            <Button
              size="sm"
              onClick={() => {
                resetAddForm()
                setShowAddDialog(true)
              }}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add Record
            </Button>
          </div>

          {zone.records.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 py-12 text-center">
              <p className="text-muted-foreground">No DNS records yet</p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Add your first record to configure DNS for this zone
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-10 text-xs font-medium">Name</TableHead>
                    <TableHead className="h-10 w-[80px] text-xs font-medium">Type</TableHead>
                    <TableHead className="h-10 text-xs font-medium">Content</TableHead>
                    <TableHead className="h-10 w-[70px] text-xs font-medium">TTL</TableHead>
                    <TableHead className="h-10 w-[80px] text-right text-xs font-medium" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zone.records.map((record: ZoneRecord) => (
                    <TableRow key={record.id}>
                      <TableCell className="py-3 font-mono text-sm">{record.name}</TableCell>
                      <TableCell className="py-3">{getRecordTypeBadge(record.type)}</TableCell>
                      <TableCell className="max-w-[300px] truncate py-3 font-mono text-sm">
                        {record.content}
                      </TableCell>
                      <TableCell className="py-3 text-sm text-muted-foreground">
                        {record.ttl}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        {record.managed ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Lock className="ml-auto h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>Managed by Ink</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRecord(record.id)}
                            disabled={deletingRecords.has(record.id)}
                            className="h-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            {deletingRecords.has(record.id) ? (
                              <Spinner className="h-3.5 w-3.5" />
                            ) : (
                              <Trash className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Zone is provisioning - show info */}
      {zone.status === 'provisioning' && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 py-12 text-center">
          <Spinner className="mb-3 h-6 w-6" />
          <p className="text-muted-foreground">Zone is being provisioned</p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            DNS records will be available once provisioning completes
          </p>
        </div>
      )}

      {/* Add Record Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add DNS Record</DialogTitle>
            <DialogDescription>Add a new DNS record to {zone.zone}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={recordType} onValueChange={setRecordType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECORD_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="record-name">Name</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="record-name"
                  value={recordName}
                  onChange={e => setRecordName(e.target.value)}
                  placeholder="e.g., www"
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Use <code className="rounded bg-muted px-1 py-0.5 font-mono">@</code> for the root
                domain, or enter a subdomain name (e.g.,{' '}
                <code className="rounded bg-muted px-1 py-0.5 font-mono">www</code>)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="record-content">Content</Label>
              <Input
                id="record-content"
                value={recordContent}
                onChange={e => setRecordContent(e.target.value)}
                placeholder={CONTENT_PLACEHOLDERS[recordType] || 'Record value'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="record-ttl">TTL (seconds)</Label>
              <Input
                id="record-ttl"
                type="number"
                min={60}
                value={recordTtl}
                onChange={e => setRecordTtl(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddRecord}
              disabled={!recordName.trim() || !recordContent.trim() || adding}
            >
              {adding ? (
                <>
                  <Spinner className="mr-1.5 h-4 w-4" />
                  Adding...
                </>
              ) : (
                'Add Record'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
