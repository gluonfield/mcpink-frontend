import { useMutation, useQuery } from '@apollo/client'
import { Warning } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import {
  AnimatedCheckmark,
  isOnboardingOAuthMode,
  OnboardingLayout,
  useOnboardingStep
} from '@/features/onboarding'
import McpInstallation from '@/features/shared/components/McpInstallation'
import { CREATE_API_KEY_MUTATION, MY_API_KEYS_QUERY } from '@/features/shared/graphql/operations'

export const Route = createFileRoute('/onboarding/_layout/agent-key')({
  component: AgentKeyPage
})

type TransitionPhase = 'idle' | 'fade-out' | 'resize' | 'fade-in'

export default function AgentKeyPage() {
  const { goToNext } = useOnboardingStep('agent-key')

  // Check OAuth mode synchronously during render to avoid StrictMode issues
  const oauthModeRef = useRef<boolean | null>(null)
  if (oauthModeRef.current === null) {
    oauthModeRef.current = isOnboardingOAuthMode()
  }
  const isOAuthMode = oauthModeRef.current

  const [hasSkipped, setHasSkipped] = useState(false)
  const [keyName, setKeyName] = useState('My Agent')

  // Skip this step in OAuth mode - API key will be created automatically
  useEffect(() => {
    if (isOAuthMode && !hasSkipped) {
      setHasSkipped(true)
      goToNext()
    }
  }, [isOAuthMode, hasSkipped, goToNext])
  const [createdSecret, setCreatedSecret] = useState<string | null>(null)
  const [mcpConfigured, setMcpConfigured] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const [containerHeight, setContainerHeight] = useState<number | 'auto'>('auto')

  const formRef = useRef<HTMLDivElement>(null)
  const configRef = useRef<HTMLDivElement>(null)

  const { refetch } = useQuery(MY_API_KEYS_QUERY)
  const [createAPIKey, { loading: creating }] = useMutation(CREATE_API_KEY_MUTATION)

  const handleCreateKey = async () => {
    if (!keyName.trim()) return

    try {
      const result = await createAPIKey({
        variables: { name: keyName }
      })
      const secret = result.data?.createAPIKey?.secret || null
      setCreatedSecret(secret)
      await refetch()

      if (secret) {
        // Capture current height before transition
        if (formRef.current) {
          setContainerHeight(formRef.current.offsetHeight)
        }
        setPhase('fade-out')
      }
    } catch (error) {
      console.error('Failed to create key:', error)
    }
  }

  // Handle transition phases
  useEffect(() => {
    if (phase === 'fade-out') {
      const timer = setTimeout(() => {
        setShowConfig(true)
        setPhase('resize')
      }, 250)
      return () => clearTimeout(timer)
    }

    if (phase === 'resize') {
      // Measure the config content height and animate to it
      requestAnimationFrame(() => {
        if (configRef.current) {
          setContainerHeight(configRef.current.scrollHeight)
        }
      })
      const timer = setTimeout(() => {
        setPhase('fade-in')
      }, 450)
      return () => clearTimeout(timer)
    }

    if (phase === 'fade-in') {
      const timer = setTimeout(() => {
        setPhase('idle')
        setContainerHeight('auto')
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [phase])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && keyName.trim() && !creating) {
      void handleCreateKey()
    }
  }

  const contentOpacity = phase === 'fade-out' || phase === 'resize' ? 0 : 1
  const configOpacity = phase === 'fade-in' || phase === 'idle' ? 1 : 0

  // In OAuth mode, show nothing while skipping to next step
  if (isOAuthMode) {
    return null
  }

  return (
    <OnboardingLayout currentStep="agent-key" wide>
      <div className="flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-3xl font-semibold tracking-tight"
        >
          Create Agent Key
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: showConfig ? configOpacity : contentOpacity,
            y: 0
          }}
          transition={{ duration: 0.25 }}
          className="mb-8 max-w-md text-lg text-muted-foreground"
        >
          {showConfig
            ? 'Add this key to your MCP client so agents can deploy servers.'
            : 'Allows Agent to authenticate to Ink MCP.'}
        </motion.p>

        <motion.div
          animate={{ height: containerHeight }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="w-full overflow-hidden"
        >
          {showConfig ? (
            <motion.div
              ref={configRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: configOpacity }}
              transition={{ duration: 0.3 }}
              className="w-full space-y-6 text-left"
            >
              <div className="flex items-center gap-2 rounded-lg bg-amber-500/15 px-4 py-3 text-sm text-amber-600 dark:text-amber-500">
                <Warning className="size-4 shrink-0" weight="fill" />
                <span>Below contains your agent key allowing access to your apps and credits.</span>
              </div>

              <McpInstallation transport="http" apiKey={createdSecret!} />

              <AnimatedCheckmark
                checked={mcpConfigured}
                onChange={setMcpConfigured}
                label="I've added the MCP configuration to my agent"
              />

              <Button onClick={goToNext} size="lg" className="px-8" disabled={!mcpConfigured}>
                Finish Setup
              </Button>
            </motion.div>
          ) : (
            <motion.div
              ref={formRef}
              animate={{ opacity: contentOpacity }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="key-name" className="text-foreground">
                  Key Name
                </Label>
                <Input
                  id="key-name"
                  value={keyName}
                  onChange={e => setKeyName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., My Agent"
                  autoFocus
                  className="border-white/20 bg-white/10 text-foreground placeholder:text-white/40"
                />
              </div>

              <Button
                onClick={handleCreateKey}
                size="lg"
                className="px-8"
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
            </motion.div>
          )}
        </motion.div>
      </div>
    </OnboardingLayout>
  )
}
