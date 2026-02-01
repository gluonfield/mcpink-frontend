import { useMutation, useQuery } from '@apollo/client'
import { Key, Warning } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { AnimatedCheckmark, OnboardingLayout, useOnboardingStep } from '@/features/onboarding'
import McpInstallation from '@/features/shared/components/McpInstallation'
import { CREATE_API_KEY_MUTATION, MY_API_KEYS_QUERY } from '@/features/shared/graphql/operations'

export const Route = createFileRoute('/onboarding/agent-key')({
  component: AgentKeyPage
})

export default function AgentKeyPage() {
  const { goToNext } = useOnboardingStep('agent-key')
  const [keyName, setKeyName] = useState('My Agent')
  const [createdSecret, setCreatedSecret] = useState<string | null>(null)
  const [mcpConfigured, setMcpConfigured] = useState(false)

  const { data: apiKeysData, refetch } = useQuery(MY_API_KEYS_QUERY)
  const [createAPIKey, { loading: creating }] = useMutation(CREATE_API_KEY_MUTATION)

  const hasExistingKeys = (apiKeysData?.myAPIKeys?.length ?? 0) > 0

  const handleCreateKey = async () => {
    if (!keyName.trim()) return

    try {
      const result = await createAPIKey({
        variables: { name: keyName }
      })
      setCreatedSecret(result.data?.createAPIKey?.secret || null)
      await refetch()
    } catch (error) {
      console.error('Failed to create key:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && keyName.trim() && !creating) {
      void handleCreateKey()
    }
  }

  return (
    <OnboardingLayout currentStep="agent-key">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="mb-8 flex size-24 items-center justify-center rounded-full bg-muted"
        >
          <Key className="size-12 text-foreground" weight="duotone" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-3xl font-semibold tracking-tight"
        >
          Create Agent Key
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 max-w-md text-lg text-muted-foreground"
        >
          {createdSecret
            ? 'Add this key to your MCP client so agents can deploy servers.'
            : 'Create an API key that your agents will use to authenticate.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-2xl space-y-6 text-left"
        >
          {createdSecret ? (
            <>
              <div className="flex items-center gap-2 rounded-lg bg-amber-500/15 px-4 py-3 text-sm text-amber-600 dark:text-amber-500">
                <Warning className="size-4 shrink-0" weight="fill" />
                <span>Save this key now. It won't be shown again.</span>
              </div>

              <McpInstallation transport="http" apiKey={createdSecret} />

              <AnimatedCheckmark
                checked={mcpConfigured}
                onChange={setMcpConfigured}
                label="I've added the MCP configuration to my agent"
              />

              <Button onClick={goToNext} size="lg" className="w-full" disabled={!mcpConfigured}>
                Finish Setup
              </Button>
            </>
          ) : (
            <div className="mx-auto max-w-md space-y-4">
              {hasExistingKeys && (
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                  You already have API keys. Create a new one or skip to the next step.
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  value={keyName}
                  onChange={e => setKeyName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., My Agent"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Give your key a name to identify it later.
                </p>
              </div>

              <Button
                onClick={handleCreateKey}
                size="lg"
                className="w-full"
                disabled={!keyName.trim() || creating}
              >
                {creating ? (
                  <>
                    <Spinner className="mr-2 size-4" />
                    Creating...
                  </>
                ) : (
                  'Create Key'
                )}
              </Button>

              {hasExistingKeys && (
                <Button onClick={goToNext} variant="outline" size="lg" className="w-full">
                  Skip, I already have a key
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </OnboardingLayout>
  )
}
