import { CaretDown, Check } from '@phosphor-icons/react'
import { useState } from 'react'

import { MCP_CLIENTS, type McpClient } from './mcp-clients'
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

type ClientSelectorVariant = 'transparent' | 'solid'

interface ClientSelectorProps {
  selectedClient: McpClient
  onClientChange: (client: McpClient) => void
  variant?: ClientSelectorVariant
}

const triggerStyles: Record<ClientSelectorVariant, string> = {
  transparent: 'border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white',
  solid: 'border-white/20 bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white'
}

export default function ClientSelector({
  selectedClient,
  onClientChange,
  variant = 'solid'
}: ClientSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('cursor-pointer justify-between gap-2', triggerStyles[variant])}
        >
          <span className="flex items-center gap-2">
            {selectedClient.icon && (
              <img
                src={selectedClient.icon}
                alt={`${selectedClient.name} logo`}
                width={14}
                height={14}
              />
            )}
            <span>{selectedClient.name}</span>
          </span>
          <CaretDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-neutral-900 border-white/10">
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search client..."
            className="text-white/90 placeholder:text-white/40"
          />
          <CommandList>
            <CommandEmpty className="text-white/60">No client found.</CommandEmpty>
            <CommandGroup>
              {MCP_CLIENTS.map(client => (
                <CommandItem
                  key={client.id}
                  value={client.name}
                  onSelect={() => {
                    onClientChange(client)
                    setOpen(false)
                  }}
                  className="cursor-pointer text-white/90 data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
                >
                  {client.icon && (
                    <img
                      src={client.icon}
                      alt={`${client.name} logo`}
                      width={14}
                      height={14}
                      className="mr-2"
                    />
                  )}
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
  )
}
