import { CaretDown, Check, Copy } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const MCP_URL = import.meta.env.VITE_MCP_URL || 'http://localhost:8081/mcp'
const MCP_SERVER_NAME = 'mlink'
const MCP_NPX_PACKAGE = '@anthropic/mcp-server-mlink'

interface Client {
  id: string
  name: string
  icon: string
}

const clients: Client[] = [
  { id: 'claude-code', name: 'Claude Code', icon: '/icons/mcp-clients/claude-dark-icon.svg' },
  { id: 'cursor', name: 'Cursor', icon: '/icons/mcp-clients/cursor-dark-icon.svg' },
  { id: 'vscode', name: 'VS Code', icon: '/icons/mcp-clients/vscode-dark-icon.svg' },
  { id: 'codex', name: 'Codex', icon: '/icons/mcp-clients/openai-dark-icon.svg' },
  { id: 'gemini-cli', name: 'Gemini CLI', icon: '/icons/mcp-clients/gemini-cli-dark-icon.svg' },
  { id: 'windsurf', name: 'Windsurf', icon: '/icons/mcp-clients/windsurf-dark-icon.svg' },
  { id: 'goose', name: 'Goose', icon: '/icons/mcp-clients/goose-dark-icon.svg' },
  { id: 'factory', name: 'Factory', icon: '/icons/mcp-clients/factory-dark-icon.svg' },
  { id: 'opencode', name: 'OpenCode', icon: '/icons/mcp-clients/opencode-dark-icon.svg' }
]

export function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('relative isolate max-w-full', className)}>
      <pre className="max-w-full overflow-x-auto rounded-lg border border-border/50 bg-secondary/50 p-3 pr-20 text-sm">
        <code className="text-foreground/90">{children}</code>
      </pre>
      <motion.button
        onClick={handleCopy}
        className={cn(
          'absolute right-2 top-2 z-20 flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium shadow-sm',
          copied
            ? 'border-green-600/50 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
            : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
      >
        {copied ? (
          <>
            <Check className="size-3.5" weight="bold" />
            Copied
          </>
        ) : (
          <>
            <Copy className="size-3.5" />
            Copy
          </>
        )}
      </motion.button>
    </div>
  )
}

export type McpTransport = 'http' | 'stdio'

export interface McpInstallationProps {
  transport?: McpTransport
  apiKey?: string
  title?: string
  showHeader?: boolean
}

