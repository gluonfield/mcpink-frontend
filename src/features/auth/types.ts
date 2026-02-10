export interface User {
  id: string
  email?: string | null
  displayName?: string | null
  githubUsername?: string | null
  avatarUrl?: string | null
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

export interface AuthProviderProps {
  children: React.ReactNode
}
