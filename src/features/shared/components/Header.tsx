import { GithubLogo } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { useAuth, UserProfile } from '@/features/auth'

export default function Header() {
  const { user, signIn } = useAuth()

  return (
    <header className="sticky top-0 z-50 h-14 px-6 flex items-center justify-between pointer-events-none">
      <nav className="flex items-center gap-2 pointer-events-auto">
        <Link to="/" className="font-semibold tracking-tight">
          Ink MCP
        </Link>
        {user && (
          <Button variant="ghost" size="sm" asChild>
            <Link to="/settings/api-keys">API Keys</Link>
          </Button>
        )}
      </nav>

      <div className="flex items-center gap-2 pointer-events-auto">
        <Button variant="ghost" size="sm" asChild>
          <a href="/features">Features</a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href="/pricing">Pricing</a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href="/docs">Docs</a>
        </Button>
        {user ? (
          <UserProfile />
        ) : (
          <Button size="sm" onClick={signIn} className="gap-2 cursor-pointer">
            <GithubLogo weight="fill" className="size-4" />
            Sign in with GitHub
          </Button>
        )}
      </div>
    </header>
  )
}
