import { GithubLogo } from '@phosphor-icons/react'
import { Link, useLocation } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { useAuth, UserProfile } from '@/features/auth'

export default function Header() {
  const { user, signIn } = useAuth()
  const location = useLocation()
  const isOnboarding = location.pathname.startsWith('/onboarding')

  // Simplified header for onboarding
  if (isOnboarding) {
    return (
      <header className="sticky top-0 z-50 h-14 px-6 flex items-center">
        <Link to="/" className="font-semibold tracking-tight font-mono">
          Ink MCP
        </Link>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 h-14 px-6 flex items-center justify-between pointer-events-none">
      <nav className="flex items-center gap-2 pointer-events-auto">
        <Link to="/" className="font-semibold tracking-tight font-mono">
          Ink MCP
        </Link>
      </nav>

      <div className="flex items-center gap-2 pointer-events-auto font-mono">
        {!user && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/features">Features</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/pricing">Pricing</Link>
            </Button>
          </>
        )}
        <Button variant="ghost" size="sm" asChild>
          <Link to="/docs">Docs</Link>
        </Button>
        {user ? (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/settings/api-keys">API Keys</Link>
            </Button>
            <UserProfile />
          </>
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