export default function McpInstallation({
  transport = 'http',
  apiKey,
  title = 'Installation',
  showHeader = true
}: McpInstallationProps) {
  const [open, setOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client>(clients[0])

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

  const getStdioConfig = (key: string) =>
    JSON.stringify(
      {
        mcpServers: {
          [MCP_SERVER_NAME]: {
            command: 'npx',
            args: ['-y', MCP_NPX_PACKAGE],
            env: {
              MLINK_API_KEY: key
            }
          }
        }
      },
      null,
      2
    )

  const mcpConfig =
    transport === 'http' ? getHttpConfig() : getStdioConfig(apiKey || 'YOUR_API_KEY')

  const renderClaudeCodeHttpInstructions = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Add the MCP server to your project config using the command line:
        </p>
        {apiKey ? (
          <CodeBlock>{`claude mcp add --transport http ${MCP_SERVER_NAME} "${MCP_URL}" --header "Authorization: Bearer ${apiKey}"`}</CodeBlock>
        ) : (
          <CodeBlock>{`claude mcp add --scope project --transport http ${MCP_SERVER_NAME} "${MCP_URL}"`}</CodeBlock>
        )}
      </div>

      {apiKey ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Or add this configuration directly to <code className="text-foreground">.mcp.json</code>
            :
          </p>
          <CodeBlock>
            {JSON.stringify(
              {
                mcpServers: {
                  [MCP_SERVER_NAME]: {
                    type: 'http',
                    url: MCP_URL,
                    headers: {
                      Authorization: `Bearer ${apiKey}`
                    }
                  }
                }
              },
              null,
              2
            )}
          </CodeBlock>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Alternatively, add this configuration to{' '}
              <code className="text-foreground">.mcp.json</code>:
            </p>
            <CodeBlock>{mcpConfig}</CodeBlock>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              After configuring the MCP server, you need to authenticate. In a regular terminal (not
              the IDE extension) run:
            </p>
            <CodeBlock>claude /mcp</CodeBlock>
            <p className="text-sm text-muted-foreground">
              Select the "{MCP_SERVER_NAME}" server, then "Authenticate" to begin the authentication
              flow.
            </p>
          </div>
        </>
      )}

      <div className="pt-2 border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          Need help?{' '}
          <a
            href="https://docs.anthropic.com/en/docs/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            View Claude Code docs
          </a>
        </p>
      </div>
    </div>
  )

  const renderClaudeCodeStdioInstructions = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Add the MCP server to your project config using the command line:
        </p>
        <CodeBlock>{`claude mcp add --scope project ${MCP_SERVER_NAME} -- npx -y ${MCP_NPX_PACKAGE}`}</CodeBlock>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Then set the API key as an environment variable:
        </p>
        <CodeBlock>{`claude mcp update ${MCP_SERVER_NAME} --env MLINK_API_KEY=${apiKey || 'YOUR_API_KEY'}`}</CodeBlock>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Or add this configuration directly to <code className="text-foreground">.mcp.json</code>:
        </p>
        <CodeBlock>{mcpConfig}</CodeBlock>
      </div>

      <div className="pt-2 border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          Need help?{' '}
          <a
            href="https://docs.anthropic.com/en/docs/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            View Claude Code docs
          </a>
        </p>
      </div>
    </div>
  )

  const renderGenericHttpInstructions = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Add this configuration to your MCP settings:
        </p>
        <CodeBlock>{mcpConfig}</CodeBlock>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          After configuring the MCP server, authenticate using your client's MCP authentication
          flow.
        </p>
      </div>

      <div className="pt-2 border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          Need help?{' '}
          <a
            href="https://modelcontextprotocol.io/quickstart"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            View MCP docs
          </a>
        </p>
      </div>
    </div>
  )

  const renderGenericStdioInstructions = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Add this configuration to your MCP settings:
        </p>
        <CodeBlock>{mcpConfig}</CodeBlock>
      </div>

      <div className="pt-2 border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          Need help?{' '}
          <a
            href="https://modelcontextprotocol.io/quickstart"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            View MCP docs
          </a>
        </p>
      </div>
    </div>
  )

  const renderInstructions = () => {
    if (selectedClient.id === 'claude-code') {
      return transport === 'http'
        ? renderClaudeCodeHttpInstructions()
        : renderClaudeCodeStdioInstructions()
    }
    return transport === 'http' ? renderGenericHttpInstructions() : renderGenericStdioInstructions()
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        {showHeader && <h2 className="text-lg font-medium">{title}</h2>}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between gap-2 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <img
                  src={selectedClient.icon}
                  alt={`${selectedClient.name} logo`}
                  width={14}
                  height={14}
                />
                <span>{selectedClient.name}</span>
              </span>
              <CaretDown className="size-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search client..." />
              <CommandList>
                <CommandEmpty>No client found.</CommandEmpty>
                <CommandGroup>
                  {clients.map(client => (
                    <CommandItem
                      key={client.id}
                      value={client.name}
                      onSelect={() => {
                        setSelectedClient(client)
                        setOpen(false)
                      }}
                      className="cursor-pointer"
                    >
                      <img
                        src={client.icon}
                        alt={`${client.name} logo`}
                        width={14}
                        height={14}
                        className="mr-2"
                      />
                      {client.name}
                      <Check
                        className={cn(
                          'ml-auto size-4',
                          selectedClient.id === client.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {renderInstructions()}
    </div>
  )
}
