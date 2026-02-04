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
const MCP_SERVER_NAME = 'mlink'

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

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('group relative isolate max-w-full', className)}>
      <pre className="max-w-full whitespace-pre-wrap break-words md:whitespace-nowrap md:overflow-x-auto rounded-lg border border-border/50 bg-secondary/50 p-4 pr-20 text-sm md:text-base text-left">
        <code className="text-foreground/90">{children}</code>
      </pre>
      <motion.button
        onClick={handleCopy}
        className={cn(
          'absolute right-2 top-2 z-20 flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium shadow-sm transition-opacity',
          copied
            ? 'border-green-600/50 bg-green-100 text-green-700 opacity-100 dark:bg-green-950 dark:text-green-400'
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

export default function McpQuickStart() {
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

  const getCommand = () => {
    if (selectedClient.id === 'claude-code') {
      return `claude mcp add --transport http ${MCP_SERVER_NAME} "${MCP_URL}"`
    }
    if (selectedClient.id === 'gemini-cli') {
      return `gemini mcp add --transport http ${MCP_SERVER_NAME} "${MCP_URL}"`
    }
    return getHttpConfig()
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <p className="text-sm text-muted-foreground">Get started in seconds</p>

      <div className="flex items-center justify-center gap-3">
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
                />
                <span>{selectedClient.name}</span>
              </span>
              <CaretDown className="size-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
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

      <CodeBlock>{getCommand()}</CodeBlock>

      {/* Works with row */}
      <div className="flex items-center justify-center gap-3 pt-2 text-xs text-muted-foreground">
        <span>Supported by</span>
        <div className="flex items-center gap-2">
          {clients.map(client => (
            <img
              key={client.id}
              src={client.icon}
              alt={client.name}
              className="size-4 opacity-70"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
