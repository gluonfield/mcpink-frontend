import { CaretDown } from '@phosphor-icons/react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Spinner } from '@/components/ui/spinner'
import { useListProjectsQuery } from '@/features/shared/graphql/graphql'
import { useWorkspaceStore } from '@/features/shared/hooks/useWorkspaceStore'

export default function ProjectsDropdown() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const selectedSlug = useWorkspaceStore(s => s.selectedSlug)
  const { data, loading } = useListProjectsQuery({
    variables: { first: 50, workspaceSlug: selectedSlug }
  })

  const projects = data?.listProjects.nodes ?? []

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          Projects
          <CaretDown className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Spinner className="size-4" />
              </div>
            ) : (
              <>
                <CommandEmpty>No projects found.</CommandEmpty>
                <CommandGroup>
                  {projects.map(project => (
                    <CommandItem
                      key={project.id}
                      value={project.name}
                      onSelect={() => {
                        setOpen(false)
                        void navigate({
                          to: '/projects/$projectId',
                          params: { projectId: project.id }
                        })
                      }}
                    >
                      {project.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
          <CommandSeparator />
          <div className="p-1">
            <Link
              to="/projects"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground block px-2 py-1.5 text-sm"
            >
              View all projects
            </Link>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
