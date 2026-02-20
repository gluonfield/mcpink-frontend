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

const MCP_URL = import.meta.env.VITE_MCP_DOMAIN || 'https://mcp.ml.ink/mcp'
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
    <div className={cn('group relative isolate max-w-full', className)}>
      <pre className="max-w-full whitespace-pre-wrap break-words rounded-lg border border-border/50 bg-secondary/50 p-3 pr-16 text-sm">
        <code className="text-foreground/90">{children}</code>
      </pre>
      <motion.button
        onClick={handleCopy}
        className={cn(
          'absolute right-2 top-2 z-20 flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium shadow-sm transition-opacity',
          copied
            ? 'border-green-600/50 bg-green-100 text-green-700 opacity-100'
            : 'border-border bg-background text-muted-foreground opacity-50 hover:opacity-100 group-hover:opacity-100'
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

type Scope = 'project' | 'user'

export default function McpInstallation({
  transport = 'http',
  apiKey,
  title = 'Installation',
  showHeader = true
}: McpInstallationProps) {
  const [open, setOpen] = useState(false)
  const [scopeOpen, setScopeOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client>(clients[0])
  const [selectedScope, setSelectedScope] = useState<Scope>('project')

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

  const renderClaudeCodeHttpInstructions = () => {
    const scopeFlag = selectedScope === 'user' ? '-s user' : ''
    const scopeText = selectedScope === 'user' ? 'user' : 'project'

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Add the MCP server to your {scopeText} config using the command line:
          </p>
          {apiKey ? (
            <CodeBlock>{`claude mcp add${scopeFlag ? ` ${scopeFlag}` : ''} --transport http ${MCP_SERVER_NAME} "${MCP_URL}" --header "Authorization: Bearer ${apiKey}"`}</CodeBlock>
          ) : (
            <CodeBlock>{`claude mcp add${scopeFlag ? ` ${scopeFlag}` : ''} --transport http ${MCP_SERVER_NAME} "${MCP_URL}"`}</CodeBlock>
          )}
        </div>

        <div className="border-t border-border/50 pt-2">
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <a
              href="https://code.claude.com/docs/en/mcp#mcp-installation-scopes"
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
  }

  const renderClaudeCodeStdioInstructions = () => {
    const scopeFlag = selectedScope === 'user' ? '-s user' : ''
    const scopeText = selectedScope === 'user' ? 'user' : 'project'

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Add the MCP server to your {scopeText} config using the command line:
          </p>
          <CodeBlock>{`claude mcp add${scopeFlag ? ` ${scopeFlag}` : ''} ${MCP_SERVER_NAME} -- npx -y ${MCP_NPX_PACKAGE}`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Then set the API key as an environment variable:
          </p>
          <CodeBlock>{`claude mcp update ${MCP_SERVER_NAME} --env MLINK_API_KEY=${apiKey || 'YOUR_API_KEY'}`}</CodeBlock>
        </div>

        <div className="border-t border-border/50 pt-2">
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <a
              href="https://code.claude.com/docs/en/mcp#mcp-installation-scopes"
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
  }

  const renderGeminiCliHttpInstructions = () => {
    const scopeFlag = selectedScope === 'user' ? '-s user' : ''
    const scopeText = selectedScope === 'user' ? 'user' : 'project'

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Add the MCP server to your {scopeText} config using the command line:
          </p>
          {apiKey ? (
            <CodeBlock>{`gemini mcp add${scopeFlag ? ` ${scopeFlag}` : ''} --transport http ${MCP_SERVER_NAME} "${MCP_URL}" --header "Authorization: Bearer ${apiKey}"`}</CodeBlock>
          ) : (
            <CodeBlock>{`gemini mcp add${scopeFlag ? ` ${scopeFlag}` : ''} --transport http ${MCP_SERVER_NAME} "${MCP_URL}"`}</CodeBlock>
          )}
        </div>
      </div>
    )
  }

  const renderGeminiCliStdioInstructions = () => {
    const scopeFlag = selectedScope === 'user' ? '-s user' : ''
    const scopeText = selectedScope === 'user' ? 'user' : 'project'

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Add the MCP server to your {scopeText} config using the command line:
          </p>
          <CodeBlock>{`gemini mcp add${scopeFlag ? ` ${scopeFlag}` : ''} ${MCP_SERVER_NAME} "npx -y ${MCP_NPX_PACKAGE}" --env MLINK_API_KEY=${apiKey || 'YOUR_API_KEY'}`}</CodeBlock>
        </div>
      </div>
    )
  }

  const renderCodexHttpInstructions = () =>
    apiKey ? (
      <CodeBlock>{`codex mcp add ${MCP_SERVER_NAME} --url "${MCP_URL}" --bearer-token-env-var MLINK_API_KEY`}</CodeBlock>
    ) : (
      <CodeBlock>{`codex mcp add ${MCP_SERVER_NAME} --url "${MCP_URL}"`}</CodeBlock>
    )

  const renderCodexStdioInstructions = () => (
    <CodeBlock>{`codex mcp add ${MCP_SERVER_NAME} --env MLINK_API_KEY=${apiKey || 'YOUR_API_KEY'} -- npx -y ${MCP_NPX_PACKAGE}`}</CodeBlock>
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
    if (selectedClient.id === 'gemini-cli') {
      return transport === 'http'
        ? renderGeminiCliHttpInstructions()
        : renderGeminiCliStdioInstructions()
    }
    if (selectedClient.id === 'codex') {
      return transport === 'http' ? renderCodexHttpInstructions() : renderCodexStdioInstructions()
    }
    return transport === 'http' ? renderGenericHttpInstructions() : renderGenericStdioInstructions()
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {showHeader && <h2 className="text-lg font-medium">{title}</h2>}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="cursor-pointer justify-between gap-2"
            >
              <span className="flex items-center gap-2">
                <img
                  src={selectedClient.icon}
                  alt={`${selectedClient.name} logo`}
                  width={14}
                  height={14}
                  className="invert"
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
                        className="mr-2 invert"
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

        {(selectedClient.id === 'claude-code' || selectedClient.id === 'gemini-cli') && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Scope</span>
            <Popover open={scopeOpen} onOpenChange={setScopeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={scopeOpen}
                  className="cursor-pointer justify-between gap-2"
                >
                  <span>{selectedScope === 'project' ? 'Project' : 'User'}</span>
                  <CaretDown className="size-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[140px] p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem
                        value="project"
                        onSelect={() => {
                          setSelectedScope('project')
                          setScopeOpen(false)
                        }}
                        className="cursor-pointer"
                      >
                        Project
                        <Check
                          className={cn(
                            'ml-auto size-4',
                            selectedScope === 'project' ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                      <CommandItem
                        value="user"
                        onSelect={() => {
                          setSelectedScope('user')
                          setScopeOpen(false)
                        }}
                        className="cursor-pointer"
                      >
                        User
                        <Check
                          className={cn(
                            'ml-auto size-4',
                            selectedScope === 'user' ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {renderInstructions()}
    </div>
  )
}
