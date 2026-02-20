import { CaretDown, Check, Copy } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const MCP_URL = import.meta.env.VITE_MCP_DOMAIN || 'https://mcp.ml.ink/mcp'
const MCP_SERVER_NAME = 'ink'

interface Client {
  id: string
  name: string
  icon: string
}

const clients: Client[] = [
  { id: 'claude-code', name: 'Claude Code', icon: '/icons/mcp-clients/claude-dark-icon.svg' },
  { id: 'gemini-cli', name: 'Gemini CLI', icon: '/icons/mcp-clients/gemini-cli-dark-icon.svg' },
  { id: 'cursor', name: 'Cursor', icon: '/icons/mcp-clients/cursor-dark-icon.svg' },
  { id: 'vscode', name: 'VS Code', icon: '/icons/mcp-clients/vscode-dark-icon.svg' },
  { id: 'codex', name: 'Codex', icon: '/icons/mcp-clients/openai-dark-icon.svg' }
]

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
  const [open, setOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client>(clients[0])
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
    return getHttpConfig()
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <p className={cn('text-sm', isDark ? 'text-neutral-400' : 'text-muted-foreground')}>
        Get started in seconds
      </p>

      <div className="flex items-center justify-center gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                'cursor-pointer justify-between gap-2',
                isDark && 'border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white'
              )}
            >
              <span className="flex items-center gap-2">
                <img
                  src={selectedClient.icon}
                  alt={`${selectedClient.name} logo`}
                  width={14}
                  height={14}
                  className={isDark ? '' : 'invert'}
                />
                <span>{selectedClient.name}</span>
              </span>
              <CaretDown className="size-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 bg-neutral-900 border-white/10">
            <Command className="bg-transparent">
              <CommandList>
                <CommandEmpty className="text-white/60">No client found.</CommandEmpty>
                <CommandGroup>
                  {clients.map(client => (
                    <CommandItem
                      key={client.id}
                      value={client.name}
                      onSelect={() => {
                        setSelectedClient(client)
                        setOpen(false)
                      }}
                      className="cursor-pointer text-white/90 data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
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

      <CodeBlock variant={variant}>{getCommand()}</CodeBlock>
    </div>
  )
}
