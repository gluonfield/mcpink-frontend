import { Check, Copy } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useState } from 'react'

import ClientSelector from './ClientSelector'
import { getCursorDeepLink, getVSCodeDeepLink, MCP_CLIENTS, type McpClient } from './mcp-clients'
import { cn } from '@/lib/utils'

const MCP_URL = import.meta.env.VITE_MCP_DOMAIN || 'https://mcp.ml.ink'
const MCP_SERVER_NAME = 'ink'

function CodeBlock({
  children,
  className,
  variant = 'light'
}: {
  children: string
  className?: string
  variant?: 'light' | 'dark'
}) {
  const [copied, setCopied] = useState(false)
  const isDark = variant === 'dark'

  const handleCopy = () => {
    void navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'group flex items-center gap-2 rounded-lg border px-4 py-3',
        isDark ? 'border-white/10 bg-white/5' : 'border-border/50 bg-secondary/50',
        className
      )}
    >
      <pre className="min-w-0 flex-1 overflow-x-auto text-sm md:text-base text-left">
        <code className={isDark ? 'text-white/90' : 'text-foreground/90'}>{children}</code>
      </pre>
      <motion.button
        onClick={handleCopy}
        className={cn(
          'flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-opacity',
          copied
            ? isDark
              ? 'border-white/30 bg-white/15 text-white opacity-100'
              : 'border-border bg-background text-foreground opacity-100'
            : isDark
              ? 'border-white/20 bg-white/10 text-white/60 opacity-60 hover:opacity-100'
              : 'border-border bg-background text-muted-foreground opacity-60 hover:opacity-100'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
      >
        {copied ? (
          <>
            <Check className="size-3" weight="bold" />
            Copied
          </>
        ) : (
          <>
            <Copy className="size-3" />
            Copy
          </>
        )}
      </motion.button>
    </div>
  )
}

interface McpQuickStartProps {
  variant?: 'light' | 'dark'
}

export default function McpQuickStart({ variant = 'light' }: McpQuickStartProps) {
  const [selectedClient, setSelectedClient] = useState<McpClient>(MCP_CLIENTS[0])
  const isDark = variant === 'dark'

  const getHttpConfig = () =>
    JSON.stringify(
      {
        mcpServers: {
          [MCP_SERVER_NAME]: {
            type: 'http',
            url: MCP_URL
          }
        }
      },
      null,
      2
    )

  const getOpenCodeConfig = () =>
    JSON.stringify(
      {
        $schema: 'https://opencode.ai/config.json',
        mcp: {
          [MCP_SERVER_NAME]: {
            type: 'remote',
            url: `${MCP_URL}/mcp`,
            enabled: true,
            oauth: {}
          }
        }
      },
      null,
      2
    )

  const getCommand = () => {
    if (selectedClient.id === 'claude-code') {
      return `claude mcp add --transport http ${MCP_SERVER_NAME} "${MCP_URL}"`
    }
    if (selectedClient.id === 'gemini-cli') {
      return `gemini mcp add --transport http ${MCP_SERVER_NAME} "${MCP_URL}"`
    }
    if (selectedClient.id === 'codex') {
      return `codex mcp add ${MCP_SERVER_NAME} --url "${MCP_URL}"`
    }
    if (selectedClient.id === 'antigravity') {
      return JSON.stringify(
        { mcpServers: { [MCP_SERVER_NAME]: { serverUrl: MCP_URL } } },
        null,
        2
      )
    }
    if (selectedClient.id === 'opencode') {
      return getOpenCodeConfig()
    }
    return getHttpConfig()
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <p className={cn('text-sm', isDark ? 'text-neutral-400' : 'text-muted-foreground')}>
        Get started in seconds
      </p>

      <div className="flex items-center justify-center gap-3">
        <ClientSelector
          selectedClient={selectedClient}
          onClientChange={setSelectedClient}
          variant="transparent"
        />
      </div>

      {selectedClient.id === 'cursor' && (
        <a
          href={getCursorDeepLink(MCP_SERVER_NAME, MCP_URL)}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
            isDark
              ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
              : 'border-border bg-foreground text-background hover:bg-foreground/90'
          )}
        >
          <img
            src="/icons/mcp-clients/cursor-dark-icon.svg"
            alt=""
            width={16}
            height={16}
            className={isDark ? '' : 'invert'}
          />
          Add to Cursor
        </a>
      )}
      {selectedClient.id === 'vscode' && (
        <a
          href={getVSCodeDeepLink(MCP_SERVER_NAME, MCP_URL)}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
            isDark
              ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
              : 'border-border bg-foreground text-background hover:bg-foreground/90'
          )}
        >
          <img
            src="/icons/mcp-clients/vscode-dark-icon.svg"
            alt=""
            width={16}
            height={16}
            className={isDark ? '' : 'invert'}
          />
          Add to VS Code
        </a>
      )}
      {selectedClient.id === 'opencode' && (
        <p className={cn('text-sm', isDark ? 'text-neutral-400' : 'text-muted-foreground')}>
          Create{' '}
          <code className={isDark ? 'text-white/90' : 'text-foreground/90'}>opencode.json</code>{' '}
          with the following:
        </p>
      )}
      <CodeBlock variant={variant}>{getCommand()}</CodeBlock>
      {selectedClient.id === 'claude-code' && (
        <p className={cn('text-sm', isDark ? 'text-neutral-400' : 'text-muted-foreground')}>
          After installation start Claude Code and run{' '}
          <code className={isDark ? 'text-white/90' : 'text-foreground/90'}>/mcp</code> to authenticate.
        </p>
      )}
      {selectedClient.id === 'gemini-cli' && (
        <div className="space-y-2">
          <p className={cn('text-sm', isDark ? 'text-neutral-400' : 'text-muted-foreground')}>
            After installation start Gemini CLI and run the following command
          </p>
          <CodeBlock variant={variant}>{`/mcp auth ${MCP_SERVER_NAME}`}</CodeBlock>
        </div>
      )}
      {selectedClient.id === 'opencode' && (
        <div className="space-y-2">
          <p className={cn('text-sm', isDark ? 'text-neutral-400' : 'text-muted-foreground')}>
            Then authenticate:
          </p>
          <CodeBlock variant={variant}>{`opencode mcp auth ${MCP_SERVER_NAME}`}</CodeBlock>
        </div>
      )}
      {selectedClient.id === 'other' && (
        <p className={cn('text-sm', isDark ? 'text-neutral-400' : 'text-muted-foreground')}>
          If your client doesn&apos;t support OAuth, use the Bearer token version in{' '}
          <a href="/settings/api-keys" className={isDark ? 'text-white underline' : 'text-foreground underline'}>
            API Keys
          </a>
          .
        </p>
      )}
    </div>
  )
}
