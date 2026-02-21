import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface StoredWorkspace {
  id: string
  name: string
  slug: string
  isPersonal: boolean
  role: string
}

interface WorkspaceState {
  selectedSlug: string
  workspaces: StoredWorkspace[]
  setSelectedSlug: (slug: string) => void
  setWorkspaces: (workspaces: StoredWorkspace[]) => void
  reset: () => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      selectedSlug: 'default',
      workspaces: [],
      setSelectedSlug: (slug: string) => set({ selectedSlug: slug }),
      setWorkspaces: (workspaces: StoredWorkspace[]) => set({ workspaces }),
      reset: () => set({ selectedSlug: 'default', workspaces: [] })
    }),
    { name: 'workspace-storage' }
  )
)
