import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuth, UserProfile } from '@/features/auth'

export default function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <nav className="flex items-center gap-1">
          <Link to="/" className="mr-4 flex items-center gap-2 font-semibold tracking-tight">
            MCP Deploy
          </Link>
          {user && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Button variant="ghost" size="sm" asChild>
                <Link to="/settings/api-keys">API Keys</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/settings/flyio">Fly.io</Link>
              </Button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <UserProfile />
          ) : (
            <Button size="sm" asChild>
              <Link to="/">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
