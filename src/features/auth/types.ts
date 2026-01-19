export interface User {
  id: string
  githubUsername: string
  avatarUrl?: string | null
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: () => void
  signOut: () => Promise<void>
}

export interface AuthProviderProps {
  children: React.ReactNode
}
