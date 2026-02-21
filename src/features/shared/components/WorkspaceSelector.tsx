import { useApolloClient } from '@apollo/client'
import { CaretDown, Check, Plus } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useListWorkspacesQuery } from '@/features/shared/graphql/graphql'
import { useWorkspaceStore } from '@/features/shared/hooks/useWorkspaceStore'
import { cn } from '@/lib/utils'

export default function WorkspaceSelector() {
  const [open, setOpen] = useState(false)
  const apolloClient = useApolloClient()
  const { selectedSlug, setSelectedSlug, workspaces, setWorkspaces } = useWorkspaceStore()
  const { data } = useListWorkspacesQuery()

  useEffect(() => {
    if (data?.listWorkspaces?.length) {
      setWorkspaces(
        data.listWorkspaces.map((w) => ({
          id: w.id,
          name: w.name,
          slug: w.slug,
          isPersonal: w.isPersonal,
          role: w.role
        }))
      )
    }
  }, [data, setWorkspaces])

  if (workspaces.length === 0) {
    return null
  }

  const currentWorkspace = workspaces.find((w) => w.slug === selectedSlug) ?? workspaces[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <span className="text-muted-foreground">Workspace:</span>
          {currentWorkspace?.name ?? 'Workspace'}
          <CaretDown className="size-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No workspaces found.</CommandEmpty>
            <CommandGroup>
              {workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  value={workspace.name}
                  onSelect={() => {
                    setSelectedSlug(workspace.slug)
                    setOpen(false)
                    void apolloClient.resetStore()
                  }}
                  className="cursor-pointer"
                >
                  {workspace.name}
                  <Check
                    className={cn(
                      'ml-auto size-4',
                      workspace.slug === selectedSlug ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <div className="p-1">
            <button
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Plus className="size-4" />
              Create Workspace
            </button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
